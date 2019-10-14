"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.regexp.replace");

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var fs = require('fs');

var path = require('path');

var mkdirp = require('mkdirp');

var normalize = require('normalize-path');

var loaderUtils = require('loader-utils');

var enhancedResolve = require('enhanced-resolve/lib/node');

var Module = require('./babel/module');

var transform = require('./transform');

module.exports = function loader(content, inputSourceMap) {
  var _this = this;

  var _ref = loaderUtils.getOptions(this) || {},
      sourceMap = _ref.sourceMap,
      _ref$cacheDirectory = _ref.cacheDirectory,
      cacheDirectory = _ref$cacheDirectory === void 0 ? '.linaria-cache' : _ref$cacheDirectory,
      preprocessor = _ref.preprocessor,
      rest = _objectWithoutPropertiesLoose(_ref, ["sourceMap", "cacheDirectory", "preprocessor"]);

  var outputFilename = path.join(path.isAbsolute(cacheDirectory) ? cacheDirectory : path.join(process.cwd(), cacheDirectory), path.relative(process.cwd(), this.resourcePath.replace(/\.[^.]+$/, '.linaria.css')));
  var resolveOptions = {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  };
  var resolveSync = enhancedResolve.create.sync( // this._compilation is a deprecated API
  // However there seems to be no other way to access webpack's resolver
  // There is this.resolve, but it's asynchronous
  // Another option is to read the webpack.config.js, but it won't work for programmatic usage
  // This API is used by many loaders/plugins, so hope we're safe for a while
  this._compilation && this._compilation.options.resolve ? Object.assign({}, resolveOptions, {
    alias: this._compilation.options.resolve.alias
  }) : resolveOptions);
  var result;
  var originalResolveFilename = Module._resolveFilename;

  try {
    // Use webpack's resolution when evaluating modules
    Module._resolveFilename = function (id, _ref2) {
      var filename = _ref2.filename;
      return resolveSync(path.dirname(filename), id);
    };

    result = transform(content, {
      filename: this.resourcePath,
      inputSourceMap: inputSourceMap != null ? inputSourceMap : undefined,
      outputFilename: outputFilename,
      pluginOptions: rest,
      preprocessor: preprocessor
    });
  } finally {
    // Restore original behaviour
    Module._resolveFilename = originalResolveFilename;
  }

  if (result.cssText) {
    var _result = result,
        cssText = _result.cssText;

    if (sourceMap) {
      cssText += "/*# sourceMappingURL=data:application/json;base64," + Buffer.from(result.cssSourceMapText || '').toString('base64') + "*/";
    }

    if (result.dependencies && result.dependencies.length) {
      result.dependencies.forEach(function (dep) {
        try {
          var f = resolveSync(path.dirname(_this.resourcePath), dep);

          _this.addDependency(f);
        } catch (e) {
          console.warn("[linaria] failed to add dependency for: " + dep, e);
        }
      });
    } // Read the file first to compare the content
    // Write the new content only if it's changed
    // This will prevent unnecessary WDS reloads


    var currentCssText;

    try {
      currentCssText = fs.readFileSync(outputFilename, 'utf-8');
    } catch (e) {// Ignore error
    }

    if (currentCssText !== cssText) {
      mkdirp.sync(path.dirname(outputFilename));
      fs.writeFileSync(outputFilename, cssText);
    }

    this.callback(null, result.code + "\n\nrequire(\"" + normalize(outputFilename) + "\");", result.sourceMap);
    return;
  }

  this.callback(null, result.code, result.sourceMap);
};
//# sourceMappingURL=loader.js.map
"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.regexp.replace");

var _path = _interopRequireDefault(require("path"));

var babel = _interopRequireWildcard(require("@babel/core"));

var _stylis = _interopRequireDefault(require("stylis"));

var _sourceMap = require("source-map");

var _loadOptions = _interopRequireDefault(require("./babel/utils/loadOptions"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STYLIS_DECLARATION = 1;

module.exports = function transform(code, options) {
  // Check if the file contains `css` or `styled` words first
  // Otherwise we should skip transforming
  if (!/\b(styled|css)/.test(code)) {
    return {
      code: code,
      sourceMap: options.inputSourceMap
    };
  }

  var pluginOptions = (0, _loadOptions.default)(options.pluginOptions); // Parse the code first so babel uses user's babel config for parsing
  // We don't want to use user's config when transforming the code

  var ast = babel.parseSync(code, Object.assign({}, pluginOptions ? pluginOptions.babelOptions : null, {
    filename: options.filename,
    caller: {
      name: 'linaria'
    }
  }));

  var _babel$transformFromA = babel.transformFromAstSync(ast, code, {
    filename: options.filename,
    presets: [[require.resolve('./babel'), pluginOptions]],
    babelrc: false,
    configFile: false,
    sourceMaps: true,
    sourceFileName: options.filename,
    inputSourceMap: options.inputSourceMap
  }),
      metadata = _babel$transformFromA.metadata,
      transformedCode = _babel$transformFromA.code,
      map = _babel$transformFromA.map;

  if (!metadata.linaria) {
    return {
      code: code,
      sourceMap: options.inputSourceMap
    };
  }

  var _metadata$linaria = metadata.linaria,
      rules = _metadata$linaria.rules,
      replacements = _metadata$linaria.replacements,
      dependencies = _metadata$linaria.dependencies;
  var mappings = [];
  var cssText = '';
  var preprocessor;

  if (typeof options.preprocessor === 'function') {
    // eslint-disable-next-line prefer-destructuring
    preprocessor = options.preprocessor;
  } else {
    switch (options.preprocessor) {
      case 'none':
        preprocessor = function preprocessor(selector, text) {
          return selector + " {" + text + "}\n";
        };

        break;

      case 'stylis':
      default:
        _stylis.default.use(null)(function (context, decl) {
          if (context === STYLIS_DECLARATION && options.outputFilename) {
            // When writing to a file, we need to adjust the relative paths inside url(..) expressions
            // It'll allow css-loader to resolve an imported asset properly
            return decl.replace(/\b(url\()(\.[^)]+)(\))/g, function (match, p1, p2, p3) {
              return p1 + // Replace asset path with new path relative to the output CSS
              _path.default.relative(
              /* $FlowFixMe */
              _path.default.dirname(options.outputFilename), // Get the absolute path to the asset from the path relative to the JS file
              _path.default.resolve(_path.default.dirname(options.filename), p2)) + p3;
            });
          }

          return decl;
        });

        preprocessor = _stylis.default;
    }
  }

  Object.keys(rules).forEach(function (selector, index) {
    mappings.push({
      generated: {
        line: index + 1,
        column: 0
      },
      original: rules[selector].start,
      name: selector
    }); // Run each rule through stylis to support nesting

    cssText += preprocessor(selector, rules[selector].cssText) + "\n";
  });
  return {
    code: transformedCode,
    cssText: cssText,
    rules: rules,
    replacements: replacements,
    dependencies: dependencies,
    sourceMap: map,

    get cssSourceMapText() {
      if (mappings && mappings.length) {
        var generator = new _sourceMap.SourceMapGenerator({
          file: options.filename.replace(/\.js$/, '.css')
        });
        mappings.forEach(function (mapping) {
          return generator.addMapping(Object.assign({}, mapping, {
            source: options.filename
          }));
        });
        generator.setSourceContent(options.filename, code);
        return generator.toString();
      }

      return '';
    }

  };
};
//# sourceMappingURL=transform.js.map
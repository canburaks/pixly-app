"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.regexp.replace");

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _require = require('rollup-pluginutils'),
    createFilter = _require.createFilter;

var _transform = require('./transform');

var slugify = require('./slugify');

module.exports = function linaria(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      include = _ref.include,
      exclude = _ref.exclude,
      sourceMap = _ref.sourceMap,
      preprocessor = _ref.preprocessor,
      rest = _objectWithoutPropertiesLoose(_ref, ["include", "exclude", "sourceMap", "preprocessor"]);

  var filter = createFilter(include, exclude);
  var cssLookup = {};
  return {
    name: 'linaria',
    load: function load(id) {
      return cssLookup[id];
    },

    /* eslint-disable-next-line consistent-return */
    resolveId: function resolveId(importee) {
      if (importee in cssLookup) return importee;
    },
    transform: function transform(code, id) {
      if (!filter(id)) return;

      var result = _transform(code, {
        filename: id,
        preprocessor: preprocessor,
        pluginOptions: rest
      });

      if (!result.cssText) return;
      var cssText = result.cssText;
      var slug = slugify(id);
      var filename = id.replace(/\.js$/, '') + "_" + slug + ".css";

      if (sourceMap && result.cssSourceMapText) {
        var map = Buffer.from(result.cssSourceMapText).toString('base64');
        cssText += "/*# sourceMappingURL=data:application/json;base64," + map + "*/";
      }

      cssLookup[filename] = cssText;
      result.code += "\nimport " + JSON.stringify(filename) + ";\n";
      /* eslint-disable-next-line consistent-return */

      return {
        code: result.code,
        map: result.sourceMap
      };
    }
  };
};
//# sourceMappingURL=rollup.js.map
"use strict";

var _module = _interopRequireDefault(require("./module"));

var _TaggedTemplateExpression2 = _interopRequireDefault(require("./visitors/TaggedTemplateExpression"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
module.exports = function extract(babel, options) {
  var t = babel.types;
  return {
    visitor: {
      Program: {
        enter: function enter(path, state) {
          // Collect all the style rules from the styles we encounter
          state.rules = {};
          state.index = -1;
          state.dependencies = [];
          state.replacements = []; // Invalidate cache for module evaluation to get fresh modules

          _module.default.invalidate(); // We need our transforms to run before anything else
          // So we traverse here instead of a in a visitor


          path.traverse({
            TaggedTemplateExpression: function TaggedTemplateExpression(p) {
              return (0, _TaggedTemplateExpression2.default)(p, state, t, options);
            }
          });
        },
        exit: function exit(path, state) {
          if (Object.keys(state.rules).length) {
            // Store the result as the file metadata
            state.file.metadata = {
              linaria: {
                rules: state.rules,
                replacements: state.replacements,
                dependencies: state.dependencies
              }
            };
          } // Invalidate cache for module evaluation when we're done


          _module.default.invalidate();
        }
      }
    }
  };
};
//# sourceMappingURL=extract.js.map
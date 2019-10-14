"use strict";

var syntax = require('@babel/plugin-syntax-dynamic-import').default;

function dynamic(_ref) {
  var t = _ref.types;
  return {
    inherits: syntax,
    visitor: {
      Import: function Import(path) {
        var noop = t.arrowFunctionExpression([], t.identifier('undefined'));
        path.parentPath.replaceWith(t.objectExpression([t.objectProperty(t.identifier('then'), noop), t.objectProperty(t.identifier('catch'), noop)]));
      }
    }
  };
}

module.exports = dynamic;
//# sourceMappingURL=dynamic-import-noop.js.map
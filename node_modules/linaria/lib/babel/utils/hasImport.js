"use strict";

exports.__esModule = true;
exports.default = hasImport;

var _path = require("path");

// Verify if the binding is imported from the specified source
function hasImport(t, scope, filename, identifier, source) {
  var binding = scope.getAllBindings()[identifier];

  if (!binding) {
    return false;
  }

  var p = binding.path;

  var resolveFromFile = function resolveFromFile(id) {
    /* $FlowFixMe */
    var M = require('module');

    try {
      return M._resolveFilename(id, {
        id: filename,
        filename: filename,
        paths: M._nodeModulePaths((0, _path.dirname)(filename))
      });
    } catch (e) {
      return null;
    }
  };

  var isImportingModule = function isImportingModule(value) {
    return (// If the value is an exact match, assume it imports the module
      value === source || // Otherwise try to resolve both and check if they are the same file
      resolveFromFile(value) === ( // eslint-disable-next-line no-nested-ternary
      source === 'linaria' ? require.resolve('../../index') : source === 'linaria/react' ? require.resolve('../../react/') : resolveFromFile(source))
    );
  };

  if (t.isImportSpecifier(p) && t.isImportDeclaration(p.parentPath)) {
    return isImportingModule(p.parentPath.node.source.value);
  }

  if (t.isVariableDeclarator(p)) {
    if (t.isCallExpression(p.node.init) && t.isIdentifier(p.node.init.callee) && p.node.init.callee.name === 'require' && p.node.init.arguments.length === 1) {
      var node = p.node.init.arguments[0];

      if (t.isStringLiteral(node)) {
        return isImportingModule(node.value);
      }

      if (t.isTemplateLiteral(node) && node.quasis.length === 1) {
        return isImportingModule(node.quasis[0].value.cooked);
      }
    }
  }

  return false;
}
//# sourceMappingURL=hasImport.js.map
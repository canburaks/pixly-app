"use strict";

exports.__esModule = true;
exports.default = TaggedTemplateExpression;

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.string.ends-with");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.constructor");

var _path = require("path");

var _reactIs = require("react-is");

var _generator = _interopRequireDefault(require("@babel/generator"));

var _evaluate2 = _interopRequireDefault(require("../evaluate"));

var _slugify = _interopRequireDefault(require("../../slugify"));

var _units = require("../units");

var _throwIfInvalid = _interopRequireDefault(require("../utils/throwIfInvalid"));

var _isSerializable = _interopRequireDefault(require("../utils/isSerializable"));

var _stripLines = _interopRequireDefault(require("../utils/stripLines"));

var _toValidCSSIdentifier = _interopRequireDefault(require("../utils/toValidCSSIdentifier"));

var _toCSS = _interopRequireDefault(require("../utils/toCSS"));

var _hasImport = _interopRequireDefault(require("../utils/hasImport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
// Match any valid CSS units followed by a separator such as ;, newline etc.
var unitRegex = new RegExp("^(" + _units.units.join('|') + ")(;|,|\n| |\\))");

function TaggedTemplateExpression(path, state, t, options) {
  var _path$node = path.node,
      quasi = _path$node.quasi,
      tag = _path$node.tag;
  var styled;
  var css;

  if (t.isCallExpression(tag) && t.isIdentifier(tag.callee) && tag.arguments.length === 1 && tag.callee.name === 'styled' && (0, _hasImport.default)(t, path.scope, state.file.opts.filename, 'styled', 'linaria/react')) {
    styled = {
      component: path.get('tag').get('arguments')[0]
    };
  } else if (t.isMemberExpression(tag) && t.isIdentifier(tag.object) && t.isIdentifier(tag.property) && tag.object.name === 'styled' && (0, _hasImport.default)(t, path.scope, state.file.opts.filename, 'styled', 'linaria/react')) {
    styled = {
      component: {
        node: t.stringLiteral(tag.property.name)
      }
    };
  } else if ((0, _hasImport.default)(t, path.scope, state.file.opts.filename, 'css', 'linaria')) {
    css = t.isIdentifier(tag) && tag.name === 'css';
  }

  if (!(styled || css)) {
    return;
  } // Increment the index of the style we're processing
  // This is used for slug generation to prevent collision
  // Also used for display name if it couldn't be determined


  state.index++;
  var interpolations = []; // Check if the variable is referenced anywhere for basic DCE
  // Only works when it's assigned to a variable

  var isReferenced = true; // Try to determine a readable class name

  var displayName;
  var parent = path.findParent(function (p) {
    return t.isObjectProperty(p) || t.isJSXOpeningElement(p) || t.isVariableDeclarator(p);
  });

  if (parent) {
    if (t.isObjectProperty(parent)) {
      displayName = parent.node.key.name || parent.node.key.value;
    } else if (t.isJSXOpeningElement(parent)) {
      displayName = parent.node.name.name;
    } else if (t.isVariableDeclarator(parent)) {
      var _path$scope$getBindin = path.scope.getBinding(parent.node.id.name),
          referencePaths = _path$scope$getBindin.referencePaths;

      isReferenced = referencePaths.length !== 0;
      displayName = parent.node.id.name;
    }
  }

  if (!displayName) {
    // Try to derive the path from the filename
    displayName = (0, _path.basename)(state.file.opts.filename);

    if (/^index\.[a-z0-9]+$/.test(displayName)) {
      // If the file name is 'index', better to get name from parent folder
      displayName = (0, _path.basename)((0, _path.dirname)(state.file.opts.filename));
    } // Remove the file extension


    displayName = displayName.replace(/\.[a-z0-9]+$/, '');

    if (displayName) {
      displayName += state.index;
    } else {
      throw path.buildCodeFrameError("Couldn't determine a name for the component. Ensure that it's either:\n" + '- Assigned to a variable\n' + '- Is an object property\n' + '- Is a prop in a JSX element\n');
    }
  } // Custom properties need to start with a letter, so we prefix the slug
  // Also use append the index of the class to the filename for uniqueness in the file


  var slug = (0, _toValidCSSIdentifier.default)("" + displayName.charAt(0).toLowerCase() + (0, _slugify.default)((0, _path.relative)(state.file.opts.root, state.file.opts.filename) + ":" + state.index));
  var className = options.displayName ? (0, _toValidCSSIdentifier.default)(displayName) + "_" + slug : slug; // Serialize the tagged template literal to a string

  var cssText = '';
  var expressions = path.get('quasi').get('expressions');
  quasi.quasis.forEach(function (el, i, self) {
    var appended = false;

    if (i !== 0) {
      // Check if previous expression was a CSS variable that we replaced
      // If it has a unit after it, we need to move the unit into the interpolation
      // e.g. `var(--size)px` should actually be `var(--size)`
      // So we check if the current text starts with a unit, and add the unit to the previous interpolation
      // Another approach would be `calc(var(--size) * 1px), but some browsers don't support all units
      // https://bugzilla.mozilla.org/show_bug.cgi?id=956573
      var matches = el.value.cooked.match(unitRegex);

      if (matches) {
        var last = interpolations[interpolations.length - 1];
        var unit = matches[1];

        if (last && cssText.endsWith("var(--" + last.id + ")")) {
          last.unit = unit;
          cssText += el.value.cooked.replace(unitRegex, '$2');
          appended = true;
        }
      }
    }

    if (!appended) {
      cssText += el.value.cooked;
    }

    var ex = expressions[i];

    if (ex) {
      var end = ex.node.loc.end;
      var result = ex.evaluate();
      var beforeLength = cssText.length; // The location will be end of the current string to start of next string

      var next = self[i + 1];
      var loc = {
        // +1 because the expressions location always shows 1 column before
        start: {
          line: el.loc.end.line,
          column: el.loc.end.column + 1
        },
        end: next ? {
          line: next.loc.start.line,
          column: next.loc.start.column
        } : {
          line: end.line,
          column: end.column + 1
        }
      };

      if (result.confident) {
        (0, _throwIfInvalid.default)(result.value, ex);

        if ((0, _isSerializable.default)(result.value)) {
          // If it's a plain object, convert it to a CSS string
          cssText += (0, _stripLines.default)(loc, (0, _toCSS.default)(result.value));
        } else {
          cssText += (0, _stripLines.default)(loc, result.value);
        }

        state.replacements.push({
          original: loc,
          length: cssText.length - beforeLength
        });
      } else {
        // Try to preval the value
        if (options.evaluate && !(t.isFunctionExpression(ex) || t.isArrowFunctionExpression(ex))) {
          var evaluation;

          try {
            evaluation = (0, _evaluate2.default)(ex, t, state.file.opts.filename, undefined, options);
          } catch (e) {
            throw ex.buildCodeFrameError("An error occurred when evaluating the expression: " + e.message + ". Make sure you are not using a browser or Node specific API.");
          }

          var _evaluation = evaluation,
              value = _evaluation.value,
              dependencies = _evaluation.dependencies;
          (0, _throwIfInvalid.default)(value, ex);

          if (typeof value !== 'function') {
            var _state$dependencies;

            // Only insert text for non functions
            // We don't touch functions because they'll be interpolated at runtime
            if ((0, _reactIs.isValidElementType)(value) && value.__linaria) {
              // If it's an React component wrapped in styled, get the class name
              // Useful for interpolating components
              cssText += "." + value.__linaria.className;
            } else if ((0, _isSerializable.default)(value)) {
              cssText += (0, _stripLines.default)(loc, (0, _toCSS.default)(value));
            } else {
              // For anything else, assume it'll be stringified
              cssText += (0, _stripLines.default)(loc, value);
            }

            (_state$dependencies = state.dependencies).push.apply(_state$dependencies, dependencies);

            state.replacements.push({
              original: loc,
              length: cssText.length - beforeLength
            });
            return;
          }
        }

        if (styled) {
          var id = slug + "-" + i;
          interpolations.push({
            id: id,
            node: ex.node,
            source: ex.getSource() || (0, _generator.default)(ex.node).code,
            unit: ''
          });
          cssText += "var(--" + id + ")";
        } else {
          // CSS custom properties can't be used outside components
          throw ex.buildCodeFrameError("The CSS cannot contain JavaScript expressions when using the 'css' tag. To evaluate the expressions at build time, pass 'evaluate: true' to the babel plugin.");
        }
      }
    }
  });
  var selector = "." + className;

  if (styled) {
    // If `styled` wraps another component and not a primitive,
    // get its class name to create a more specific selector
    // it'll ensure that styles are overridden properly
    if (options.evaluate && t.isIdentifier(styled.component.node)) {
      var _evaluate = (0, _evaluate2.default)(styled.component, t, state.file.opts.filename, undefined, options),
          value = _evaluate.value;

      while ((0, _reactIs.isValidElementType)(value) && value.__linaria) {
        selector += "." + value.__linaria.className;
        value = value.__linaria.extends;
      }
    }

    var props = [];
    props.push(t.objectProperty(t.identifier('name'), t.stringLiteral(displayName)));
    props.push(t.objectProperty(t.identifier('class'), t.stringLiteral(className))); // If we found any interpolations, also pass them so they can be applied

    if (interpolations.length) {
      // De-duplicate interpolations based on the source and unit
      // If two interpolations have the same source code and same unit,
      // we don't need to use 2 custom properties for them, we can use a single one
      var result = {};
      interpolations.forEach(function (it) {
        var key = it.source + it.unit;

        if (key in result) {
          cssText = cssText.replace("var(--" + it.id + ")", "var(--" + result[key].id + ")");
        } else {
          result[key] = it;
        }
      });
      props.push(t.objectProperty(t.identifier('vars'), t.objectExpression(Object.keys(result).map(function (key) {
        var _result$key = result[key],
            id = _result$key.id,
            node = _result$key.node,
            unit = _result$key.unit;
        var items = [node];

        if (unit) {
          items.push(t.stringLiteral(unit));
        }

        return t.objectProperty(t.stringLiteral(id), t.arrayExpression(items));
      }))));
    }

    path.replaceWith(t.callExpression(t.callExpression(t.identifier('styled'), [styled.component.node]), [t.objectExpression(props)]));
    path.addComment('leading', '#__PURE__');
  } else {
    path.replaceWith(t.stringLiteral(className));
  }

  if (!isReferenced && !cssText.includes(':global')) {
    return;
  }

  state.rules[selector] = {
    cssText: cssText,
    className: className,
    displayName: displayName,
    start: path.parent && path.parent.loc ? path.parent.loc.start : null
  };
}
//# sourceMappingURL=TaggedTemplateExpression.js.map
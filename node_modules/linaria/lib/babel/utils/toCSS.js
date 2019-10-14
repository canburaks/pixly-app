"use strict";

exports.__esModule = true;
exports.default = toCSS;

require("core-js/modules/es7.object.entries");

require("core-js/modules/es6.regexp.replace");

var _isSerializable = _interopRequireDefault(require("./isSerializable"));

var _units = require("../units");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hyphenate = function hyphenate(s) {
  return s // Hyphenate CSS property names from camelCase version from JS string
  .replace(/([A-Z])/g, function (match, p1) {
    return "-" + p1.toLowerCase();
  }) // Special case for `-ms` because in JS it starts with `ms` unlike `Webkit`
  .replace(/^ms-/, '-ms-');
};

// Some tools such as polished.js output JS objects
// To support them transparently, we convert JS objects to CSS strings
function toCSS(o) {
  if (Array.isArray(o)) {
    return o.map(toCSS).join('\n');
  }

  return Object.entries(o).filter(function (_ref) {
    var value = _ref[1];
    return (// Ignore all falsy values except numbers
      typeof value === 'number' || value
    );
  }).map(function (_ref2) {
    var key = _ref2[0],
        value = _ref2[1];

    if ((0, _isSerializable.default)(value)) {
      return key + " { " + toCSS(value) + " }";
    }

    return hyphenate(key) + ": " + (
    /* $FlowFixMe */
    typeof value === 'number' && value !== 0 && !_units.unitless[// Strip vendor prefixes when checking if the value is unitless
    key.replace(/^(Webkit|Moz|O|ms)([A-Z])(.+)$/, function (match, p1, p2, p3) {
      return "" + p2.toLowerCase() + p3;
    })] ? value + "px" : value) + ";";
  }).join(' ');
}
//# sourceMappingURL=toCSS.js.map
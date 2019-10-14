"use strict";

exports.__esModule = true;
exports.default = throwIfInvalid;

require("core-js/modules/es6.number.constructor");

require("core-js/modules/es6.number.is-finite");

var _generator = _interopRequireDefault(require("@babel/generator"));

var _isSerializable = _interopRequireDefault(require("./isSerializable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Throw if we can't handle the interpolated value
function throwIfInvalid(value, ex) {
  if (typeof value === 'function' || typeof value === 'string' || typeof value === 'number' && Number.isFinite(value) || (0, _isSerializable.default)(value)) {
    return;
  }

  var stringified = typeof value === 'object' ? JSON.stringify(value) : String(value);
  throw ex.buildCodeFrameError("The expression evaluated to '" + stringified + "', which is probably a mistake. If you want it to be inserted into CSS, explicitly cast or transform the value to a string, e.g. - 'String(" + (0, _generator.default)(ex.node).code + ")'.");
}
//# sourceMappingURL=throwIfInvalid.js.map
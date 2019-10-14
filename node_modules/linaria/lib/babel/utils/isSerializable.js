"use strict";

exports.__esModule = true;
exports.default = isSerializable;

function isSerializable(o) {
  return Array.isArray(o) && o.every(isSerializable) || typeof o === 'object' && o != null && o.constructor.name === 'Object';
}
//# sourceMappingURL=isSerializable.js.map
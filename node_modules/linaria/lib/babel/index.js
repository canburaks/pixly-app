"use strict";

var _loadOptions = _interopRequireDefault(require("./utils/loadOptions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function linaria(context, options) {
  return {
    plugins: [[require('./extract'), (0, _loadOptions.default)(options)]]
  };
};
//# sourceMappingURL=index.js.map
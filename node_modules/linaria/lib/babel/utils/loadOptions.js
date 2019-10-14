"use strict";

exports.__esModule = true;
exports.default = loadOptions;

var _cosmiconfig = _interopRequireDefault(require("cosmiconfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var explorer = (0, _cosmiconfig.default)('linaria');

function loadOptions(overrides) {
  if (overrides === void 0) {
    overrides = {};
  }

  var _overrides = overrides,
      configFile = _overrides.configFile,
      rest = _objectWithoutPropertiesLoose(_overrides, ["configFile"]);

  var result = configFile !== undefined ? explorer.loadSync(configFile) : explorer.searchSync();
  var options = Object.assign({
    displayName: false,
    evaluate: true,
    ignore: /node_modules/
  }, result ? result.config : null, rest);
  return options;
}
//# sourceMappingURL=loadOptions.js.map
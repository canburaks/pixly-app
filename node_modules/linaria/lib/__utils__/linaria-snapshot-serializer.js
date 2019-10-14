"use strict";

module.exports = {
  test: function test(value) {
    return value && typeof value.linaria === 'object';
  },
  print: function print(_ref) {
    var linaria = _ref.linaria;
    return "\nCSS:\n\n" + Object.keys(linaria.rules).map(function (selector) {
      return selector + " {" + linaria.rules[selector].cssText + "}";
    }).join('\n') + "\n\nDependencies: " + (linaria.dependencies.length ? linaria.dependencies.join(', ') : 'NA') + "\n";
  }
};
//# sourceMappingURL=linaria-snapshot-serializer.js.map
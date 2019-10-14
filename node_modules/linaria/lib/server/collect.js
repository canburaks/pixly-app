"use strict";

require("core-js/modules/es6.regexp.constructor");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.string.starts-with");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.set");

var postcss = require('postcss');

var collect = function collect(html, css) {
  var animations = new Set();
  var other = postcss.root();
  var critical = postcss.root();
  var stylesheet = postcss.parse(css);
  var htmlClassesRegExp = extractClassesFromHtml(html);

  var isCritical = function isCritical(rule) {
    // Only check class names selectors
    if (rule.selector.startsWith('.')) {
      return Boolean(rule.selector.match(htmlClassesRegExp));
    }

    return true;
  };

  var handleAtRule = function handleAtRule(rule) {
    var addedToCritical = false;
    rule.each(function (childRule) {
      if (isCritical(childRule)) {
        critical.append(rule.clone());
        addedToCritical = true;
      }
    });

    if (rule.name === 'keyframes') {
      return;
    }

    if (addedToCritical) {
      rule.remove();
    } else {
      other.append(rule);
    }
  };

  stylesheet.walkRules(function (rule) {
    if (rule.parent.name === 'keyframes') {
      return;
    }

    if (rule.parent.type === 'atrule') {
      handleAtRule(rule.parent);
      return;
    }

    if (isCritical(rule)) {
      critical.append(rule);
    } else {
      other.append(rule);
    }
  });
  critical.walkDecls(/animation/, function (decl) {
    animations.add(decl.value.split(' ')[0]);
  });
  stylesheet.walkAtRules('keyframes', function (rule) {
    if (animations.has(rule.params)) {
      critical.append(rule);
    }
  });
  return {
    critical: critical.toString(),
    other: other.toString()
  };
};

var extractClassesFromHtml = function extractClassesFromHtml(html) {
  var htmlClasses = [];
  var regex = /\s+class="([^"]*)"/gm;
  var match = regex.exec(html);

  while (match !== null) {
    match[1].split(' ').forEach(function (className) {
      return htmlClasses.push(className);
    });
    match = regex.exec(html);
  }

  return new RegExp(htmlClasses.join('|'), 'gm');
};

module.exports = collect;
//# sourceMappingURL=collect.js.map
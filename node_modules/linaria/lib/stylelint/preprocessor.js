"use strict";

require("core-js/modules/es6.number.constructor");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.array.find");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.string.starts-with");

require("core-js/modules/es6.regexp.split");

var stripAnsi = require('strip-ansi');

var transform = require('../transform');

function preprocessor() {
  var errors = {};
  var cache = {};
  return {
    code: function code(input, filename) {
      var result;

      try {
        result = transform(input, {
          filename: filename
        });
        cache[filename] = undefined;
        errors[filename] = undefined;
      } catch (e) {
        cache[filename] = undefined;
        errors[filename] = e; // Ignore parse errors here
        // We handle it separately

        return '';
      }

      var _result = result,
          rules = _result.rules,
          replacements = _result.replacements;

      if (!rules) {
        return '';
      } // Construct a CSS-ish file from the unprocessed style rules


      var cssText = '';
      Object.keys(rules).forEach(function (selector) {
        var rule = rules[selector]; // Append new lines until we get to the start line number

        var line = cssText.split('\n').length;

        while (rule.start && line < rule.start.line) {
          cssText += '\n';
          line++;
        }

        cssText += "." + rule.displayName + " {"; // Append blank spaces until we get to the start column number

        var last = cssText.split('\n').pop();
        var column = last ? last.length : 0;

        while (rule.start && column < rule.start.column) {
          cssText += ' ';
          column++;
        }

        cssText += rule.cssText + " }";
      });
      cache[filename] = replacements;
      return cssText;
    },
    result: function result(_result2, filename) {
      var error = errors[filename];
      var replacements = cache[filename];

      if (error) {
        // Babel adds this to the error message
        var prefix = filename + ": ";
        var message = stripAnsi(error.message.startsWith(prefix) ? error.message.replace(prefix, '') : error.message);
        var loc = error.loc;

        if (!loc) {
          // If the error doesn't have location info, try to find it from the code frame
          var line = message.split('\n').find(function (l) {
            return l.startsWith('>');
          });
          var column = message.split('\n').find(function (l) {
            return l.includes('^');
          });

          if (line && column) {
            loc = {
              line: Number(line.replace(/^> /, '').split('|')[0].trim()),
              column: column.replace(/[^|]+\|\s/, '').length
            };
          }
        }

        if (loc) {
          // Strip the codeframe text if we have location of the error
          // It's formatted badly by stylelint, so not very helpful
          message = message.replace(/^>?\s+\d?\s\|.*$/gm, '').trim();
        } // eslint-disable-next-line no-param-reassign


        _result2.errored = true;

        _result2.warnings.push({
          rule: error.code || error.name,
          text: message,
          line: loc ? loc.line : 0,
          column: loc ? loc.column : 0,
          severity: 'error'
        });
      }

      if (replacements) {
        replacements.forEach(function (_ref) {
          var original = _ref.original,
              length = _ref.length;

          // If the warnings contain stuff that's been replaced,
          // Correct the line and column numbers to what's replaced
          _result2.warnings.forEach(function (w) {
            /* eslint-disable no-param-reassign */
            if (w.line === original.start.line) {
              // If the error is on the same line where an interpolation started, we need to adjust the line and column numbers
              // Because a replacement would have increased or decreased the column numbers
              // If it's in the same line where interpolation ended, it would have been adjusted during replacement
              if (w.column > original.start.column + length) {
                // The error is from an item after the replacements
                // So we need to adjust the column
                w.column += original.end.column - original.start.column + 1 - length;
              } else if (w.column >= original.start.column && w.column < original.start.column + length) {
                // The linter will underline the whole word in the editor if column is in inside a word
                // Set the column to the end, so it will underline the word inside the interpolation
                // e.g. in `${colors.primary}`, `primary` will be underlined
                w.column = original.start.line === original.end.line ? original.end.column - 1 : original.start.column;
              }
            }
          });
        });
      }

      return _result2;
    }
  };
}

module.exports = preprocessor;
//# sourceMappingURL=preprocessor.js.map
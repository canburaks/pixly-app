"use strict";

require("core-js/modules/es6.string.raw");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.array.sort");

function _templateObject2() {
  var data = _taggedTemplateLiteralLoose(["", ""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

var generator = require('@babel/generator').default;

var babel = require('@babel/core');

var Module = require('./module');

var isAdded = function isAdded(requirements, path) {
  if (requirements.some(function (req) {
    return req.path === path;
  })) {
    return true;
  }

  if (path.parentPath) {
    return isAdded(requirements, path.parentPath);
  }

  return false;
};

var resolve = function resolve(path, t, requirements) {
  var binding = path.scope.getBinding(path.node.name);

  if (path.isReferenced() && binding && binding.kind !== 'param' && !isAdded(requirements, binding.path)) {
    var result;

    switch (binding.kind) {
      case 'module':
        if (t.isImportSpecifier(binding.path)) {
          result = t.importDeclaration([binding.path.node], binding.path.parentPath.node.source);
        } else {
          result = binding.path.parentPath.node;
        }

        break;

      case 'const':
      case 'let':
      case 'var':
        {
          var decl; // Replace SequenceExpressions (expr1, expr2, expr3, ...) with the last one

          if (t.isSequenceExpression(binding.path.node.init)) {
            var node = binding.path.node;
            decl = t.variableDeclarator(node.id, node.init.expressions[node.init.expressions.length - 1]);
          } else {
            decl = binding.path.node;
          }

          result = t.variableDeclaration(binding.kind, [decl]);
          break;
        }

      default:
        result = binding.path.node;
        break;
    }

    var loc = binding.path.node.loc;
    requirements.push({
      result: result,
      path: binding.path,
      start: loc.start,
      end: loc.end
    });
    binding.path.traverse({
      Identifier: function Identifier(p) {
        resolve(p, t, requirements);
      }
    });
  }
};

module.exports = function evaluate(path, t, filename, transformer, options) {
  if (t.isSequenceExpression(path)) {
    // We only need to evaluate the last item in a sequence expression, e.g. (a, b, c)
    // eslint-disable-next-line no-param-reassign
    path = path.get('expressions')[path.node.expressions.length - 1];
  }

  var requirements = [];

  if (t.isIdentifier(path)) {
    resolve(path, t, requirements);
  } else {
    path.traverse({
      Identifier: function Identifier(p) {
        resolve(p, t, requirements);
      }
    });
  }

  var expression = t.expressionStatement(t.assignmentExpression('=', t.memberExpression(t.identifier('module'), t.identifier('exports')), path.node)); // Preserve source order

  requirements.sort(function (a, b) {
    if (a.start.line === b.start.line) {
      return a.start.column - b.start.column;
    }

    return a.start.line - b.start.line;
  }); // We'll wrap each code in a block to avoid collisions in variable names
  // We separate out the imports since they cannot be inside blocks

  var _requirements$reduce = requirements.reduce(function (acc, curr) {
    if (t.isImportDeclaration(curr.path.parentPath)) {
      acc.imports.push(curr.result);
    } else {
      // Add these in reverse because we'll need to wrap in block statements in reverse
      acc.others.unshift(curr.result);
    }

    return acc;
  }, {
    imports: [],
    others: []
  }),
      imports = _requirements$reduce.imports,
      others = _requirements$reduce.others;

  var wrapped = others.reduce(function (acc, curr) {
    return t.blockStatement([curr, acc]);
  }, t.blockStatement([expression]));
  var m = new Module(filename);
  m.dependencies = [];
  m.transform = typeof transformer !== 'undefined' ? transformer : function transform(text) {
    if (options && options.ignore && options.ignore.test(this.filename)) {
      return {
        code: text
      };
    }

    var plugins = [// Include these plugins to avoid extra config when using { module: false } for webpack
    '@babel/plugin-transform-modules-commonjs', '@babel/plugin-proposal-export-namespace-from'];
    var defaults = {
      caller: {
        name: 'linaria',
        evaluate: true
      },
      filename: this.filename,
      presets: [[require.resolve('./index'), options]],
      plugins: [].concat(plugins.map(function (name) {
        return require.resolve(name);
      }), [// We don't support dynamic imports when evaluating, but don't wanna syntax error
      // This will replace dynamic imports with an object that does nothing
      require.resolve('./dynamic-import-noop')])
    };
    var babelOptions = // Shallow copy the babel options because we mutate it later
    options && options.babelOptions ? Object.assign({}, options.babelOptions) : {}; // If we programmtically pass babel options while there is a .babelrc, babel might throw
    // We need to filter out duplicate presets and plugins so that this doesn't happen
    // This workaround isn't full proof, but it's still better than nothing

    ['presets', 'plugins'].forEach(function (field) {
      babelOptions[field] = babelOptions[field] ? babelOptions[field].filter(function (item) {
        // If item is an array it's a preset/plugin with options ([preset, options])
        // Get the first item to get the preset.plugin name
        // Otheriwse it's a plugin name (can be a function too)
        var name = Array.isArray(item) ? item[0] : item;

        if ( // In our case, a preset might also be referring to linaria/babel
        // We require the file from internal path which is not the same one that we export
        // This case won't get caught and the preset won't filtered, even if they are same
        // So we add an extra check for top level linaria/babel
        name === 'linaria/babel' || name === require.resolve('../../babel') || // Also add a check for the plugin names we include for bundler support
        plugins.includes(name)) {
          return false;
        } // Loop through the default presets/plugins to see if it already exists


        return !defaults[field].some(function (it) {
          return (// The default presets/plugins can also have nested arrays,
            Array.isArray(it) ? it[0] === name : it === name
          );
        });
      }) : [];
    });
    return babel.transformSync(text, Object.assign({}, babelOptions, defaults, {
      presets: [].concat(babelOptions.presets, defaults.presets),
      plugins: [].concat(defaults.plugins, babelOptions.plugins)
    }));
  };
  m.evaluate([// Use String.raw to preserve escapes such as '\n' in the code
  // Flow doesn't understand template tags: https://github.com/facebook/flow/issues/2616

  /* $FlowFixMe */
  imports.map(function (node) {
    return String.raw(_templateObject(), generator(node).code);
  }).join('\n'),
  /* $FlowFixMe */
  String.raw(_templateObject2(), generator(wrapped).code)].join('\n'));
  return {
    value: m.exports,
    dependencies: m.dependencies
  };
};
//# sourceMappingURL=evaluate.js.map
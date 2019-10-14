"use strict";

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.object.freeze");

/**
 * This is a custom implementation for the module system for evaluating code.
 *
 * This serves 2 purposes:
 * - Avoid leakage from evaled code to module cache in current context, e.g. `babel-register`
 * - Allow us to invalidate the module cache without affecting other stuff, necessary for rebuilds
 *
 * We also use it to transpile the code with Babel by default.
 * We also store source maps for it to provide correct error stacktraces.
 *
 * 
 */

/* $FlowFixMe */
var NativeModule = require('module');

var vm = require('vm');

var fs = require('fs');

var path = require('path');

var process = require('./process'); // Supported node builtins based on the modules polyfilled by webpack
// `true` means module is polyfilled, `false` means module is empty


var builtins = {
  assert: true,
  buffer: true,
  child_process: false,
  cluster: false,
  console: true,
  constants: true,
  crypto: true,
  dgram: false,
  dns: false,
  domain: true,
  events: true,
  fs: false,
  http: true,
  https: true,
  module: false,
  net: false,
  os: true,
  path: true,
  punycode: true,
  process: true,
  querystring: true,
  readline: false,
  repl: false,
  stream: true,
  string_decoder: true,
  sys: true,
  timers: true,
  tls: false,
  tty: true,
  url: true,
  util: true,
  vm: true,
  zlib: true
}; // Separate cache for evaled modules

var cache = {};

var NOOP = function NOOP() {};

var Module =
/*#__PURE__*/
function () {
  function Module(filename) {
    Object.defineProperties(this, {
      id: {
        value: filename,
        writable: false
      },
      filename: {
        value: filename,
        writable: false
      },
      paths: {
        value: Object.freeze(NativeModule._nodeModulePaths(path.dirname(filename))),
        writable: false
      }
    });
    this.exports = {};
    this.require = this.require.bind(this);
    this.require.resolve = this.resolve.bind(this);
    this.require.ensure = NOOP;
    this.require.cache = cache; // We support following extensions by default

    this.extensions = ['.json', '.js', '.jsx', '.ts', '.tsx'];
  }

  var _proto = Module.prototype;

  _proto.resolve = function resolve(id) {
    var extensions = NativeModule._extensions;
    var added = [];

    try {
      // Check for supported extensions
      this.extensions.forEach(function (ext) {
        if (ext in extensions) {
          return;
        } // When an extension is not supported, add it
        // And keep track of it to clean it up after resolving
        // Use noop for the tranform function since we handle it


        extensions[ext] = NOOP;
        added.push(ext);
      });
      return Module._resolveFilename(id, this);
    } finally {
      // Cleanup the extensions we added to restore previous behaviour
      added.forEach(function (ext) {
        return delete extensions[ext];
      });
    }
  };

  _proto.require = function (_require) {
    function require(_x) {
      return _require.apply(this, arguments);
    }

    require.toString = function () {
      return _require.toString();
    };

    return require;
  }(function (id) {
    if (id in builtins) {
      // The module is in the allowed list of builtin node modules
      // Ideally we should prevent importing them, but webpack polyfills some
      // So we check for the list of polyfills to determine which ones to support
      if (builtins[id]) {
        /* $FlowFixMe */
        return require(id);
      }

      return null;
    } // Resolve module id (and filename) relatively to parent module


    var filename = this.resolve(id);

    if (filename === id && !path.isAbsolute(id)) {
      // The module is a builtin node modules, but not in the allowed list
      throw new Error("Unable to import \"" + id + "\". Importing Node builtins is not supported in the sandbox.");
    }

    this.dependencies && this.dependencies.push(id);
    var m = cache[filename];

    if (!m) {
      // Create the module if cached module is not available
      m = new Module(filename);
      m.transform = this.transform; // Store it in cache at this point with, otherwise
      // we would end up in infinite loop with cyclic dependencies

      cache[filename] = m;

      if (this.extensions.includes(path.extname(filename))) {
        // To evaluate the file, we need to read it first
        var code = fs.readFileSync(filename, 'utf-8');

        if (/\.json$/.test(filename)) {
          // For JSON files, parse it to a JS object similar to Node
          m.exports = JSON.parse(code);
        } else {
          // For JS/TS files, evaluate the module
          // The module will be transpiled using provided transform
          m.evaluate(code);
        }
      } else {
        // For non JS/JSON requires, just export the id
        // This is to support importing assets in webpack
        // The module will be resolved by css-loader
        m.exports = id;
      }
    }

    return m.exports;
  });

  _proto.evaluate = function evaluate(text) {
    // For JavaScript files, we need to transpile it and to get the exports of the module
    var code = this.transform ? this.transform(text).code : text;
    var script = new vm.Script(code, {
      filename: this.filename
    });
    script.runInContext(vm.createContext({
      global: global,
      process: process,
      module: this,
      exports: this.exports,
      require: this.require,
      __filename: this.filename,
      __dirname: path.dirname(this.filename)
    }));
  };

  return Module;
}();

Module.invalidate = function () {
  cache = {};
}; // Alias to resolve the module using node's resolve algorithm
// This static property can be overriden by the webpack loader
// This allows us to use webpack's module resolution algorithm


Module._resolveFilename = function (id, options) {
  return NativeModule._resolveFilename(id, options);
};

module.exports = Module;
//# sourceMappingURL=module.js.map
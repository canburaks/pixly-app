"use strict";

/* eslint-disable no-multi-assign */
exports.nextTick = function (fn) {
  return setTimeout(fn, 0);
};

exports.platform = exports.arch = exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.argv = [];

exports.binding = function binding() {
  throw new Error('No such module. (Possibly not yet loaded)');
};

exports.cwd = function () {
  return '/';
};

exports.exit = exports.kill = exports.chdir = exports.umask = exports.dlopen = exports.uptime = exports.memoryUsage = exports.uvCounters = function () {};

exports.features = {};
exports.env = {
  NODE_ENV: process.env.NODE_ENV
};
//# sourceMappingURL=process.js.map
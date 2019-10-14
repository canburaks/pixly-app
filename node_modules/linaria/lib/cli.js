"use strict";

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.string.ends-with");

require("core-js/modules/es6.string.starts-with");

require("core-js/modules/es6.regexp.to-string");

var path = require('path');

var normalize = require('normalize-path');

var fs = require('fs');

var mkdirp = require('mkdirp');

var glob = require('glob');

var yargs = require('yargs');

var transform = require('./transform');

var _yargs$usage$option$o = yargs.usage('Usage: $0 [options] <files ...>').option('config', {
  alias: 'c',
  type: 'string',
  description: 'Path to a config file',
  requiresArg: true
}).option('out-dir', {
  alias: 'o',
  type: 'string',
  description: 'Output directory for the extracted CSS files',
  demandOption: true,
  requiresArg: true
}).option('source-maps', {
  alias: 's',
  type: 'boolean',
  description: 'Generate source maps for the CSS files',
  default: false
}).option('source-root', {
  alias: 'r',
  type: 'string',
  description: 'Directory containing the source JS files',
  requiresArg: true
}).option('insert-css-requires', {
  alias: 'i',
  type: 'string',
  description: 'Directory containing JS files to insert require statements for the CSS files',
  requiresArg: true
}).implies('insert-css-requires', 'source-root').alias('help', 'h').alias('version', 'v').strict(),
    argv = _yargs$usage$option$o.argv;

processFiles(argv._, {
  outDir: argv['out-dir'],
  sourceMaps: argv['source-maps'],
  sourceRoot: argv['source-root'],
  insertCssRequires: argv['insert-css-requires'],
  configFile: argv.config
});

function processFiles(files, options) {
  var count = 0;
  var resolvedFiles = files.reduce(function (acc, pattern) {
    return [].concat(acc, glob.sync(pattern, {
      absolute: true
    }));
  }, []);
  resolvedFiles.forEach(function (filename) {
    var outputFilename = resolveOutputFilename(filename, options.outDir);

    var _transform = transform(fs.readFileSync(filename).toString(), {
      filename: filename,
      outputFilename: outputFilename,
      pluginOptions: {
        configFile: options.configFile
      }
    }),
        cssText = _transform.cssText,
        sourceMap = _transform.sourceMap,
        cssSourceMapText = _transform.cssSourceMapText;

    if (cssText) {
      mkdirp.sync(path.dirname(outputFilename));
      var cssContent = options.sourceMaps && sourceMap ? cssText + "\n/*# sourceMappingURL=" + outputFilename + ".map */" : cssText;
      fs.writeFileSync(outputFilename, cssContent);

      if (options.sourceMaps && sourceMap && typeof cssSourceMapText !== 'undefined') {
        fs.writeFileSync(outputFilename + ".map", cssSourceMapText);
      }

      if (options.insertCssRequires && options.sourceRoot) {
        var inputFilename = path.resolve(options.insertCssRequires, path.relative(options.sourceRoot, filename));
        var relativePath = normalize(path.relative(path.dirname(inputFilename), outputFilename));
        var requireStatement = "\nrequire('" + (relativePath.startsWith('.') ? relativePath : "./" + relativePath) + "');";
        var inputContent = fs.readFileSync(inputFilename, 'utf-8');

        if (!inputContent.trim().endsWith(requireStatement)) {
          fs.writeFileSync(inputFilename, inputContent + "\n" + requireStatement + "\n");
        }
      }

      count++;
    }
  });
  console.log("Successfully extracted " + count + " CSS files.");
}

function resolveOutputFilename(filename, outDir) {
  var folderStructure = path.relative(process.cwd(), path.dirname(filename));
  var outputBasename = path.basename(filename).replace(path.extname(filename), '.css');
  return path.join(outDir, folderStructure, outputBasename);
}
//# sourceMappingURL=cli.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path, node) {
        if (isImportingAnElmAsset(path)) {
          var assetAbsolutePath = getAssetAbsolutePath(path, node);
          var tempFilePath = compile(assetAbsolutePath);
          path.node.source.value = tempFilePath;
        }
      }
    }
  };
};

var _nodeElmCompiler = require('node-elm-compiler');

var _nodeElmCompiler2 = _interopRequireDefault(_nodeElmCompiler);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var temp = require('temp').track();

var isImportingAnElmAsset = function isImportingAnElmAsset(path) {
  return (/.elm$/.test(getPathToImport(path))
  );
};

var getPathToImport = function getPathToImport(path) {
  return path.node.source.value;
};

var getAssetAbsolutePath = function getAssetAbsolutePath(path, node) {
  var assetPath = getPathToImport(path);

  var importingFilePath = node.file.opts.filenameRelative;
  var containingDir = (0, _path.dirname)(importingFilePath);

  return (0, _path.resolve)(containingDir, assetPath);
};

var compile = function compile(fileToCompileAbsolutePath) {
  var tempFilePath = temp.openSync({ suffix: '.js' }).path;
  var options = { output: tempFilePath };

  _nodeElmCompiler2.default.compileSync(fileToCompileAbsolutePath, options);

  return tempFilePath;
};
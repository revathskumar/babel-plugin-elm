import elmCompiler from 'node-elm-compiler'
import {
  dirname,
  resolve
} from 'path'

const temp = require('temp').track()

export default function () {
  return {
    visitor: {
      ImportDeclaration (path, node) {
        if (isImportingAnElmAsset(path)) {
          const assetAbsolutePath = getAssetAbsolutePath(path, node)
          const tempFilePath = compile(assetAbsolutePath)
          path.node.source.value = tempFilePath
        }
      }
    }
  }
}

const isImportingAnElmAsset = path => /.elm$/.test(getPathToImport(path))

const getPathToImport = path => path.node.source.value

const getAssetAbsolutePath = (path, node) => {
  const assetPath = getPathToImport(path)

  const importingFilePath = node.file.opts.filenameRelative
  const containingDir = dirname(importingFilePath)

  return resolve(containingDir, assetPath)
}

const compile = fileToCompileAbsolutePath => {
  const tempFilePath = temp.openSync({ suffix: '.js' }).path
  const options = { output: tempFilePath }

  elmCompiler.compileSync(fileToCompileAbsolutePath, options)

  return tempFilePath
}

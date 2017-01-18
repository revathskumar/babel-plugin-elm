import { StringLiteral } from 'babel-types'
import elmCompiler from 'node-elm-compiler'
import {
  dirname,
  resolve
} from 'path'

const temp = require('temp').track()

export default function ({ types: t }) {
  return {
    visitor: {
      CallExpression (path, node) {
        if (isValidRequireStatement(path, t)) {
          const rawPath = path.node.arguments[0].value
          if (isImportingAnElmAsset(rawPath)) {
            const newRequiredPath = getNewPath(rawPath, node)
            transform(path, newRequiredPath)
          }
        }
      }
    }
  }
}

const isValidRequireStatement = (path, types) => {
  const { callee: { name: calleeName }, arguments: args } = path.node

  const isRequireStatement = calleeName === 'require'
  const hasStingLiteralAsFirstArg = args.length && types.isStringLiteral(args[0])

  return isRequireStatement && hasStingLiteralAsFirstArg
}

const getNewPath = (rawPath, node) => {
  const assetAbsolutePath = getAssetAbsolutePath(rawPath, node)
  return compile(assetAbsolutePath)
}

const transform = (path, newRequiredPath) => {
  path.node.arguments = [ StringLiteral(newRequiredPath) ]
}

const isImportingAnElmAsset = rawPath => /.elm$/.test(rawPath)

const getAssetAbsolutePath = (rawPath, node) => {
  const importingFilePath = node.file.opts.filenameRelative
  const containingDir = dirname(importingFilePath)

  return resolve(containingDir, rawPath)
}

const compile = fileToCompileAbsolutePath => {
  const tempFilePath = temp.openSync({ suffix: '.js' }).path
  const options = { output: tempFilePath }

  elmCompiler.compileSync(fileToCompileAbsolutePath, options)

  return tempFilePath
}

// Based on Node's `Module._load` method.
// Copyright Node.js contributors. Released under MIT license:
// https://github.com/nodejs/node/blob/master/lib/module.js

import Module from "../module.js"

const compileSym = Symbol.for("@std/esm:module._compile")

function load(filePath, parent, isMain, state, loader) {
  let child = state._cache[filePath]

  if (child) {
    const children = parent && parent.children

    if (children && children.indexOf(child) === -1) {
      children.push(child)
    }

    return child
  }

  child = new Module(filePath, parent)

  if (isMain) {
    process.mainModule = child
    child.id = "."
  }

  const { _compile } = child

  child._compile = (content, filePath) => {
    delete child._compile

    const func = typeof child[compileSym] === "function"
      ? child[compileSym]
      : _compile

    return func.call(child, content, filePath)
  }

  tryLoad(child, filePath, state, loader)
  return child
}

function tryLoad(mod, filePath, state, loader = mod.load) {
  state._cache[filePath] = mod

  let threw = true

  try {
    loader.call(mod, filePath)
    threw = false
  } finally {
    if (threw) {
      delete state._cache[filePath]
    }
  }
}

export default load

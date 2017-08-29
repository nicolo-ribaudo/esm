// Based on Node's `Module._resolveFilename` method.
// Copyright Node.js contributors. Released under MIT license:
// https://github.com/nodejs/node/blob/master/lib/module.js

import builtinModules from "../builtin-modules.js"
import errors from "../errors.js"
import findPath from "./find-path.js"
import resolveLookupPaths from "./resolve-lookup-paths.js"

function resolveFilename(id, parent, isMain, skipGlobalPaths, searchExts) {
  if (typeof id !== "string") {
    throw new errors.TypeError("ERR_INVALID_ARG_TYPE", "id", "string")
  }

  if (id in builtinModules) {
    return id
  }

  const paths = resolveLookupPaths(id, parent, skipGlobalPaths)
  return findPath(id, parent, paths, isMain, searchExts)
}

export default resolveFilename
/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true browser: true devel: true
         eqnull: true forin: true latedef: false globalstrict: true*/

"use strict";

function rebase(result, parent, delta) {
  Object.keys(parent).forEach(function(key) {
    // If `parent[key]` is `null` it means attribute was deleted in previous
    // update. We skip such properties as there is no use in keeping them
    // around. If `delta[key]` is `null` we skip these properties too as
    // the have being deleted.
    if (!(parent[key] == null || (key in delta && delta[key] == null)))
      result[key] = parent[key]
  }, result)
  Object.keys(delta).forEach(function(key) {
    if (key in parent) {
      var current = delta[key]
      var previous = parent[key]
      if (current === previous) current = current
      // If `delta[key]` is `null` it's delete so we just skip property.
      else if (current == null) current = current
      // If value is of primitive type (function or regexps should not
      // even be here) we just update in place.
      else if (typeof(current) !== "object") result[key] = current
      // If previous value associated with this key was primitive
      // and it's mapped to non primitive
      else if (typeof(previous) !== "object") result[key] = current
      else result[key] = rebase({}, previous, current)
    } else {
      result[key] = delta[key]
    }
  })
  return result
}

module.exports = rebase

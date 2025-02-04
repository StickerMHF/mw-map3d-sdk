/*
 * @Author: Caven
 * @Date: 2020-05-09 23:01:21
 * @Last Modified by: Caven
 * @Last Modified time: 2020-06-17 17:41:24
 */

export function initUse(DC) {
  DC.use = function(plugin) {
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = [])
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    // additional parameters
    const args = []
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}

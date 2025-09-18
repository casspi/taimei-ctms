import curl from './curl'

export const doCompareVersion = (() => {
  let pre = 0,
    flag = true
  return async () => {
    const cur = await curl(`./version.json?t=${Date.now()}`, {}, { baseURL: '' })
    if (!pre) {
      pre = cur
    }
    if (flag && cur > pre) {
      flag = false
      try {
        await ElMessageBox.confirm(`有新版本发布，确定刷新更新`)
        window.location.reload()
      } catch {
        /* empty */
      } finally {
        flag = true
      }
    }
  }
})()

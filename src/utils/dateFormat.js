function dateFormat (date, fmt) {
  if (!fmt) {
    fmt = 'yyyy-MM-dd'
  }
  if (typeof date === 'string') {
    date = new Date(date)
  }

  var o = {
    'M': date.getMonth() + 1, // 月份
    'd': date.getDate(), // 日
    'h': date.getHours(), // 小时
    'm': date.getMinutes(), // 分
    's': date.getSeconds() // 秒
  }

  fmt = fmt.replace(/([yMdhms])+/g, function (all, t) {
    var tt = o[t]
    if (tt !== undefined) {
      if (all.length > 1) {
        tt = '0' + tt
        tt = tt.substr(tt.length - 2)
      }
      return tt
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    }
    return all
  })
  return fmt
}
export { dateFormat }

function dateFormat (time, type) {
  if (!time) return ''
  const date = new Date(time)
  const year = date.getFullYear()
  /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  // 拼接
  switch (type) {
    case 'yyyy':
      return year
    case 'yyyy-mm-dd':
      return year + '-' + month + '-' + day
  }
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

export default dateFormat

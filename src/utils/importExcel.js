import XLSX from 'xlsx'
/**
 *
 * @param {File} file 文件
 * @param {Object} codeObj 每个对象所包含的属性，属性名
 * @return {Promise} 读取文件为异步的，调用例如excel(file.raw, obj).then(res => {console.log(res)})，res为最终得到的数组数据
 */
export default function (file, codeObj, needAll) {
  return new Promise(resolve => {
    const reader = new FileReader()

    FileReader.prototype.readAsBinaryString = function (f) {
      let binary = ''

      let wb // 读取完成的数据

      let outdata

      const reader = new FileReader()

      reader.onload = function (e) {
        const bytes = new Uint8Array(reader.result)

        const length = bytes.byteLength

        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }

        wb = XLSX.read(binary, { type: 'binary', cellDates: true })
        const opt = {
          defval: '' // 设置默认值为null, 没设置的话，单元格为空的时候会缺少相应的key
        }
        // outdata就是你想要的东西 excel导入的数据
        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], opt)

        // excel 数据再处理
        const arr = []

        outdata.map(v => {
          const obj = {}
          for (const key in codeObj) {
            obj[key] = v[codeObj[key]] || ''
          }
          if (JSON.stringify(obj) !== '{}') {
            arr.push(obj)
          }
        })
        if (needAll) {
          resolve({ data: [...arr], dataAll: outdata })
        } else {
          resolve([...arr])
        }
      }
      reader.readAsArrayBuffer(f)
    }

    reader.readAsBinaryString(file)
  })
}

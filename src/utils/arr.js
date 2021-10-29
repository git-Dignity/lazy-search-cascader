 

export const getVal = (obj, ...args) => {
    let out = null
    if (obj || obj === 0) {
      out = obj
      if (args && args.length > 0) {
        for (let index = 0; index < args.length; index++) {
          const key = args[index]
          out = out[key]
          if (out === undefined || out === null || out === '') {
            return null
          }
        }
      } else {
        if (out === undefined || out === null || out === '') {
          return null
        }
      }
    }
    return out
  }
 
 /**
* @description 获取数组总共层级，根据field字段
*
* @param {Array} arr
* @param {number} [level=1]
* @param {string} [field='children']
* @return {Number} 层级
*/
export const getArrLevel = (arr, level = 1, field = 'children') => {
 if (arr && arr[0]) {
   if (arr[0][field]) {
     return getArrLevel(arr[0][field], ++level, field)
   } else {
     return level
   }
 } else {
   return 0
 }
}


/**
 * @description 思路：先把正则的文本和拼接的文本放在一个字符串里面，然后使用eval方法执行一下这个字符串，出来的就是可替换的正则字符串了
 * @description 将arr数组的ennmcd字段换为id
 * @description 数组替换字段
 * @param {Array} arr
 * @param {Object} [field={ ennmcd: 'id' }]
 * @return {Array}
 */
 export const fieldReplace = (arr, field = [{ ennmcd: 'id' }]) => {
    if (arr.length === 0) {
      return
    }
  
    let arrJson = JSON.stringify(arr)
    let tmp = ''
  
    field.forEach(f => {
      let reg = '/' + Object.keys(f)[0] + '/g'
      tmp = arrJson.replace(eval(reg), f[Object.keys(f)[0]])
      arrJson = tmp
    })
  
    return JSON.parse(tmp)
  }


  
/**
 * @description: 去除字符串中的数字
 * @param {String}
 * @return {*}
 */
export const strRemoveNum = str => {
    return str.replace(/[0-9]+/g, '')
  }


  /**
 * @description: 获取水库类型
 * @param {String} type 类型
 * @return {String}
 */
   export const getReservoirType = type => {
    let res = ''
    switch (type) {
      case 'Ⅰ':
      case 'Ⅱ':
        res = '2'
        break
      case 'Ⅲ':
        res = '3'
        break
      case 'Ⅳ':
      case 'Ⅴ':
        res = '4'
        break
      default:
        break
    }
  
    return res
  }
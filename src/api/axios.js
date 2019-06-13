import axios from 'axios'

import qs from 'qs'

/**
 *
 * @desc 封装axios，减少学习成本，参数基本跟jq ajax一致
 * @param {String} type [default: GET] 请求的类型
 * @param {String} url 请求地址
 * @param {String} time  [default: 10s] 超时时间
 * @param {Object} data 请求参数
 * @param {Boolean} withCredentials [default: false]是否携带cookie
 * @param {String} dataType 预期服务器返回的数据类型，xml html json ...
 * @param {Object} headers 自定义请求headers
 * @return {Promise}
 */

const ajax = function (config) {
  const configs = config || {}
  if (!configs.url) {
    return
  }

  axios.defaults.params = {}
  axios.defaults.data = {}

  if (configs.method === 'post') {
    let postData = configs.data || {}
    const tempData = {
      ...postData
    }
    if (configs.headers && configs.headers['Content-Type'] &&
      configs.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      postData = qs.stringify(tempData)
    }
    axios.defaults.data = postData
  } else if (configs.method === 'get') {
    axios.defaults.params = configs.data || {}
  }

  return new Promise((resolve, reject) => {
    axios({
      method: configs.method || 'get',
      url: configs.url,
      headers: configs.headers || {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      withCredentials: configs.withCredentials || false,
      timeout: configs.time || 10 * 1000,
      responseType: configs.dataType || 'json'
    }).then(res => {
      if (res.code === 200) {
        resolve(res.data)
      } else {
        reject(res.code)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

export default ajax

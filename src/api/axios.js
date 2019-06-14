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
  if (!config.url) {
    return
  }
  const params = config.method === 'get' ? {
    data: qs.stringify({...config.params})
  } : {
    params: config.params
  }
  return new Promise((resolve, reject) => {
    axios({
      methods: config.method || 'get',
      url: config.url,
      headers: config.headers || {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      withCredentials: config.withCredentials || false,
      timeout: config.time || 100 * 1000,
      responseType: config.dataType || 'json',
      ...params
    }).then(res => {
      if (res.status === 200) {
        resolve(res)
      } else {
        reject(res.status)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

export default ajax

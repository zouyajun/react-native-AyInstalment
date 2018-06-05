/**
 * Created by Ryan on 2018/5/28.
 */

var queryString = require('query-string')
var _ = require('lodash')
var request = {}
var config = require('./Config')

/**
 * GET 请求
 */
request.get = function (url,params,headers) {
    if (params) {
        url += '?' + queryString.stringify(params)
    }
    var headers = {
        headers: headers
    }
    console.log(url,headers)
    return fetch(url,headers)
        .then((response) => response.json())
}

/**
 * POST 请求
 */
request.post = function (url,body,headers) {
    var header = {
        method: 'POST',
        headers: headers
    }
    var configHeads = headers ? header : config.header
    var options = _.extend(configHeads,{
        body: JSON.stringify(body)
    })

    console.log(url,options,header,body)
    return fetch(url,options)
        .then((response) =>response)
}
module.exports  = request
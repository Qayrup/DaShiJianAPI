const express = require('express');
const { jwtKey } = require('../config');

//配置跨域解决方案中间件
const cors = require('cors')();
//配置解析 application / x - www - form - urlencoded 格式的表单数据的中间件：
const urlencoded = express.urlencoded({ extended: false })
//配置解析jwt的中间件
const expressJWT = require('express-jwt').expressjwt({
    secret: jwtKey,
    requestProperty: 'userInfo',
    algorithms: ["HS256"]
}).unless({ path: [/^\/api\//] })

module.exports = {
    cors,
    urlencoded,
    expressJWT
}
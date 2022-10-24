const express = require('express');
const expressJoi = require('@escook/express-joi');

//获取expressJoi验证规则
const { reg_updateUserInfo_validateRule, reg_updatePassword_validateRule, reg_updateAvatar_validateRule } = require('../validateRule/user');
//获取路由回调函数
const { getUserInfo, updateUserInfo, updatePassword, updateAvatar } = require('../router_handler/userInfo');

const router = express.Router();


// 获取用户信息路由
router.get('/userInfo', getUserInfo);
//修改用户信息路由
router.post('/userInfo', expressJoi(reg_updateUserInfo_validateRule), updateUserInfo)
router.put('/password', expressJoi(reg_updatePassword_validateRule), updatePassword)
router.put('/avatar', expressJoi(reg_updateAvatar_validateRule), updateAvatar)
// 向外共享路由对象
module.exports = router

const express = require('express');
const router = express.Router();

//导入验证中间件
const expressJoi = require('@escook/express-joi');
//导入验证规则
const { reg_signupOrSignin_validateRule } = require('../validateRule/user')
// 导入用户路由处理函数模块
const { signUp, signIn } = require('../router_handler/user')
//注册用户路由
router.post('/signup', expressJoi(reg_signupOrSignin_validateRule), signUp);
//登入用户路由
router.post('/signin', expressJoi(reg_signupOrSignin_validateRule), signIn);

module.exports = router
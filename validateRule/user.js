const joi = require('joi')
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 * email()邮件验证规则
 * number()数字
 * integer()整数
 * dataUri()验证base64格式字符串
 */

//定义id验证规则
const id = joi.number().integer().min(1).required();
//定义用户名验证规则
const userName = joi.string().alphanum().min(3).max(9).required()
    .error(new Error("输入登录账号格式有误！"));
// 定义用户密码验证规则
const password = joi.string().min(3).max(18).required().pattern(/^[\S]{6,12}$/);
//定义新密码验证规则
const newPassword = joi.not(joi.ref('oldPassword')).concat(password)
//定义邮箱验证规则
const email = joi.string().email().required();
//定义用户昵称验证规则
const nickname = joi.string().min(3).max(18).required();
//定义用户头像验证规则
const avatar = joi.string().dataUri().required();
const reg_signupOrSignin_validateRule = {
    // 表示需要对 req.body 中的数据进行验证
    body: { userName, password }
}
const reg_updateUserInfo_validateRule = {
    // 表示需要对 req.body 中的数据进行验证
    body: { id, nickname, email }
}
const reg_updatePassword_validateRule = {
    body: { 'oldPassword': password, newPassword }
}
const reg_updateAvatar_validateRule = {
    body: { 'avatar': avatar }
}
module.exports = {
    reg_signupOrSignin_validateRule,
    reg_updateUserInfo_validateRule,
    reg_updatePassword_validateRule,
    reg_updateAvatar_validateRule
}
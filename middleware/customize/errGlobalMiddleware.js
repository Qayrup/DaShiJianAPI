const joi = require('joi');
function validateTips(err, req, res, next) {
    console.log(err);
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.backTips(err);
    // 捕获身份认证失败的错误
    console.log(err);
    if (err.name === 'UnauthorizedError') return res.backTips(err);
    // 未知错误
    res.backTips(err)
}
module.exports = {
    validateTips
}
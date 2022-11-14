// 导入定义验证规则的模块
const joi = require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required();
const cate_id = joi.number().integer().min(1).required();
const content = joi.string().required().allow('');
const state = joi.string().valid('已发布', '草稿').required();
let page = joi.number().required();
let pageSize = joi.number().required();
let cate_idN = joi.required();
let states = joi.required();
//验证规则对象-查询分页
const req_queryArticlePage_validateRule = {
    query: {
        page,
        pageSize,
        'cate_id': cate_idN,
        'state': states,
    },
}
// 验证规则对象 - 发布文章
const req_addArticle_validateRule = {
    body: {
        title,
        cate_id,
        content,
        state,
    },
}

module.exports = {
    req_addArticle_validateRule,
    req_queryArticlePage_validateRule
}
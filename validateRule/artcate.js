// 导入验证规则模块
const joi = require('joi');

//--------------------------------- 定义验证规则

// 定义文章名称验证规则
const name = joi.string().required();
// 定义文章拼音验证规则
const alias = joi.string().alphanum().required();
//定义文章id验证规则
const id = joi.number().integer().required();
// 定义新增文章分类路由规则
const req_addArtcate_validate = { body: { name, alias } };
// 定义删除文章分类路由规则
const req_delArtcate_validate = { params: { id } };
// 定义根据id获取文章分类路由规则
const req_getArtcateById_validate = { params: { id } };
//定义根据id更新文章分类路由参数规则
const req_updateCateById_validate = { body: { id, name, alias } }
module.exports = {
    req_addArtcate_validate,
    req_delArtcate_validate,
    req_getArtcateById_validate,
    req_updateCateById_validate

}

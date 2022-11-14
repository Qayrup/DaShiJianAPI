const express = require('express');
// 导入解析 formData 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
const expressJoi = require('@escook/express-joi');

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

const { addArticle, deleteArticle, queryArticlePage, reviseArticle, queryArticle } = require('../router_handler/article');
const { req_addArticle_validateRule, req_queryArticlePage_validateRule } = require('../validateRule/article');
const router = express.Router();
//删除文章
router.delete('/article', deleteArticle)
//查询文章分页
router.get('/articlePage', expressJoi(req_queryArticlePage_validateRule), queryArticlePage)
// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/article', upload.single('cover_img'), expressJoi(req_addArticle_validateRule), addArticle);
router.put('/article', upload.single('cover_img'), reviseArticle)
router.get('/article/:id', queryArticle)

module.exports = router
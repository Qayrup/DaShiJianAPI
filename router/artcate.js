const express = require('express');
const expressJoi = require('@escook/express-joi');
const { getArticleCates, addArticleCates, delArticleCates, getArtCateById, updateCateById } = require('../router_handler/artcate');
const { req_addArtcate_validate, req_delArtcate_validate, req_getArtcateById_validate, req_updateCateById_validate } = require('../validateRule/artcate');
const router = express.Router();
//获取文章分类路由
router.get('/cates', getArticleCates)
// 新增文章分类的路由
router.post('/cates', expressJoi(req_addArtcate_validate), addArticleCates);
router.delete('/cates/:id', expressJoi(req_delArtcate_validate), delArticleCates);
// 根据id获取文章分类数据
router.get('/cates/:id', expressJoi(req_getArtcateById_validate), getArtCateById);
router.put('/cates', expressJoi(req_updateCateById_validate), updateCateById)
module.exports = router;
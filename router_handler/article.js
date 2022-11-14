// 导入处理路径的 path 核心模块
const boolean = require('@hapi/joi/lib/types/boolean');
const path = require('path');
const fs = require('fs')
const config = require('../config')
// 导入数据库操作模块
const db = require('../db/index');

// 根据id查询文章分页
function queryArticlePage(req, res) {
    //定义sql查询语句
    let sqlStr = 'select article.id,state,title,pub_date,article_cate.name  from article left join article_cate on article.cate_id=article_cate.id';
    //判断客户端是否有cate_id或state查询条件
    if (parseInt(req.query.cate_id) && req.query.state == '已发布' || req.query.state == '未发布')
        sqlStr = sqlStr + ` where cate_id ="${req.query.cate_id}" and state ="${req.query.state}"`;
    else if (parseInt(req.query.cate_id))
        sqlStr = sqlStr + ` where cate_id = "${req.query.cate_id}"`;
    else if (req.query.state == '已发布' || req.query.state == '未发布')
        sqlStr = sqlStr + ` where state = "${req.query.state}" `;
    sqlStr = sqlStr + ' order by id Desc'
    //调用数据库query方法查询数据
    db.query(sqlStr, (err, results) => {
        if (err) return res.backTips(err);
        if (results.length < 1) return res.backTips('未查询到数据');
        //判断一共分成多少页数据
        let numPage = Math.ceil(results.length / req.query.pageSize);
        // 解决前端分页无数据
        req.query.page = req.query.page > numPage ? numPage : req.query.page;
        //需要传给前端的数据下标
        let pageDataNum = req.query.pageSize * (req.query.page - 1);
        //截取需要传递给前端的数据
        let articleListData = results.slice(pageDataNum, (pageDataNum + req.query.pageSize));
        // 定义好需要返回给客户端的对象
        let articleList = {
            total: results.length,
            numPage: numPage,
            data: articleListData
        };
        return res.backTips('查询分页成功', 0, articleList);
    });
}
/*
添加文章方法
*/
function addArticle(req, res) {
    //清理多余的对象属性,防止前端传递过来意外属性
    req.body = req.objectCopy(req.body, ['title', 'cate_id', 'content', 'state']);
    //判断传过来的文件是否有且文件名称为cover_img
    if (!req.file || req.file.fieldname !== 'cover_img') return res.backTips('文章封面是必选参数!');
    //定义数据库储存对象
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.userInfo.id,
        //是否删除
        is_delete: 0
    };
    // 定义发布文章的 SQL 语句：
    const insertSqlStr = `insert into article set ? `;
    // 执行 SQL 语句
    db.query(insertSqlStr, articleInfo, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.backTips(err);
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.backTips('发布文章失败！');
        // 发布文章成功
        return res.backTips('发布文章成功', 0);
    });
}
function deleteArticle(req, res) {
    // 定义查询语句
    queryArtSqlStr = 'select cover_img from article where id =?'
    db.query(queryArtSqlStr, req.body.id, (err, results) => {
        if (err) return res.backTips(err);
        if (results.length != 1) res.backTips('删除数据失败');
        const imgPath = path.join(process.cwd(), results[0].cover_img);
        const delSqlStr = 'delete from article where id=? ';
        db.query(delSqlStr, req.body.id, (err, results) => {
            if (err) return res.backTips(err);
            if (results.affectedRows != 1) return res.backTips('删除数据失败');
            // 删除文章封面
            fs.access(imgPath, err => {
                //如果存在文章封面
                if (!err)
                    fs.unlink(imgPath, (err) => { if (err) return res.backTips('删除文章封面失败') });
            })
            return res.backTips('删除数据成功', 0);
        })

    })

}
function queryArticle(req, res) {
    const queryArticleSqlStr = 'select * from article where id = ?';
    db.query(queryArticleSqlStr, req.params.id, (err, results) => {
        if (err) return res.backTips(err);
        if (results.length != 1) res.backTips('回填待修改数据失败');
        results[0].cover_img = config.address + ':' + config.portNumber + results[0].cover_img;
        results[0].cover_img = results[0].cover_img.replaceAll('\\', '/');
        return res.backTips('查询数据成功', 0, results[0]);
    });
}
function reviseArticle(req, res) {
    //清理多余的对象属性,防止前端传递过来意外属性
    const articleId = req.body.id
    req.body = req.objectCopy(req.body, ['title', 'cate_id', 'content', 'state']);
    console.log(req.body);
    //定义修改article sql语句
    //判断传过来的文件是否有且文件名称为cover_img
    if (!req.file || req.file.fieldname !== 'cover_img')
        return res.backTips('文章封面是必选参数!');
    //定义数据库储存对象
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.userInfo.id,
        //是否删除
        is_delete: 0
    };
    console.log(articleInfo);
    // 定义修改文章的 SQL 语句：
    const reviseSqlStr = 'update article set ?  where id= ?';
    // 执行 SQL 语句
    db.query(reviseSqlStr, [articleInfo, articleId], (err, results) => {
        if (err) return res.backTips(err);
        if (results.affectedRows != 1) return res.backTips('修改文章失败');
        res.backTips('修改文章成功', 0);
    })
}

module.exports = {
    addArticle,
    queryArticlePage,
    deleteArticle,
    reviseArticle,
    queryArticle
};
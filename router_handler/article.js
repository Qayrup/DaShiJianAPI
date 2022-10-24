// 导入处理路径的 path 核心模块
const path = require('path');
// 导入数据库操作模块
const db = require('../db/index');


function addArticle(req, res) {
    req.body = req.objectCopy(req.body, ['title', 'cate_id', 'content', 'state'])
    if (!req.file || req.file.fieldname !== 'cover_img') return res.backTips('文章封面是必选参数！');
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.userInfo.id,
    }
    // 定义发布文章的 SQL 语句：
    const insertSqlStr = `insert into articles set ?`
    // 执行 SQL 语句
    db.query(insertSqlStr, articleInfo, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.backTips(err)
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.backTips('发布文章失败！')
        // 发布文章成功
        res.backTips('发布文章成功', 0)
    });
    console.log(req.body) // 文本类型的数据
    console.log('--------分割线----------')
    console.log(articleInfo) // 文件类型的数据

    res.backTips('hello');
}

module.exports = {
    addArticle
}
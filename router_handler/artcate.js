const db = require("../db")

//获取文章分类函数
function getArticleCates(req, res) {
    const selectSqlStr = 'select * from article_cate where is_delete=0 order by id desc'
    db.query(selectSqlStr, (err, results) => {
        if (err) return res.backTips(err);
        if (results.length < 1) return res.backTips('没有查询到数据')
        return res.backTips('获取文章分类列表成功！', 0, results)
    })
}
//新增文章分类
function addArticleCates(req, res) {
    const catesInfo = (({ name, alias }) => ({ name, alias }))(req.body);
    //定义查询分类名与别名是否被占用sqlStr
    const selectSqlStr = 'select * from article_cate where name=?or alias=? '
    db.query(selectSqlStr, [catesInfo.name, catesInfo.alias], (err, results) => {
        // 分类名称 和 分类别名 都被占用
        if (results.length === 2)
            return res.backTips('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1) {
            if (results[0].name === catesInfo.name && results[0].alias === catesInfo.alias)
                return res.backTips('分类名称与别名被占用，请更换后重试！')
            else if (results[0].name === catesInfo.name)
                return res.backTips('分类名称被占用，请更换后重试！')
            else return res.backTips('分类别名被占用，请更换后重试！')
        }
        const sql = `insert into article_cate set ?`
        db.query(sql, catesInfo, (err, results) => {
            // SQL 语句执行失败
            if (err) return res.backTips(err)
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.backTips('新增文章分类失败！')

            // 新增文章分类成功
            res.backTips('新增文章分类成功！', 0)
        })
    });
}
function delArticleCates(req, res) {
    // 定义删除文章分类sql
    const delSqlStr = 'delete from article_cate where id=?'
    db.query(delSqlStr, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.backTips(err);
        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.backTips('删除文章分类失败！');
        // 删除文章分类成功
        return res.backTips('删除文章分类成功！', 0);
    })
}
function getArtCateById(req, res) {
    // 定义根据 Id 获取文章分类的 SQL 语句：
    const selectSqlStr = 'select * from article_cate where id=?';
    // 调用 db.query() 执行 SQL 语句：
    db.query(selectSqlStr, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return req.backTips(err);
        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length != 1) return res.backTips('获取文章分类失败');
        // 把数据响应给客户端
        return res.backTips('获取文章分类成功', 0, results[0])
    });
}
function updateCateById(req, res) {
    // const catesInfo = (({ id, name, alias }) => ({ id, name, alias }))(req.body);
    const catesInfo = (({ id, name, alias }) => ({ id, name, alias }))(req.body);
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from article_cate where Id<>? and (name=? or alias=?)`;
    // 执行查重操作
    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.backTips(err)
        // 分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.backTips('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.backTips('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.backTips('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.backTips('分类别名被占用，请更换后重试！')
        // TODO：更新文章分类
        const sql = `update article_cate set ? where id=?`;
        db.query(sql, [catesInfo, req.body.id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.backTips(err);
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.backTips('更新文章分类失败！');
            // 更新文章分类成功
            res.backTips('更新文章分类成功！', 0);
        })
    })
}
module.exports = {
    getArticleCates,
    addArticleCates,
    delArticleCates,
    getArtCateById,
    updateCateById
}
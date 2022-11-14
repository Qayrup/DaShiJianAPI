const db = require('../db');
const bcrypt = require('bcryptjs')
function getUserInfo(req, res) {
    selectUserInfoSql = 'select * from users where id=?'
    db.query(selectUserInfoSql, req.userInfo.id, (err, results) => {
        if (err) return res.backTips(err);
        if (results.length != 1) return res.backTips('用户信息获取失败');
        // 伪造一个假密码
        results = { ...results[0], password: Math.random().toString(36).slice(-8) }
        return res.send({
            status: 0,
            message: '用户信息获取成功',
            data: results
        })
    })
}
function updateUserInfo(req, res) {
    const userInfo = (({ id, nickname, email }) => ({ id, nickname, email }))(req.body);
    //判断用户id和令牌id是否一致
    if (userInfo.id != req.userInfo.id) return req.backTips('用户id与令牌不一致');
    //定义更新用户信息数据sql
    const updateSqlStr = 'update users set ? where id=?'
    //调用db更新数据
    db.query(updateSqlStr, [userInfo, userInfo.id], (err, results) => {
        //执行sql出错返回
        if (err) return req.backTips(err);
        if (results.affectedRows != 1) return res.backTips('用户信息更新失败');
        //修改用户成功
        res.backTips('用户信息修改成功', 0);
    });
}
function updatePassword(req, res) {
    //定义查询用户密码的sql语句
    const selectSqlStr = 'select password from users where id=?';
    db.query(selectSqlStr, req.userInfo.id, (err, results) => {
        if (err) return res.backTips(err);
        if (results.length != 1) return res.backTips('用户id匹配失败');
        if (!bcrypt.compareSync(req.body.oldPassword, results[0].password)) return res.backTips('原密码错误');
        const updateSqlStr = 'update users set password= ? where id=?'
        db.query(updateSqlStr, [bcrypt.hashSync(req.body.newPassword, 10), req.userInfo.id], (err, results) => {
            // SQL 语句执行失败
            if (err) return res.backTips(err)
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.backTips('更新密码失败！')
            // 更新密码成功
            res.backTips('更新密码成功！', 0)
        })
    })
}
function updateAvatar(req, res) {
    const updateSqlStr = 'update users set user_pic= ? where id=?';
    db.query(updateSqlStr, [req.body.avatar, req.userInfo.id], (err, results) => {
        if (err) return res.backTips(err);
        if (results.affectedRows != 1) return res.backTips('更新用户头像失败');
        return res.backTips('更新用户头像成功', 0)
    });
}
module.exports = {
    getUserInfo,
    updateUserInfo,
    updatePassword,
    updateAvatar
}
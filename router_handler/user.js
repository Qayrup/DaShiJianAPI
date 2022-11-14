/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
// 导入数据库实例
const db = require('../db/index');
// 导入加密算法
const bcrypt = require('bcryptjs');
//导入token中间件
const jsonwebtoken = require('jsonwebtoken');
const { jwtKey, jwtKeyDate } = require('../config');
//导入jwb密钥
// 注册用户的处理函数
function signUp(req, res) {
    // 接收表单数据
    let { userName, password } = req.body;
    //定义sql查询语句
    let selectSqlStr = 'select userName from my_db_01.users where userName=?';
    db.query(selectSqlStr, userName, (err, results) => {
        //判断sql执行是否出错
        if (err) return res.backTips(err);
        // 判断用户名是否被占用
        if (results.length > 0) return res.backTips('用户名已被占用');
        // 使用bcrypt.js进行加密
        password = bcrypt.hashSync(password, 10)
        //定义新增语句
        let newSqlStr = `insert into users set ?`
        db.query(newSqlStr, { userName, password }, (err, results) => {
            //判断sql执行是否出错
            if (err) return res.backTips(err);
            // 判断受影响条数是否为一
            if (results.affectedRows !== 1) return res.backTips(err)
            return res.backTips('用户新增成功', 0);
        })
    })
}

// 登录的处理函数
function signIn(req, res) {
    let { userName, password } = req.body;
    const selectSqlStr = 'select * from users where userName=?'
    db.query(selectSqlStr, userName, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.backTips(err);
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length != 1) return res.backTips('登入失败!');
        //判断用户输入密码是否和数据库储存密码一致
        if (!bcrypt.compareSync(password, results[0].password))
            return res.backTips('密码输入错误')

        const userInfo = { ...results[0], password: null, user_pic: null };
        const tokenStr = jsonwebtoken.sign(userInfo, jwtKey, {
            expiresIn: jwtKeyDate
        });
        res.send({
            status: 0,
            message: '登入成功',
            token: 'Bearer ' + tokenStr,
        })
    })
}
module.exports = {
    signUp,
    signIn
}
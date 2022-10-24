//导入mySql对象
const mySql = require('mysql');
//创建数据库链接
const db = mySql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '523894',
    database: 'my_db_01',
})

module.exports = db
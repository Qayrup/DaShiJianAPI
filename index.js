// global.tips

//导入express
const express = require('express');

// 创建 express 的服务器实例
const app = express();

// //JSONP接口
// app.get('/api/jsonp', (req, res) => {
//     //获取客户端发送过来的回调函数名称
//     const funName = req.query.callback
//     // 得到要通过JSONP形式发送给客户端的数据
//     const data = { name: 'zs', age: 22 };
//     //根据前两部得到的数据拼接出一个函数调用的字符串
//     const scriptStr = `${funName}(${JSON.stringify(data)})`
//     //将上一步拼接得到的字符串响应给客户端的<script>标签进行解析执行
//     res.send(scriptStr)
// })

//------------------------自定义全局中间件导入及注册-----------------------
const myGlobalMiddleware = require('./middleware/customize/globalMiddleware')
app.use(myGlobalMiddleware.failureMessage)

// -----------------------------注册全局中间件-----------------------//

const {
    cors, //解决跨域问题
    urlencoded,  //解决传参问题
    expressJWT
} = (require('./middleware/middlewareConfig'));
app.use(cors, urlencoded, expressJWT);
//---------------------------托管静态资源文件-----------------------//
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
//-------------------------------注册路由-------------------------
const user = require('./router/user');
app.use('/api', user);
const userInfo = require('./router/userInfo');
app.use('/my', userInfo);
const artcate = require('./router/artcate');
app.use('/my', artcate);
const article = require('./router/article');
app.use('/my', article);

//--------------------------错误级别中间件导入及注册-------------------------//
const { validateTips } = require('./middleware/customize/errGlobalMiddleware');
app.use(validateTips);

////----------------------用户配置文件导入
const sysConfig = require('./config');

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(sysConfig.portNumber, () => {
    console.log(sysConfig.systemPrompts);
})
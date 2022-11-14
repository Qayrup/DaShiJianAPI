// 响应数据的中间件
const failureMessage = function (req, res, next) {
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.backTips = function (err, status = 1, data = null) {
        return res.send({
            // 状态
            status,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err,
            data: data
        })
    }
    // 挂载复制指定对象属性函数
    req.objectCopy = function (obj, arr) {
        let results = {};
        try {
            arr.forEach(element => {
                results[element] ?? null;
                results[element] = obj[element];
            });
        } catch (error) {
            console.log(error.message)
            return error
        }
        // finally {
        //     return '未知异常'
        // }
        return results;
    }
    //挂载删除指定文件函数
    req.fileDelete = function (filePath, fileName) {

        if (filePath || fileName) return req.backTips('文件名和文件路径是必须的');
        fs.readdir(filePath, 'utf-8', (err, fileList) => {
            if (err) return req.backTips('打开文件路径失败');

        })
    }
    next()
}
module.exports = {
    failureMessage
}
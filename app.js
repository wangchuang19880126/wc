const Koa = require("koa")
const static = require("koa-static")
const router = require("./routers/router")
const views = require("koa-views")
const body = require("koa-body")
const logger = require("koa-logger")
const { join } = require("path")
const cors = require("@koa/cors")
const session = require("koa-session")
const compress = require("koa-compress")

//生成koa实例
const app = new Koa

//注册日志模块
// app.use(logger())

//配置静态资源目录
app.use(static(join(__dirname, "static")))

//配置视图模板
app.use(views(join(__dirname, "views"), {
    extension: "pug"
}))

//设置session配置对象
app.keys = ['wc'];
const CONFIG = {
    key: 'Sid',
    maxAge: 30000,//2小时
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
}

// 注册session
app.use(session(CONFIG, app))

// 注册资源压缩模板 compress
app.use(compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))

//允许跨域请求
app.use(cors())

//解析post请求
app.use(body())

// 注册路由信息
app.use(router.routes())
    .use(router.allowedMethods())


// 监听端口
app.listen(3000, () => {
    console.log("服务器监听在3000端口！")
})
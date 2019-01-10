const Koa = require("koa")
const static = require("koa-static")
const router = require("./routers/router")
const views = require("koa-views")
const pug = require("pug")
const logger = require("koa-logger")
const { join } = require("path")


const app = new Koa

//注册日志模块
app.use(logger())

//配置静态资源目录
app.use(static(join(__dirname, "static")))

//配置视图模板
app.use(views(__dirname, "views"), {
    extension: "pug"//设置模板引擎
})

// 注册路由信息
app.use(router.routes())
    .use(router.allowedMethods())

    
// 监听端口
app.listen(3001, () => {
    console.log("服务器监听在3001端口！")
})
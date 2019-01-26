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
    maxAge: 2 * 36e5,//2小时
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
app.listen(3001, () => {
    console.log("服务器监听在3001端口！")
})

//创建管理员用户，如果管理员存在就返回
{
    const { db } = require("./Schema/config")
    const UserSchema = require("./Schema/user")
    const User = db.model("users", UserSchema)
    const crypto = require("./utill/encrypt")

    User.find({
        username: "admin"
    })
        .then(data => {
            if (data.length === 0) {
                //管理员不存在
                new User({
                    username: "admin",
                    password: crypto("admin"),
                    role: 666,
                    commentNum: 0,
                    articleNum: 0,
                }).save()
                    .then(data => {
                        console.log("创建管理员用户名：admin 密码： admin")
                    })
                    .catch(err => {
                        console.log(err)
                    })

            } else {
                data[0].role = 666,
                    User.updateOne({
                        username: "admin"
                    }, {
                            $set: {
                                role: 666
                            }
                        }).exec()
                console.log("管理员用户名：admin 密码： admin")
            }
        })
}
const Article = require("../models/article")
const User = require("../models/user")
const Comment = require("../models/comment")
const crypto = require("../utill/encrypt")
const fs = require("fs")
exports.root = async ctx => {
    let page = ctx.params.id || 1
    page--

    const maxNum = await Article.estimatedDocumentCount((err, num) => err ? console.log(err) : num)
    const artList = await Article
        .find()//查询数据
        .sort("-created")//降序排列
        .skip(5 * page)//跳过条数
        .limit(5)//限制每一页的数据条数
        .populate({
            path: "author",//关联属性
            select: "username _id avatar"//查询的属性
        })//mongoose连表查询
        .then(data => data)
        .catch(err => console.log(err))
    await ctx.render("index", {
        title: "这是博客主页",
        session: ctx.session,
        artList,
        maxNum,
    })
}
exports.add = async ctx => {
    const show = /^\/user\/(reg)$/.test(ctx.path)
    await ctx.render("register", {
        show,
    })
}
//注册用户
exports.reg = async ctx => {
    //用户注册是用户发过来的数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password
    await new Promise((resolve, reject) => {
        User.find({
            username
        }, (err, data) => {
            if (err) return reject(err)
            if (data.length !== 0) {
                //用户名已经存在
                return resolve("")
            }
            // 用户名不存在
            new User({
                username,
                password: crypto(password),
                commentNum: 0,
                articleNum: 0,
            }).save((err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })


        })
    }).then(async data => {
        if (data) {
            //注册成功
            await ctx.render("isOk", {
                status: "注册成功"
            })
            ctx.redirect("/user/login")
        } else {
            //用户名已经存在
            await ctx.render("isOk", {
                status: "用户名已经存在"
            })
        }
    }).catch(async err => {
        await ctx.render("isOk", {
            status: "注册失败，请重新注册"
        })
    })
}
// 登录用户
exports.login = async ctx => {
    const user = ctx.request.body
    const username = user.username
    const password = user.password
    await new Promise((res, rej) => {
        User.find({ username }, (err, data) => {
            if (err) return rej(err)
            if (data.length === 0) {
                //用户不存在
                return rej("用户不存在")
            }
            if (crypto(password) === data[0].password) {
                res(data)
            } else {
                res("")
            }

        })
    })
        .then(async data => {
            if (data) {
                //让用户在cookie里设置username password加密后的密码权限
                ctx.cookies.set("username", username, {
                    domain: "localhost",
                    path: "/",
                    maxAge: 2 * 36e5,
                    httpOnly: true,
                    overwrite: false,
                    signed: true,
                })

                ctx.cookies.set("uid", data[0]._id, {
                    domain: "localhost",
                    path: "/",
                    maxAge: 2 * 36e5,
                    httpOnly: true,
                    overwrite: false,
                    signed: true,
                })
                // ctx.session = null 手动设置session过期
                ctx.session = {
                    username,
                    uid: data[0]._id,
                    avatar: data[0].avatar,
                    role: data[0].role
                }


                await ctx.render("isOk", {
                    status: "登陆成功"
                })
            } else {
                await ctx.render("isOk", {
                    status: "密码错误"
                })
            }
        })
        .catch(async err => {
            await ctx.render("isOk", {
                status: "用户不存在，请注册账户"
            })
        })
}
exports.else = async ctx => {
    await ctx.render("404")
}


//保持用户的登录状态
exports.keepLog = async (ctx, next) => {
    await new Promise((res, rej) => {
        User.find({
            username: ctx.session.username
        }, (err, data) => {
            if (err) return rej(err)

            res(data)
        })
    })
        .then(async data => {
            if (!data.length && ctx.session.username) {
                ctx.session = null
                ctx.cookies.set("username", null, {
                    maxAge: 0,
                })
                ctx.cookies.set("uid", null, {
                    maxAge: 0,
                })
                return
            }
            if (ctx.session.isNew && ctx.cookies.get("uid")) {
                ctx.session = {
                    username: ctx.cookies.get("username"),
                    uid: ctx.cookies.get("uid"),
                    avatar:data[0].avatar
                }
            }
        }).catch(err => {
            console.log(err)
        })
    await next()
}
//退出登录
exports.logout = async ctx => {
    ctx.session = null
    ctx.cookies.set("username", null, {
        maxAge: 0,
    })
    ctx.cookies.set("uid", null, {
        maxAge: 0,
    })
    // 重新定向首页
    ctx.redirect("/user/login") //前端重定向location.href = "/"
}





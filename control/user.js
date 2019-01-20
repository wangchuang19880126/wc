const fs = require("fs")
const { db } = require("../Schema/config")
const UserSchema = require("../Schema/user")
const crypto = require("../utill/encrypt")
// console.log(crypto)
const User = db.model("users", UserSchema)
exports.root = async (ctx) => {
    await ctx.render("index", {
        title: "这是博客主页",
        session:ctx.session,
    })
}
exports.add = async (ctx) => {
    const show = /^\/user\/(reg)$/.test(ctx.path)
    await ctx.render("register", {
        show,
    })
}
//注册用户
exports.reg = async (ctx) => {
    //用户注册是用户发过来的数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password
    await new Promise((resolve, reject) => {
        User.find({ username }, (err, data) => {
            if (err) return reject(err)
            if (data.length !== 0) {
                //用户名已经存在
                return resolve("")
            }
            // 用户名不存在
            new User({
                username,
                password: crypto(password),
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
exports.login = async (ctx) => {
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
                    maxAge: 30000,
                    httpOnly: true,
                    overwrite: false,
                    signed: true,
                })

                // console.log(data[0]._id)
                ctx.cookies.set("uid", data[0]._id, {
                    domain: "localhost",
                    path: "/",
                    maxAge: 30000,
                    httpOnly: true,
                    overwrite: false,
                    signed: true,
                })
                // ctx.session = null 手动设置session过期
                ctx.session = {
                    username,
                    uid: data[0]._id,
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
//保持用户的登录状态
exports.keepLog = async (ctx, next) => {
    console.log(ctx.session.isNew , ctx.session)
    console.log(1)
    if(ctx.session.isNew){
        //session没有数据
        if(ctx.cookies.get("uid")){
            ctx.session = {
                username:ctx.cookies.get("username"),
                uid:ctx.cookies.get("uid")
            }
        }
    } 
    await next()
}
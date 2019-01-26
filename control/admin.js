const Article = require("../models/article")
const User = require("../models/user")
const Comment = require("../models/comment")

const fs = require("fs")
const { join } = require("path")

exports.index = async ctx => {
    if (ctx.session.isNew) {
        ctx.status = 404
        return await ctx.render("404", {
            title: 404
        })
    }
    const _id = ctx.params.id
    const arr = fs.readdirSync(join(__dirname, "../views/admin"))
    let flag = false
    arr.forEach(v => {
        const name = v.replace(/^(admin\-)|(\.pug)$/g, "")
        if (_id === name) {
            flag = true
            return
        }
    })
    if (flag) {
        await ctx.render("./admin/admin-" + _id, {
            role: ctx.session.role
        })
    } else {
        ctx.status = 404
        await ctx.render("404", {
            title: "404"
        })
    }
}
exports.upload = async ctx => {
    const filename = ctx.req.file.filename
    await User.updateOne({
        _id: ctx.session.uid
    }, {
            $set: {
                avatar: "/avatar/" + filename
            }
        })
    ctx.body = {
        status: 1,
        message: "上传成功"
    }
}
exports.manage = async ctx => {
    const _id = ctx.params.id
    const uid = ctx.session.uid
    switch (_id) {
        case "articles":
            await Article.find({
                author: uid,
            }).then(data => {
                ctx.body = {
                    code: 0,
                    count: data.length,
                    data,
                }
            }).catch(err => console.log(err))
            break
        case "comments":
            await Comment.find({
                from: uid,
            }).populate("article", "title")
                .then(data => {
                    ctx.body = {
                        code: 0,
                        count: data.length,
                        data,
                    }
                }).catch(err => console.log(err))
            break
        case "users":
            await User.find()
                .then(data => {
                    ctx.body = {
                        code: 0,
                        count: data.length,
                        data,
                    }
                }).catch(err => console.log(err))
            break
    }
}
exports.removeUser = async ctx => {
    const _id = ctx.params.id
    let res = {
        state: 1,
        message: "删除成功"
    }
    await User.findById(_id)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state: 0,
                message: "删除失败"
            }
        })
    ctx.body = res
}

const { db } = require("../Schema/config")
const ArticleSchema = require("../Schema/article")
const Article = db.model("articles", ArticleSchema)

const CommentSchema = require("../Schema/comment")
const Comment = db.model("comments", CommentSchema)
// const upload = require("../utill/upload")
const fs = require("fs")
const { join } = require("path")
const UserSchema = require("../Schema/user")
const User = db.model("users", UserSchema)


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
                    console.log(data)
                    ctx.body = {
                        commentCount:data.commentNum,
                        articleCount:data.articleNum,
                        code: 0,
                        count: data.length,
                        data,
                    }
                }).catch(err => console.log(err))
            break
    }
}

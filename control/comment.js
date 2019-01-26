const Article = require("../models/article")
const User = require("../models/user")
const Comment = require("../models/comment")
exports.add = async ctx => {
    // 获取数据
    if (ctx.session.isNew) return ctx.body = {
        status: 0,
        msg: "请登录！"
    }
    const data = ctx.request.body
    data.from = ctx.session.uid
    await new Comment(data)
        .save()
        .then(data => {
            ctx.body = {
                status: 1,
                msg: "发表成功"
            }
        }).catch(err => {
            console.log(err)
            ctx.body = {
                status: 0,
                msg: "发表失败"
            }
        })
}

exports.removeComment = async ctx => {
    const _id = ctx.params.id
    let res = {
        state: 1,
        message: "删除成功"
    }
    await Comment.findById(_id)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state: 0,
                message: "删除失败"
            }
        })
    ctx.body = res
}

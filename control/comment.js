const { db } = require("../Schema/config")
const ArticleSchema = require("../Schema/article")
const Article = db.model("articles", ArticleSchema)

const CommentSchema = require("../Schema/comment")
const Comment = db.model("comments", CommentSchema)

const UserSchema = require("../Schema/user")
const User = db.model("users", UserSchema)
exports.add = async ctx => {
    // 获取数据
    if (ctx.session.isNew) return ctx.body = {
        status: 0,
        msg: "请登录！"
    }
    const data = ctx.request.body
    data.from = ctx.session.uid
    const _comment = new Comment(data)
    await _comment.save()
        .then(data => {
            ctx.body = {
                status: 1,
                msg: "发表成功"
            }
            //查询更新计数
            Article.updateOne({
                _id: data.article
            }, {
                    $inc: {
                        commentNum: 1
                    }
                }, err => {
                    if (err) return console.log(err)
                    console.log("计数更新成功")
                })
        }).catch(err => {
            ctx.body = {
                status: 0,
                msg: "发表失败"
            }
        })
}

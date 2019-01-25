const { db } = require("../Schema/config")
const ArticleSchema = require("../Schema/article")
const Article = db.model("articles", ArticleSchema)

const CommentSchema = require("../Schema/comment")
const Comment = db.model("comments", CommentSchema)

const UserSchema = require("../Schema/user")
const User = db.model("users", UserSchema)
// 返回文章发表页

exports.addPage = async ctx => {
    await ctx.render("add-article", {
        session: ctx.session,
        title: "这是文章发表页面"
    })
}

// 文章发表并且保存到数据库
exports.add = async ctx => {
    // 用户没有登录
    if (ctx.session.isNew)
        return ctx.body = {
            msg: "用户没有登录",
            status: 0,
        }
    //用户硬件登录 
    const data = ctx.request.body
    // title content author tips
    data.author = ctx.session.uid
    data.commentNum = 0
    await new Promise((res, rej) => {
        new Article(data).save((err, data) => {
            if (err) return rej(err)
            //更新文章计数
            User.updateOne({
                _id: data.author
            }, {
                    $inc: {
                        articleNum: 1
                    }
                }, err => {
                    if (err) return console.log(err)
                    console.log("用户文章计数更新成功")
                })
            // Article.updateOne({
            //     _id: data.from
            // }, {
            //         $inc: {
            //             articleNum: 1
            //         }
            //     }, err => {
            //         if (err) return console.log(err)
            //         console.log("文章计数更新成功")
            //     })
            res(data)
        })
    })
        .then(data => {
            ctx.body = {
                msg: "保存成功",
                status: 1,
            }


        })
        .catch(err => {
            ctx.body = {
                msg: "发表失败",
                status: 0,
            }
        })
}

//文章详情
exports.detail = async ctx => {
    //获取动态路由的id
    const _id = ctx.params.id

    //查找文章数据
    const article = await Article.findById(_id)
        .populate("author", "username")
        .then(data => data)
    //查找关联的评论
    const comment = await Comment.find({
        article: _id,
    })
        .sort("-created")
        .populate("from", "username avatar")
        .then(data => data)
    //渲染评论页面
    await ctx.render("article", {
        title: article.title,
        article,
        comment,
        session: ctx.session,
    })
}
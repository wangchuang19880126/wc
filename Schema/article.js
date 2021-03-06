const { Schema } = require("./config")
const ObjectId = Schema.Types.ObjectId

const ArticleSchema = new Schema({
    tips: String,
    title: String,
    content: String,
    author: {
        type: ObjectId,//制定类型
        ref: "users" //关联users表
    },
    commentNum: Number,
}, {
        versionKey: false,//去除版本号
        // 设置创建的时间
        timestamps: {
            createdAt: "created",
        }
    })
//保存文章的钩子
ArticleSchema.post("save", doc => {
    const User = require("../models/user")
    const Comment = require("../models/comment")
    const { author} = doc
    User.updateOne({
        _id: author
    }, {
            $inc: {
                articleNum: 1
            }
        }, err => {
            if (err) return console.log(err)
            console.log("用户文章计数更新成功")
        })
})
//文章删除的钩子
ArticleSchema.post("remove", doc => {
    const User = require("../models/user")
    const Comment = require("../models/comment")
    const { author, _id } = doc
    User.updateOne({
        _id: author,
    }, {
            $inc: {
                articleNum: -1,
            }
        })
        .then(data => console.log("用户文章数量减一"))
        .catch(err => console.log("用户文章数量没有变化"))

    Comment.find({
        article: _id
    })
        .then(data => {
            data.forEach(v => v.remove())
            console.log("文章评论数量数量减一")
        })
        .catch(err => console.log("文章数量删除失败"))
})
module.exports = ArticleSchema
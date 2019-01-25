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
    commentNum:Number,
}, {
        versionKey: false,//去除版本号
        // 设置创建的时间
        timestamps: {
            createdAt: "created",
        }
    })


module.exports = ArticleSchema
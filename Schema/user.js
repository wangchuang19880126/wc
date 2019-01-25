const { Schema } = require("./config")
const UserSchema = new Schema({
    username: String,
    password: String,
    avatar:{
        type:String,
        default: "/avatar/default.jpg" //头像默认路径
    },
    role:{
        type:String,
        default:1,
    },
    articleNum:0,
    commentNum:0,
}, {
        versionKey: false,//去除版本号
        //设置创建的时间
        timestamps: {
            createdAt: "created",
        }
    })


module.exports = UserSchema
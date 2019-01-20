const { Schema} =require("./config")
const UserSchema = new Schema({
    username:String,
    password:String,
},{
    versionKey:false,//去除版本号
})


module.exports = UserSchema
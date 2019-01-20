const mongoose = require("mongoose");
const db = mongoose.createConnection("mongodb://localhost:27017/wc",{
    useNewUrlParser:true
})
//用原生es6的promise代替mongoose自己实现的promise
mongoose.Promise = global.Promise
//把mongoose的schema取出来
const Schema = mongoose.Schema

db.on("error", () => {
    console.log("wc数据库连接失败")
})
db.on("open", () => {
    console.log("wc数据库连接成功")
})


module.exports = {
    db,
    Schema,
}
// const fs = require("fs")
exports.root = async (ctx) => {
    // ctx.type = "text/html"
    // ctx.body = fs.readFileSync("./static/index.html","utf-8")
    await ctx.render("views/index.pug",{
        title: "主页"
    })
}
const fs = require("fs")
exports.root = async (ctx) => {
    await ctx.render("index.pug",{
        title: "主页"
    })
}
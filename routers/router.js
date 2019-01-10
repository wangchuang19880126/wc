const Router = require("koa-router")
const admin = require("./admin")
const router = new Router

router.get("/",admin.root)




module.exports = router
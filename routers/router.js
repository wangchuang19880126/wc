const Router = require("koa-router")
const user = require("../control/user")
const router = new Router

router.get("/", user.keepLog, user.root)
router.get(/^\/user\/(?=reg|login)/, user.add)

router.post("/user/reg", user.reg)
//用户登录
router.post("/user/login", user.login)
module.exports = router
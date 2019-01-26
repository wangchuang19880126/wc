const Router = require("koa-router")
const user = require("../control/user")
const admin = require("../control/admin")
//生成实例
const router = new Router

const article = require("../control/article")
const comment = require("../control/comment")

const upload = require("../utill/upload")
router.get("/", user.keepLog, user.root)
router.get(/^\/user\/(?=reg|login)/, user.add)

router.post("/user/reg", user.reg)
//用户登录
router.post("/user/login", user.login)
//用户退出账户
router.get("/user/logout", user.logout)
//发表文章
router.get("/article", user.keepLog, article.addPage)
// 文章的添加
router.post("/article", user.keepLog, article.add)
//分页路由
router.get("/page/:id", user.keepLog, user.root)
router.get("/article/:id", user.keepLog, article.detail)
// 评论路由
router.post("/comment", user.keepLog, comment.add)
//个人中心
router.get("/admin/:id", user.keepLog, admin.index)
//头像上传
router.post("/upload", user.keepLog, upload.single("file"), admin.upload)
//后台管理
router.get("/user/:id", user.keepLog, admin.manage)
router.del("/comment/:id", user.keepLog, comment.removeComment)
router.del("/article/:id", user.keepLog, article.removeArticle)
router.del("/user/:id", user.keepLog, admin.removeUser)


router.get("*", user.else)
module.exports = router
const router = require("express").Router();
const { auth } = require("../middelware/index.js");

const {pastText,getText}= require("../functions/paste.js")

router.post("/paste",pastText)
router.post("/getpaste",getText)

const {fileImport,getFile}= require("../functions/file.js")
const upload= require("../functions/upload.js")

router.post("/file",upload.single("file"),fileImport )
router.get("/getFile",auth, getFile );

// const {checkFileExist}= require("../functions/checkFileExist.js")
// router.get("/checkFileExist",checkFileExist)

const {checkPassword}= require("../functions/checkPassword.js")
router.post("/checkPassword",checkPassword)

const {shortUrl,getUrl}= require("../functions/url.js");

router.post("/url",shortUrl)
router.get("/url",getUrl)


module.exports=router
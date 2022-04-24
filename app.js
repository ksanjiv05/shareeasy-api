require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors")
app.use(cors())
app.use(express.json({ limit: "2000mb" }));
app.use(express.urlencoded({ limit: "2000mb" }));

require("./db/index.js")
global.rootDir = __dirname;

app.use("/api",require("./routes"))

const {encryptePaste,decryptePaste}=require("./utils/secure.js")
const {encFile,decFile}=require("./utils/secureFile.js")

async function test(){
    // const v=await decryptePaste("f5ed6e5f0559e968124af719610ac9a4","qwerty")
    //encFile("./test.txt","enccct.txt","12345678")
    // decFile("enccct.txt","hh",false,"12345678")
    console.log("---")

}
test()
const {checkFileExist}= require("./functions/checkFileExist.js")
app.get("/:fileId",checkFileExist)

app.use(express.static("/home/share/backend/client/build"));
app.get("*",async (req,res)=>{
  
    console.log("file server")
    return res.sendFile("/home/share/backend/client/build/index.html")
})

const port = process.env.PORT||3001
app.listen(port,()=>{
    console.log("server running at "+port)
})

module.exports=app
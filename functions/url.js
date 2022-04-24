const Share = require("../models/Share");
const { customAlphabet } = require("nanoid");


const nanoid = customAlphabet("q1wQWERTYUIOPert24yuioplASD0FGH3JKLkjhgf9dsa5zZXCV86BNMxc7vbnm", 8);


const shortUrl=async(req,res)=>{
try {
    console.log("data ",req.body);
    const {textData="",exp=0,isBurn=false,password=""}= req.body;
    if(textData==="")
    return res.status(400).json({msg:"please provide url"});
    
    const fileId=nanoid();
    

    const newShare= new Share({
        fileId,
        fileType:"url",
        fileData:textData,
        isBurn,
        isProtected:false,
        password:"",
        exp:2
    });
    await newShare.save();
    console.log("text  saved")
    return res.status(200).json({msg:"you are successfully pate created ",link:"http://134.255.216.211:3001/"+fileId})

} catch (error) {
    console.log("text enc error ",error)
    return res.status(500).json({msg:"Internal server error"})
}
}


const getUrl=async(req,res)=>{
try {
    console.log("data ",req.query);
    const {fileId=""}= req.query;
    if(fileId==="")
      return res.status(400).json({msg:"please provide fileId"});
    const share= await Share.findOne({fileId});

    if(!share)
    return res.status(202).json({ msg: "file not exist" });

    console.log("text  data - ",share)
    return res.status(200).json({msg:"you are successfully pate created ",data:share.data})
    // return res.redirect(share.data)

} catch (error) {
    console.log("text enc error ",error)
    return res.status(500).json({msg:"Internal server error"})
}
}

module.exports={shortUrl,getUrl}
const Share = require("../models/Share");
const bcrypt = require("bcryptjs");

const { encFile, decFile } = require("../utils/secureFile.js");
const sendToken = require("../utils/sendToken");

const checkPassword = async (req, res) => {
  try {
    const { fileId = "", password = "" } = req.body;
    console.log("password check -",req.body)
    const isExist = await Share.findOne({ fileId });
    console.log("password check ", isExist);
    if (isExist) {
      const isMatch = await bcrypt.compare(password, isExist.password);
      // console.log("mach ",isMatch,isExist.password, password)
      if (isMatch) {
        if (isExist.isBurn) {
        }
        //await Share.deleteOne({fileId});
        //  if(isExist.fileType=="text") res.status(200).json({ msg: "file is exist" });
        await decFile(isExist.fileData, res, isExist.isBurn, password);
        const payload = {
          fileId,
        };

        sendToken(payload, (token) => {
          if (token)
            return res.status(200).json({
              token,
            });
          throw err;
        });
      } else return res.status(201).json({ msg: "password is incorrect" });
    } else return res.status(202).json({ msg: "file is not exist" });
  } catch (err) {
    console.log("file password check error ", err);
    return res.status(500).json({ msg: "internal server error" });
  }
};
module.exports = { checkPassword };

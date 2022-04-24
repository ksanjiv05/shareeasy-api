const Share = require("../models/Share");
const { customAlphabet } = require("nanoid");
const { encFile, decFile } = require("../utils/secureFile.js");
const { worker } = require("../worker/worker.js");
const bcrypt = require("bcryptjs");

const nanoid = customAlphabet(
  "q1wQWERTYUIOPert24yuioplASD0FGH3JKLkjhgf9dsa5zZXCV86BNMxc7vbnm",
  6
);

const fileImport = async (req, res) => {
  try {
    console.log("data ", req.body, req.file);
    const {
      exp = 0,
      isBurn = "false",
      password = "",
      isProtected = "false",
    } = req.body;
    if (req.file.filename === "")
      res.status(203).json({ fileName: "upload failed" });
      
    const fileId = nanoid();

    if (isProtected === "false") {
      console.log("i ma here")
      const newShare = new Share({
        fileId,
        fileType: "file",
        fileData: req.file.filename,
        isBurn: isBurn === "true",
        isProtected: isProtected==="true",
        password: "",
        exp,
      });
      await newShare.save();

      return res.status(200).json({
        msg: "you are successfully pate created ",
        link: "http://134.255.216.211:3001/" + fileId,
      });
    } else {
      const path = req.file.path;
      const desc = req.file.destination + "enc-" + req.file.filename;
      const encData = await encFile(path, desc, password);
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newShare = new Share({
        fileId,
        fileType: "file",
        fileData: "enc-" + req.file.filename,
        isBurn: isBurn === "true",
        isProtected: password.length > 4,
        password: hashPassword,
        exp,
      });
      await newShare.save();

      return res.status(200).json({
        msg: "you are successfully pate created ",
        link: "http://134.255.216.211:3001/" + fileId,
      });
    }
  } catch (err) {
    console.log("media upload err", err);
    return res.status(500).json({ message: "Internam server error" });
  }
};


const getFile = async (req, res) => {
  try {
    const { fileId = "", password = "" } = req.body.decoded;
    console.log("password check -", fileId, req.body)
    const isExist = await Share.findOne({ fileId });
    // console.log("password check ",isExist)
    if (isExist) {
      //const isMatch = await bcrypt.compare(password, isExist.password);

      // if (isMatch) {
      //   if (isExist.isBurn) await Share.deleteOne({ fileId });
      //   if (isExist.isProtected) {
      //     await decFile(isExist.fileData, res, isExist.isBurn, password);
      //   } else {
      //     sendFile(res, isExist.fileData, isExist.isBurn);
      //   }
      // } else return res.status(201).json({ msg: "password is incorrect" });

      return res.sendFile(global.rootDir + (isExist.isProtected?"/temps/":"/uploads/") + isExist.fileData)

    } else return res.status(202).json({ msg: "file is not exist" });
  } catch (err) {
    console.log("file password check error ", err);
    return res.status(500).json({ msg: "internal server error" });
  }
};

const sendFile = (res, fileName, burn) => {
  try {
    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="' + fileName + '"',
      filename: fileName,
    });
    res.setHeader("Access-Control-Expose-Headers", "filename");
    res.sendFile(
      global.rootDir + "/temps/" + fileName,
      { fileName: fileName },
      function (err) {
        if (err) {
          console.log("unable to server");
        } else {
          console.log("Sent:", fileName, " is  burn  ", burn);
          fs.unlink(global.rootDir + "/temps/" + fileName, (err) => {
            console.log("unable to delete file in temp ", err);
          });
          if (burn) {
            console.log("this file is burned");
            fs.unlink(global.rootDir + "/uploads/" + fileName, (err) => {
              console.log("unable to delete file in  burn temp ", err);
            });
          }
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
};

module.exports = { fileImport, getFile };

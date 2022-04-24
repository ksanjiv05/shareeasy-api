const Share = require("../models/Share");
const { customAlphabet } = require("nanoid");
const { encryptePaste, decryptePaste } = require("../utils/secure.js");
const bcrypt = require("bcryptjs");

const nanoid = customAlphabet(
  "q1wQWERTYUIOPert24yuioplASD0FGH3JKLkjhgf9dsa5zZXCV86BNMxc7vbnm",
  8
);

const pastText = async (req, res) => {
  try {
    // console.log("data ",req.body);
    const {
      textData = "",
      exp = 0,
      isBurn = false,
      password = "",
      isProtected = false,
    } = req.body;
    if (textData === "")
      return res.status(400).json({ msg: "please provide text data" });
    const fileId = nanoid();

    if (!isProtected) {
      const newShare = new Share({
        fileId,
        fileType: "text",
        fileData: textData,
        isBurn,
        isProtected: false,
        password: "",
        exp,
      });
      await newShare.save();
      console.log("text  saved");
      return res.status(200).json({
        msg: "you are successfully pate created ",
        link: "http://134.255.216.211:3001/" + fileId,
      });
    } else {
      const encData = await encryptePaste(textData, password);
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newShare = new Share({
        fileId,
        fileType: "text",
        fileData: encData,
        isBurn,
        isProtected: password.length > 4,
        password: hashPassword,
        exp,
      });
      await newShare.save();
      console.log("text  saved");
      return res.status(200).json({
        msg: "you are successfully pate created ",
        link: "http://134.255.216.211:3001/" + fileId,
      });
    }
  } catch (error) {
    console.log("text enc error ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const getText = async (req, res) => {
  try {
    console.log("data ",req.body);
    const { fileId = "", password = "" } = req.body;
    if (fileId === "")
      return res.status(400).json({ msg: "please provide fileId" });
    const share = await Share.findOne({ fileId });
    console.log("____",share)
    if (!share) return res.status(202).json({ msg: "file not exist" });

    if (share.isProtected) {
      const isMatch = await bcrypt.compare(password, share.password);
      console.log("mach ", isMatch, password);
      if (!isMatch) return res.status(201).json({ msg: "key is incorrect" });
    }

    if (share.isBurn) await Share.deleteOne({ fileId });
    if (share.isProtected) {
      const decData = await decryptePaste(share.fileData, password);

      return res
        .status(200)
        .json({ msg: "you are successfully pate created ", data: decData });
    }else{
        return res
        .status(200)
        .json({ msg: "you are successfully pate created ", data: share.fileData });
    }
  } catch (error) {
    console.log("text enc error ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { pastText, getText };

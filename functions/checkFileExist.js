const Share = require("../models/Share");
const sendToken = require("../utils/sendToken");
const { worker } = require("../worker/worker.js");

const checkFileExist = async (req, res) => {
  try {
    const { fileId = "" } = req.params; ///req.query;
    console.log(req.query, "-----------", fileId, req.params.fileId);
    if (fileId === "") {
      return res
        .status(201)
        .json({ msg: "You have not permission to access file" });
    }
    const userFile = await Share.findOne({
      fileId,
    })
      .select("isProtected")
      .select("fileType")
      .select("fileId")
      .select("fileData");

    // worker();
    console.log("file found ", userFile);
    if (!userFile) {
      return res.status(201).json({ msg: "file not exist" });
    }

    if (userFile.isProtected) {
      return res.status(200).json({
        file: {
          _id: userFile._id,
          fileType: userFile.fileType,
          fileId,
          isProtected: userFile.isProtected,
          fileName: userFile.fileType === "file" ? userFile.fileData : "",
        },
      });
    } else
      sendToken(
        {
          fileId,
        },
        (token) => {
          console.log(":i havew rtoken",token)
          if (token)
            return res.status(200).json({
              token,
              file: {
                _id: userFile._id,
                fileType: userFile.fileType,
                fileId,
                isProtected: userFile.isProtected,
                fileName: userFile.fileType === "file" ? userFile.fileData : "",
              },
            });
        }
      );
  } catch (error) {
    console.log("check file error", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

module.exports = { checkFileExist };

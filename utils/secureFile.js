const crypto = require("crypto");
const fs = require("fs");
const mkdirp = require("mkdirp");

const algorithm = "aes-256-cbc";

const encFile = async (path, desc, key) => {
  const reader = fs.createReadStream(path);
  // encrypt content
  const encrypt = crypto.createCipher(algorithm, key);

  // write file
  const writer = fs.createWriteStream(desc);

  reader.pipe(encrypt).pipe(writer);

  writer.on("finish", function () {
    console.log("file encrypted");
    // fs.unlink(path, (err) => {
    //   console.log("unable to delete file ", err);
    // });
  });

  return true;
};

const decFile = async (fileName, res, burn, key) => {
  try {
    // input file
    const reader = fs.createReadStream(global.rootDir + "/uploads/" + fileName);

    const decrypt = crypto.createDecipher(algorithm, key);
    // write file
    mkdirp.sync(
      `${global.rootDir}/temps/`
    );
    const writer = fs.createWriteStream(global.rootDir + "/temps/" + fileName);

    // start pipe
    reader.pipe(decrypt).pipe(writer);
    reader.on("error", (err) => {
      console.log("unable to read dcrypt", err);
      // return res.status(201).json({ error: "key is wrong" });
    });
    writer.on("error", (err) => {
      console.log("unable to dcrypt", err);
      // return res.status(201).json({ error: "key is wrong" });
    });
    writer.on("finish", function () {
      console.log("file dec");
      //     Content-Type: application/octet-stream
      // Content-Disposition: attachment; filename="picture.png"
      // res.set({
      //   "Content-Type": "application/octet-stream",
      //   "Content-Disposition": 'attachment; filename="' + fileName + '"',
      //   filename: fileName,
      // });
      // res.setHeader("Access-Control-Expose-Headers", "filename");
      // res.sendFile(
      //   global.rootDir +"/temps/" + fileName,
      //   { fileName: fileName },
      //   function (err) {
      //     if (err) {
      //       console.log("unable to server");
      //     } else {
      //       console.log("Sent:", fileName, " is  burn  ", burn);
      //       fs.unlink(global.rootDir +"/temps/" + fileName, (err) => {
      //         console.log("unable to delete file in temp ", err);
      //       });
      //       if (burn) {
      //         console.log("this file is burned");
      //         fs.unlink(global.rootDir +"/uploads/" + fileName, (err) => {
      //           console.log("unable to delete file in  burn temp ", err);
      //         });
      //       }
      //     }
      //   }
      // );
    });
  } catch (error) {
    console.log("error to decrypt ");
    // res.status(500).json({ error: "key is wrong" });
  }
};

module.exports = { encFile, decFile };

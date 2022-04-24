const multer = require("multer");
const mkdirp = require("mkdirp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  
    mkdirp.sync(
      `${global.rootDir}/uploads/`
    );
    console.log("file upload request ",req.body)
   
    cb(
      null,
      `${global.rootDir}/uploads/`
    );
  },
  filename: function (req, file, cb) {
      let time=Date.now();
      console.log("file original name ",time+file.originalname)
    cb(null,time+file.originalname);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;

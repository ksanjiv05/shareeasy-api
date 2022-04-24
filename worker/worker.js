const Share = require("../models/Share");

const fs = require("fs");

const worker = async () => {
  try {
    const files = await Share.find({
      $or: [
        {
          $and: [
            { exp: 2 },
            {
              created: { $lt: new Date(new Date() - 1000 * 60 * 60 * 24 * 7) },
            },
          ],
        },
        {
          $and: [
            { exp: 1 },
            { created: { $lt: new Date(new Date() - 1000 * 60 * 60 * 24) } },
          ],
        },
      ],
    });

    await Share.deleteMany({
      $or: [
        {
          $and: [
            { exp: 2 },
            {
              created: { $lt: new Date(new Date() - 1000 * 60 * 60 * 24 * 7) },
            },
          ],
        },
        {
          $and: [
            { exp: 1 },
            { created: { $lt: new Date(new Date() - 1000 * 60 * 60 * 24) } },
          ],
        },
      ],
    });
    // const filesx = await Share.deleteMany({
    //   $and: [
    //     { exp: 1 },
    //     { created: { $lt: new Date(new Date() - 1000 * 60 * 60 * 24) } },
    //   ],
    // });
    files.map((file) => {
      deleteFile(file);
    });
    console.log(files, "the document older then 7 day deleted");
  } catch (error) {
    console.log("worker error", error);
  }
};

const deleteFile = (file) => {
  const filePath = `${global.rootDir}/uploads/${file.data}`;
  fs.unlink(filePath, function (err) {
    if (err) {
      // throw err;
      console.log("err to move ", err);
    } else {
      console.log("Successfully deleted!");
    }
  });
};

module.exports = { worker };

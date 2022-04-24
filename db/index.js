// const mongoose = require("mongoose");

// module.exports = async () => {
//   try {
//     console.log("trying to connect db ...")
//     await mongoose.connect(process.env.DBURL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB Connected");
//   } catch (e) {
//     console.log("unable to connect db", e.message); 
//     process.exit(1);
//   }
// };
const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb://" +
    process.env.DB_URL +
    "/" +
    process.env.DB_NAME +
    "?retryWrites=true",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

connection
  .then((success) => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("connection err ", err);
  });

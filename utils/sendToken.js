const jwt = require("jsonwebtoken");

const sendToken = (payload, cb) => {
  try {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 3600,
      },
      async (err, token) => {
        if (err) {
          cb(null);
        }
        cb(token);
      }
    );
  } catch (error) {
    cb(null);
  }
};

module.exports = sendToken;

const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header('authorization');
    console.log("token",token)
    if (!token) {
      return res.status(400).json({ message: "JWT token provide in header" });
    }

    const decoded = await varifyToken(token);

    if (decoded) {
      req.body.decoded = decoded;
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.log(err.message, req.originalUrl);
    if (err.message == "invalid token") {
      return res.status(400).json({ message: "Invalid JWT token" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const varifyToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

module.exports = { varifyToken, auth };

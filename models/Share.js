const mongoose = require("mongoose");

const shareSchema = mongoose.Schema({
  fileId: {
    type: String,
    required: true,
    unique: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileData: {
    type: String,
  },

  exp: {
    type: Number,
  },
  isProtected: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  isBurn: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Share", shareSchema);

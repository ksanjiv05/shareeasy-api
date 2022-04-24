const crypto = require("crypto");

const algorithm = "aes-192-cbc";


const iv = Buffer.alloc(16, 0);

const encryptePaste = async (message, password) => {
  const key = crypto.scryptSync(
    password,
    "keyx",
    24
  );
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encryptedData = cipher.update(message, "utf-8", "hex");

  encryptedData += cipher.final("hex");
  return encryptedData;
};

const decryptePaste = async (encryptedPaste, password) => {
  const key = crypto.scryptSync(
    password,
    "keyx",
    24
  );
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAutoPadding(false);
  let decryptedData = decipher.update(encryptedPaste, "hex", "utf-8");

  decryptedData += decipher.final("utf8");

  return decryptedData;
};

module.exports = { encryptePaste, decryptePaste };

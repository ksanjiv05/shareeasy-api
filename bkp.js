const crypto = require("crypto");

const algorithm = "aes-256-cbc"; 
const initVector = crypto.randomBytes(16);
//const message = "This is a secret message";
const Securitykey = crypto.randomBytes(32);
console.log("random bite-------- ",Securitykey)

const encrypteText=async(message)=>{

const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

let encryptedData = cipher.update(message, "utf-8", "hex");

encryptedData += cipher.final("hex");

console.log("Encrypted message: " + encryptedData);
return encryptedData
}

const decrypteText=async(encryptedText)=>{
    
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  decipher.setAutoPadding(false);
   let decryptedData = decipher.update(encryptedText, "hex", "utf-8");
 
   decryptedData += decipher.final("utf8");

console.log("Decrypted message: " + decryptedData);
return decryptedData
}

module.exports={encrypteText,decrypteText}
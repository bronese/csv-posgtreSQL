// Include crypto-js library for hashing
const CryptoJS = require("crypto-js");

// The stored hashed password (retrieved from your system)
let storedHashedPassword = "a1b2c3d4e5"; // This should be a real hashed password

// Function to hash password
function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}

// Function to check the entered password against the stored one
function checkPassword(username, password) {
  // Hash the entered password
  let hashedPassword = hashPassword(password);

  // Check the hashed password against the stored one
  if (hashedPassword === storedHashedPassword) {
    console.log("Login successful!");
  } else {
    console.log("Login failed!");
  }
}

// Use the function
checkPassword("username", "password");

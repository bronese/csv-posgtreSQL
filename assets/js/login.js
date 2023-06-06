// Include crypto-js library for hashing
const CryptoJS = require("crypto-js");
// The stored hashed password (retrieved from your system)
let storedHashedPassword =
  "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // This should be a real hashed password

// Function to hash password
function hashPassword(pwd) {
  return CryptoJS.SHA256(pwd).toString();
}

// Function to check the entered password against the stored one
function checkPassword(username, pwd) {
  // Hash the entered password
  let hashedPassword = hashPassword(pwd);

  // Check the hashed password against the stored one
  if (hashedPassword === storedHashedPassword && username === "admin") {
    window.location.href = "/public/logged.html";
  } else {
    UIkit.modal(document.querySelector("#error-modal")).show();
  }
}

document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("pwd").value;
    checkPassword(username, password);
  });

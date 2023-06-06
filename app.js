const express = require("express");
const multer = require("multer");
const csv = require("fast-csv");
const { Client } = require("pg");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" }); // Set the destination folder for uploaded files
const path = require("path");

// // PostgreSQL database connection setup
// const client = new Client({
//   user: "your_username",
//   host: "your_host",
//   database: "your_database",
//   password: "your_password",
//   port: 5432, // replace with your PostgreSQL port
// });
// client.connect();
// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Route for the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route for the logged-in page
app.get("/logged", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "logged.html"));
});

// Route to handle file upload
app.post("/upload", upload.single("csvFile"), (req, res) => {
  if (!req.file) {
    res.status(400).send("No CSV file uploaded.");
    return;
  }
});
//   const filePath = req.file.path;

// app.post("/upload", upload.single("csvFile"), (req, res) => {
//   if (!req.file) {
//     res.status(400).send("No CSV file uploaded.");
//     return;
//   }

//   const filePath = req.file.path;
// });
//   fs.createReadStream(filePath)
//     .pipe(csv.parse({ headers: true }))
//     .on("data", async (row) => {
//       try {
//         await client.query(
//           "INSERT INTO your_table (column1, column2, ...) VALUES ($1, $2, ...)",
//           [row.column1, row.column2, ...]
//         );
//       } catch (error) {
//         console.error("Error inserting row:", error);
//       }
//     })
//     .on("end", () => {
//       console.log("CSV file parsing completed.");
//       client.end();
//     })
//     .on("error", (error) => {
//       console.error("CSV file parsing error:", error);
//       client.end();
//     });

//   res.send("CSV file uploaded and parsed successfully.");
// });

const port = 3000; // Set the desired port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

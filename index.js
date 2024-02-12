const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfkit = require("pdfkit");
const crypto = require("crypto");

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

var corsOptions = {
  origin: `http://localhost:${port}`,
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json("Server Working");
});

app.post("/generate-pdf", (req, res) => {
    const data = req.body; // Assuming data is sent as JSON from frontend
  
    // Create a new PDF document
    const doc = new pdfkit();
  
    // Set the background color of the PDF
    doc.rect(0, 0, 612, 792).fill("#FFFFFF"); // 612x792 is a standard letter size in points
  
    // Add a background image
    doc.image('background.jpg', 0, 0, { width: 612, height: 792 });
  
    // Set font and font size for Information heading
    doc.font("Helvetica-Bold").fontSize(24);
    // Add Information heading in h1 format
    doc.text("Information", { align: "center" });
  
    // Set font and font size for table data
    doc.font("Helvetica").fontSize(16);
  
    // Define table properties
    const tableWidth = 400; // Width of the table
    const tableTop = 150; // Y coordinate for the top of the table
    const col1Width = 150; // Width of the first column
    const col2Width = 250; // Width of the second column
    const rowHeight = 30; // Height of each row
    const borderWidth = 1; // Border width
  
    // Calculate starting X coordinate to center the table horizontally
    const startX = (doc.page.width - tableWidth) / 2;
  
    // Draw table headers
    doc.rect(startX, tableTop, col1Width, rowHeight).fillAndStroke("#CCCCCC", "#000000");
    doc.rect(startX + col1Width, tableTop, col2Width, rowHeight).fillAndStroke("#CCCCCC", "#000000");
    doc.fillColor("#000000").text("Field", startX + 7, tableTop + 10).text("Value", startX + col1Width + 7, tableTop + 10);
  
    // Draw table rows with data
    const rowData = [
      { field: "Name", value: data.Name },
      { field: "Address", value: data.Address },
      { field: "Designation", value: data.Designation },
      { field: "Phone Number", value: data.Phone_Number },
      { field: "Company Name", value: data.Company_Name },
      { field: "College", value: data.College_Name }
    ];
  
    let y = tableTop + rowHeight;
    rowData.forEach((row, index) => {
      doc.rect(startX, y, col1Width, rowHeight).stroke();
      doc.rect(startX + col1Width, y, col2Width, rowHeight).stroke();
      doc.text(row.field, startX + 7, y + 10);
      doc.text(row.value, startX + col1Width + 7, y + 10);
      y += rowHeight;
    });
  
    // Set headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
  
    // Pipe the PDF to the response
    doc.pipe(res);
    doc.end();
  });

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
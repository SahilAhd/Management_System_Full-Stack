
// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Multer instance
const upload = multer({ storage });

// Upload route with metadata saving
router.post('/', upload.single('file'), (req, res) => {
  const { username, email } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const metadataPath = path.join(uploadsDir, 'submissions.json');
  let submissions = [];

  // Load existing submissions if file exists
  if (fs.existsSync(metadataPath)) {
    const data = fs.readFileSync(metadataPath);
    submissions = JSON.parse(data);
  }

  // Add new submission entry
  submissions.push({
    username: username || "Unknown",
    email: email || "Unknown",
    filePath: `http://localhost:5002/uploads/${file.filename}`,
    date: new Date().toISOString()
  });

  // Write back updated submissions
  fs.writeFileSync(metadataPath, JSON.stringify(submissions, null, 2));

  res.status(200).json({ message: 'File uploaded successfully', filePath: `/uploads/${file.filename}` });
});

module.exports = router;

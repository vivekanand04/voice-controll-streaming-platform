// import multer from "multer";

// // Define storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp"); // Specify the destination directory for uploaded files
//   },
//   filename: function (req, file, cb) {
//     // Generate a unique filename for uploaded files
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const extension = file.originalname.split('.').pop(); // Extract file extension
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension); // Construct filename
//   }
// });

// // Initialize Multer with the storage configuration
// export const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 } // Optional: Limit file size to 10MB
// });

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure public/temp folder exists
const tempDir = path.join(process.cwd(), 'public', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir); // Saves to /public/temp
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});

// Initialize Multer with the storage configuration
export const upload = multer({  
  storage: storage,
  limits: { fileSize: 600 * 1024 * 1024 } 
});



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

import multer from 'multer';

// Example: Multer expects a field named "video"
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'video/mp4') {
      cb(null, true);
    } else {
      cb(new Error('Only MP4 videos are allowed'), false);
    }
  }
});

// Middleware for single file upload (field name MUST match Postman)
export const videoUpload = upload.single('video'); // Field name = "video"
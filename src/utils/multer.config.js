import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const filetypes = /mp4|mov|avi|webm/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && filetypes.test(extname)) {
    return cb(null, true);
  }
  cb(new Error('Only video files are allowed'));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
}).single('video');
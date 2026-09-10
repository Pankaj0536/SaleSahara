import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB max file size
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
      cb(null, true);
    } else {
      cb(new Error('Only .csv, .xlsx, and .xls files are permitted.'));
    }
  }
});

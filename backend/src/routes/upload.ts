import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyToken } from '../middleware/auth';

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const router = express.Router();

router.post('/', verifyToken, upload.single('file'), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get('host')}/api/files/${req.file.filename}`;
  return res.json({ url: fileUrl });
});

router.get('/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  return res.sendFile(filePath);
});

export default router;

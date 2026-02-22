import { Router } from 'express';
import multer from 'multer';
import { uploadFile, serveFile } from '../controllers/uploadController';

const router = Router();
const upload = multer({ dest: process.env.UPLOAD_DIR });

router.post('/upload', upload.single('file'), uploadFile);
router.get('/files/:filename', serveFile);

export default router;
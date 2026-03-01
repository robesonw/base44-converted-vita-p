import { Router } from 'express';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/', upload.single('file'), (req, res) => {
    res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;
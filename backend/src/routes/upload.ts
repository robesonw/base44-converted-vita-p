import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');
    res.json({ url: `/uploads/${file.filename}` });
});

export default router;
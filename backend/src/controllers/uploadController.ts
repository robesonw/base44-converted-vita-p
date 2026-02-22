import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const uploadFile = async (req: Request, res: Response) => {
    const filePath = path.join(process.env.UPLOAD_DIR, req.file.filename);
    const url = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;

    res.json({ url });
};

export const serveFile = (req: Request, res: Response) => {
    const { filename } = req.params;
    const filePath = path.join(process.env.UPLOAD_DIR, filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
};
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Use unique filename for storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    cb(null, file.mimetype === 'application/pdf');
  },
});

// POST: Upload PDF
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const storedFilename = req.file.filename;            // e.g., 16912345678-report.pdf
    const originalFilename = req.file.originalname;      // e.g., report.pdf
    const filesize = req.file.size;
    const filepath = req.file.path;

    const result = await db.query(
      'INSERT INTO documents (filename, original_filename, filepath, filesize, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [storedFilename, originalFilename, filepath, filesize]
    );

    res.json({ message: 'Upload successful', file: result.rows[0] });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET: List all documents
router.get('/', async (_, res) => {
  const result = await db.query(
    'SELECT id, original_filename, filesize FROM documents ORDER BY created_at DESC'
  );
  res.json(result.rows);
});

// GET: Download file
router.get('/:id', async (req, res) => {
  const result = await db.query('SELECT * FROM documents WHERE id = $1', [req.params.id]);
  if (!result.rows.length) return res.status(404).send('Not found');
  const file = result.rows[0];
  res.download(file.filepath, file.original_filename);
});

// DELETE: Delete file
router.delete('/:id', async (req, res) => {
  const result = await db.query('SELECT * FROM documents WHERE id = $1', [req.params.id]);
  if (!result.rows.length) return res.status(404).send('Not found');
  fs.unlinkSync(result.rows[0].filepath);
  await db.query('DELETE FROM documents WHERE id = $1', [req.params.id]);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;

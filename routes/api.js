const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

var _batch = 1

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     const uploadDir = path.join('uploads', `${req.batch}`);
     fs.mkdirSync(uploadDir, { recursive: true });
     cb(null, uploadDir);
   },
   filename: (req, file, cb) => {
     const fileExtension = file.originalname.split('.')[1];
     const newFilename = uuidv4();
     cb(null, `${newFilename}.${fileExtension}`)
   },
});

const upload = multer({ storage: storage });

router.post('/uploads', (req, res, next) => {
   req.batch = _batch
   next();
});

router.post('/uploads', upload.array('files'), (req, res) => {
   res.status(200).send('Arquivos enviados com sucesso!');
   console.log(`Batch: ${_batch}`);
   _batch += 1;
});

router.get('/uploads/:batch/:filename', (req, res) => {
   const batch = req.params.batch;
   const filename = req.params.filename;
   const file = path.join(__dirname, 'uploads', batch, filename);

   fs.access(file, fs.constants.F_OK, (error) => {
      if (error) {
            res.status(404).send('Arquivo não encontrado.');
      } else {
            res.download(file);
      }
   });
});

module.exports = router;
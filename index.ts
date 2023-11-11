import express from 'express';
import cors from 'cors';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { NO_MATCH, verifyUserImage } from './faceapi';
import fs from 'fs';
import path from 'path';
require('dotenv').config();

const PORT = process.env.SERVER_PORT || 4001;

const app = express();
const server = http.createServer(app);

const options = {
  limit: '3mb',
};

app.use(cors());
app.use(express.json(options));

const checkFace = async (req: any, res: any) => {
  try {
    let matchName = await verifyUserImage(req.body.image);
    let isMatch = true;

    if (matchName === NO_MATCH) {
      matchName = 'no match';
      isMatch = false;
    }

    res.status(200).send({ match: isMatch, name: matchName });
  } catch (e) {
    res.status(500).send({ match: false });
  }
};

const uploadImage = async (req: any, res: any) => {
  let name: string = req.body.name || '';
  const image = req.body.image || '';

  try {
    if (!name || name.trim().length <= 0 || !image || image.trim().length <= 0) {
      res.status(500).send(false);
      return;
    }

    let cleanedName = '';
    const fullName = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^a-z _-]/gi, '')
      .split(' ');

    fullName.forEach((item) => {
      const capitalizedItem = item[0].toUpperCase() + item.substring(1, item.length);
      cleanedName = `${cleanedName} ${capitalizedItem}`;
    });

    cleanedName = cleanedName.trim();
    const dir = `faces/${cleanedName}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(`${dir}/${uuidv4()}.jpg`, image.split(';base64,').pop(), { encoding: 'base64' }, (err: any) => {
      if (err) {
        throw new Error(err);
      }
    });
    res.status(200).send(true);
  } catch (e) {
    res.status(500).send(false);
  }
};

app.use((req, res, next) => {
  res.setTimeout(5000, function () {
    console.log('Request has timed out.');
    res.send(408);
  });

  next();
});

app.post('/api/face', (req: any, res: any) => checkFace(req, res));
app.post('/api/upload', (req: any, res: any) => uploadImage(req, res));

app.get('/photo', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.get('/index.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.js'));
});

server.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});

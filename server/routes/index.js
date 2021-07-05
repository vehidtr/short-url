import express from 'express';
import { nanoid } from 'nanoid';
import rateLimit from 'express-rate-limit';
import Urls from '../models/Urls.js';

// Initialize router
const router = express.Router();

// Initialize rate limit
const limiterCreate = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});

const limiterGet = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Create short link
router.post('/create', limiterCreate, async (req, res) => {
  const body = req.body;
  const shortId = nanoid(7).toLowerCase();
  body.shortUrl = shortId;

  const urlExists = await Urls.findOne({ url: body.url });

  if (urlExists) {
    res.json({ url: urlExists.shortUrl });
  } else {
    const newUrl = new Urls(body);
    const saveUrl = await newUrl.save();

    res.json(saveUrl);
  }
});

// Get short link
router.get('/:id', limiterGet, async (req, res, next) => {
  const id = req.params.id;

  try {
    const findUrl = await Urls.findOne({ shortUrl: id });
    res.header('Access-Control-Allow-Origin', '*');
    res.redirect(findUrl.url);
  } catch (error) {
    res.sendStatus(404).json({ msg: 'Error with post' });
  }
});

export default router;

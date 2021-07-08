import express from 'express';
import { nanoid } from 'nanoid';
import rateLimit from 'express-rate-limit';
import Urls from '../models/Urls.js';
import redis from 'redis';

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

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

// Cache middleware
const cache = (req, res, next) => {
  const { id } = req.params;
  client.get(id, (err, data) => {
    if (err) console.log(err);

    if (data !== null) {
      console.log('REDIS DATA', data);
      res.json(data);
    } else {
      next();
    }
  });
};

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
    //Set data to redis
    client.setex(shortId, 3600, JSON.stringify(saveUrl));

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

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import env from 'dotenv';
import redis from 'redis';

// Imports
import routes from './routes/index.js';
import { handleError, notFound } from './handleError.js';

// Initialize environment variables
env.config();

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('MongoDB connected successfully')
);

// Initialize express app
const app = express();

// Add favicon
app.use('/favicon.ico', express.static('./favicon.ico'));

// Create server port
const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Initialize redis

const client = redis.createClient(REDIS_PORT);

// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/', routes);

// Start server
app.listen(PORT, () =>
  console.log(`App started on http://192.168.0.13:${PORT}`)
);

// Handle errors
app.use(notFound);
app.use(handleError);

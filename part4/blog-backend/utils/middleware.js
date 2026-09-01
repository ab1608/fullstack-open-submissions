const logger = require('./logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:', req.path);
  logger.info('Body:', req.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'uknown endpoint' });
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');

  if (auth && auth.startsWith('Bearer ')) {
    req.token = auth.replace('Bearer ', '');
  }

  next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token is missing' });
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken) {
    return res.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return res.status(400).json({ error: 'user id is missing or invalid' });
  }

  req.user = user;
  next();
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return res.status(400).json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  }
  next(error);
};

module.exports = { unknownEndpoint, tokenExtractor, userExtractor, errorHandler, requestLogger };

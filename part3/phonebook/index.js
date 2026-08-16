require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Contact = require('./models/contact');

const app = express();

// Load middleware
app.use(express.static('dist'));
app.use(express.json());

// Show data sent in HTTP Post request using morgan
morgan.token('reqBody', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'));

// Configure endpoints
app.get('/', (req, res) => {
  res.send('<h1>Phonebook</h1>');
});

app.get('/api/persons', (req, res) => {
  Contact.find({}).then((contacts) => res.json(contacts));
});

/*
The 400 (Bad Request) status code indicates that the server cannot or will not process 
the request due to something that is perceived to be a client error 
(e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
*/
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/info', (req, res) => {
  Contact.countDocuments({}).then((count) => {
    req.receivedDate = new Date();
    res.send(`<div>Phonebook has info for ${count} people<\div> <div>${req.receivedDate}<\div>`);
  });
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body; // req.body contains the json data

  const person = new Contact({ name: body.name, number: body.number });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  Contact.findById(id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).end();
      }
      contact.name = body.name;
      contact.number = body.number;

      return contact.save().then((updatedContact) => {
        res.json(updatedContact);
      });
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Contact.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'uknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

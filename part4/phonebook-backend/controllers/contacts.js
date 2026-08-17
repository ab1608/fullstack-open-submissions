const contactRouter = require('express').Router();
const Contact = require('../models/contact');

contactRouter.get('/', (req, res) => {
  Contact.find({}).then((contacts) => res.json(contacts));
});

/*
The 400 (Bad Request) status code indicates that the server cannot or will not process
the request due to something that is perceived to be a client error
(e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
*/
contactRouter.get('/:id', (req, res, next) => {
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

contactRouter.post('/', (req, res, next) => {
  const body = req.body; // req.body contains the json data

  const person = new Contact({ name: body.name, number: body.number });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

contactRouter.put('/:id', (req, res, next) => {
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

contactRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Contact.findByIdAndDelete(id)
    .then((res) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

contactRouter.get('/info', (req, res) => {
  Contact.countDocuments({}).then((count) => {
    req.receivedDate = new Date();
    res.send(`<div>Phonebook has info for ${count} people<\div> <div>${req.receivedDate}<\div>`);
  });
});

module.exports = contactRouter;

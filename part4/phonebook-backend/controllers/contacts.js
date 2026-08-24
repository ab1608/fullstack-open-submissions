const contactRouter = require('express').Router();
const Contact = require('../models/contact');

contactRouter.get('/', async (req, res) => {
  const contacts = await Contact.find({});
  return res.json(contacts);
});

/*
The 400 (Bad Request) status code indicates that the server cannot or will not process
the request due to something that is perceived to be a client error
(e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
*/
contactRouter.get('/:id', async (req, res) => {
  const id = req.params.id;

  const foundContact = await Contact.findById(id);

  if (foundContact) {
    res.json(foundContact);
  } else {
    res.status(404).end();
  }
});

contactRouter.post('/', async (req, res) => {
  const body = req.body; // req.body contains the json data

  const newContact = new Contact({ name: body.name, number: body.number });

  const savedContact = await newContact.save();
  res.status(201).json(savedContact);
});

contactRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const existingContact = await Contact.findById(id);

  if (!existingContact) {
    res.status(404).end();
  } else {
    existingContact.name = body.name;
    existingContact.number = body.number;
  }

  const updatedContact = await existingContact.save();
  res.json(updatedContact);
});

contactRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await Contact.findByIdAndDelete(id);
  res.status(204).end();
});

contactRouter.get('/info', (req, res) => {
  Contact.countDocuments({}).then((count) => {
    req.receivedDate = new Date();
    res.send(`<div>Phonebook has info for ${count} people<\div> <div>${req.receivedDate}<\div>`);
  });
});

module.exports = contactRouter;

const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Contact = require('../models/contact');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Contact.deleteMany({});

  // const contactObjects = helper.initialContacts.map((c) => new Contact(c));
  // // Array of Promises created by the .save() function
  // const promises = contactObjects.map((c) => c.save(0));
  // // .all() method will fulfill each promises
  // await Promise.all(promises);

  await Contact.insertMany(helper.initialContacts);
});

test('phonebook is returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/); // regex
});

test('all contacts are returned', async () => {
  const response = await api.get('/api/persons');

  assert.strictEqual(response.body.length, helper.initialContacts.length);
});

test('a specific contact is in the phonebook', async () => {
  const response = await api.get('/api/persons');

  const contents = response.body.map((e) => e.name);
  assert.strictEqual(contents.includes('Test Contact'), true);
});

test('a valid contact can be added', async () => {
  const newContact = { name: 'Abraham', number: '201-201-2011' };

  await api
    .post('/api/persons')
    .send(newContact)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const contactsAtEnd = await helper.contactsInDb();
  assert.strictEqual(contactsAtEnd.length, helper.initialContacts.length + 1);

  const contents = contactsAtEnd.map((c) => c.name);
  assert(contents.includes('Abraham'));
});

test('contact without a number is not added', async () => {
  const newContact = {
    name: 'Abraham',
  };

  await api.post('/api/persons').send(newContact).expect(400);

  const contactsAtEnd = await helper.contactsInDb();

  assert.strictEqual(contactsAtEnd.length, helper.initialContacts.length);
});

test('a specific contact can be viewed', async () => {
  const contactsToStart = await helper.contactsInDb();
  // Get the first contact in the DB
  const contactToView = contactsToStart[0];

  // Retrive that same contact over API endpoint
  const resultContact = await api
    .get(`/api/persons/${contactToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.deepStrictEqual(resultContact.body, contactToView);
});

test('a contact can be deleted', async () => {
  const contactsToStart = await helper.contactsInDb();
  // Get the first contact in the DB
  const contactToDelete = contactsToStart[0];

  // Delete the contact over API
  await api.delete(`/api/persons/${contactToDelete.id}`).expect(204);

  // Retrieve remaining contacts
  const contactsAtEnd = await helper.contactsInDb();

  const ids = contactsAtEnd.map((c) => c.id);

  // Ensure the remaining IDs do not hold the deleted contact ID
  assert(!ids.includes(contactToDelete.id));

  // Ensure the database is one record fewer
  assert.deepStrictEqual(contactsAtEnd.length, helper.initialContacts.length - 1);
});

after(async () => {
  await mongoose.connection.close();
});

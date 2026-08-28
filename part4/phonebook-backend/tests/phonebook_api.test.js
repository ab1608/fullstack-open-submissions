const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Contact = require('../models/contact');
const User = require('../models/user');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');

const api = supertest(app);

beforeEach(async () => {
  await Contact.deleteMany({});
  await Contact.insertMany(helper.initialContacts);

  // const contactObjects = helper.initialContacts.map((c) => new Contact(c));
  // // Array of Promises created by the .save() function
  // const promises = contactObjects.map((c) => c.save(0));
  // // .all() method will fulfill each promises
  // await Promise.all(promises);
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

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
});

after(async () => {
  await mongoose.connection.close();
});

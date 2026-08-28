const { test, describe, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const userHelper = require('../utils/user_helper');

const api = supertest(app);

const initialUser = [
  {
    username: 'root',
    name: 'Rooter',
    password: 'super',
  },
];

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const initialUserValues = initialUser[0];

    const passwordHash = await bcrypt.hash(initialUserValues.password, 10);
    const user = new User({
      username: initialUserValues.username,
      name: initialUserValues.name,
      passwordHash,
    });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await userHelper.usersInDb();

    const newUser = {
      username: 'abriones',
      name: 'Abraham Briones',
      password: 'mypassword',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await userHelper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('a short password is denied', async () => {
    const testUser = { username: 'myTestUser', name: 'Test User', password: '1' };

    await api.post('/api/users').send(testUser).expect(401);
    const currentUsers = await userHelper.usersInDb();

    assert.strictEqual(currentUsers.length, initialUser.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});

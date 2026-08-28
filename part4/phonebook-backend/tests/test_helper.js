const Contact = require('../models/contact');
const User = require('../models/user');

const initialContacts = [
  {
    name: 'Test Contact',
    number: '777-777-7777',
  },
];

const nonExistingId = async () => {
  const newContact = new Contact({ name: 'willremovethissoon' });
  await newContact.save();
  await newContact.deleteOne();

  return newContact._id.toString();
};

const contactsInDb = async () => {
  const allContacts = await Contact.find({});
  return allContacts.map((c) => c.toJSON());
};

const usersInDb = async () => {
  const allUsers = await User.find({});
  return allUsers.map((u) => u.toJSON());
};

module.exports = {
  initialContacts,
  nonExistingId,
  contactsInDb,
  usersInDb,
};

const mongoose = require('mongoose');

// Access command line arguments:
// node mongo.js db_username db_password
// const db_username = process.argv[2];
// const db_password = process.argv[3];
// const url = `mongodb+srv://${db_username}:${db_password}@cluster0.np2xazf.mongodb.net/?appName=Cluster0`;

const db_password = process.argv[2];
const url = `mongodb+srv://fullstack:${db_password}@cluster0.np2xazf.mongodb.net/?appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url, { family: 4 });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model('Contact', contactSchema);

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
} else if (process.argv.length === 3) {
  // Since the parameter is an empty object{},
  // we get all of the data stored in the Contact collection.
  Contact.find({}).then((r) => {
    r.forEach((contact) => {
      console.log(contact);
    });
    mongoose.connection.close();
  });
} else {
  const initialContact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

  initialContact.save().then((result) => {
    console.log('new contact saved!');
    mongoose.connection.close();
  });
}

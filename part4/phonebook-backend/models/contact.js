const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => /\d{3}-\d{3}-\d{4}/.test(v),
      messsage: (props) => `${props.value} is not a valid phone number`,
    },
    required: true,
    minLength: 10,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // do not reveal passwordHash
    delete returnedObject.passwordHash;
  },
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;

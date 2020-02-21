const mongoose = require("mongoose");

const ContactsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: true,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const Contacts = (module.exports = mongoose.model(
  "Contacts",
  ContactsSchema
));

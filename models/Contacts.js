const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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

ContactsSchema.plugin(uniqueValidator);

const Contacts = (module.exports = mongoose.model(
  "Contacts",
  ContactsSchema
));

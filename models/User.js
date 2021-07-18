const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  account: {
    username: {
      required: true,
      type: String,
    },
    vegeType: {
      required: true,
      type: String,
    },
    location: {
      required: true,
      type: String,
    },
    yearBirth: {
      required: true,
      type: Array,
    },
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;

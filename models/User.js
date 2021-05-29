const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  account: {
    username: {
      require: true,
      type: String,
    },
  },
  token: String,
  hash: String,
  salt: String,
});

//export du model
module.exports = User;

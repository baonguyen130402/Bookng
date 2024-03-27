const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("users", UserSchema);

module.exports = User;

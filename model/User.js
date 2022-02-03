const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const mySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: "the email is already in use",
    },
    password: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    otp_token: {
      type: String,
    },
    portfolio: {
      type: String,
      default: null,
    },
  },
  {timestamps: true}
);
mySchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", mySchema);

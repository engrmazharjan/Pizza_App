const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "customer" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

// The above two lines can also be like below
// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
    name: {
      type: "string",
      required: true,
    },
    status: {
      type: "string",
      default: "I am here",
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

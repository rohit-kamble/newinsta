const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  followers: [
    {type: ObjectId, ref: "User"}
  ],
  pic: {
    type:"string",
    default: "https://res.cloudinary.com/dabbudx0x/image/upload/v1605617946/1_7tlP1ph61ompULJdycVJlQ_vhmxtu.png"
  },
  following: [
    {type: ObjectId, ref: "User"}
  ]
})

mongoose.model("User", userSchema)
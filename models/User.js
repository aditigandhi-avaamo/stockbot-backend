const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  watchlist: {
  type: [
    {
      symbol: String,
      companyName: String
    }
  ],
  default: []
}

});

module.exports = mongoose.model("User", userSchema);

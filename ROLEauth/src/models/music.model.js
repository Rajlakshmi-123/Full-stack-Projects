
const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
      uri : {
      type: String,
      required: true,
      trim: true
    },


    title: {
      type: String,
      
      trim: true
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Music = mongoose.model("music", musicSchema);

module.exports = Music;

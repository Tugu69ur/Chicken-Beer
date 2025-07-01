import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: [Number], // [latitude, longitude]
    required: true,
    validate: {
      validator: (arr) => arr.length === 2,
      message: "Position must contain [latitude, longitude]",
    },
  },
  img: {
    type: String, // You can change to URL if you're storing image links
    default: "",
  },
});

const Place = mongoose.model("Place", placeSchema);

export default Place;

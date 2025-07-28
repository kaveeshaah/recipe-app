const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    ingredients: [String],
    instructions: String,
    image: String, // Store image URL or path
    category: [String], // breakfast, dinner, culture, healthy etc.
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Recipe", recipeSchema);

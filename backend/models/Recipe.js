const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    ingredients: [String],
    instructions: String,
    image: String,
    occasion: [String], // Christmas, Thanksgiving, New Year
    mealTime: [String], // Breakfast, Lunch, Dinner
    culture: [String], // Sri Lankan, Indian, European, Korean
    type: [String], // Vegetarian, Meats
    quickFilters: {
      quick: { type: Boolean, default: false },
      healthy: { type: Boolean, default: false },
      simple: { type: Boolean, default: false }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Recipe", recipeSchema);

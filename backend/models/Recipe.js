const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    ingredients: [String],
    instructions: [String], // Changed to array for step-by-step instructions
    image: String,
    cookingTime: {
      prep: { type: Number, default: 0 }, // in minutes
      cook: { type: Number, default: 0 }, // in minutes
      total: { type: Number, default: 0 } // in minutes
    },
    servings: { type: Number, default: 4 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 }
    },
    tags: [String], // Popular, Featured, etc.
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

const User = require("../models/User");
const Recipe = require("../models/Recipe");

// Get all saved recipes for a user
const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedRecipes');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.savedRecipes);
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Save a recipe
const saveRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Find user and check if recipe is already saved
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ message: "Recipe already saved" });
    }

    // Add recipe to saved recipes
    user.savedRecipes.push(recipeId);
    await user.save();

    res.status(200).json({ message: "Recipe saved successfully" });
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove a saved recipe
const removeSavedRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove recipe from saved recipes
    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
    await user.save();

    res.status(200).json({ message: "Recipe removed from saved recipes" });
  } catch (error) {
    console.error("Error removing saved recipe:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check if a recipe is saved by the user
const checkIfSaved = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSaved = user.savedRecipes.includes(recipeId);
    res.status(200).json({ isSaved });
  } catch (error) {
    console.error("Error checking saved status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getSavedRecipes,
  saveRecipe,
  removeSavedRecipe,
  checkIfSaved
};

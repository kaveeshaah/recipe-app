const Recipe = require("../models/Recipe");

// GET all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// GET one recipe
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.json(recipe);
  } catch (err) {
    res.status(404).json({ message: "Recipe not found" });
  }
};

// POST create new recipe
const createRecipe = async (req, res) => {
  const { title, description, ingredients, instructions, image, category } = req.body;

  try {
    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      image,
      category,
    });

    const saved = await newRecipe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Could not create recipe" });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
};

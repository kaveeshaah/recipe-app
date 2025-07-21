const express = require("express");
const { getRecipes, getRecipeById, createRecipe } = require("../controllers/recipeController");

const router = express.Router();

// Public Routes
router.get("/", getRecipes);
router.get("/:id", getRecipeById);

// Protected (add auth later)
router.post("/", createRecipe);

module.exports = router;

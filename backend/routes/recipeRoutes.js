const express = require("express");
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");

const router = express.Router();

router.route("/")
  .post(createRecipe)     // POST /api/recipes
  .get(getAllRecipes);    // GET /api/recipes

router.route("/:id")
  .get(getRecipeById)     // GET /api/recipes/:id
  .put(updateRecipe)      // PUT /api/recipes/:id
  .delete(deleteRecipe);  // DELETE /api/recipes/:id

module.exports = router;

const express = require("express");
const {
  getSavedRecipes,
  saveRecipe,
  removeSavedRecipe,
  checkIfSaved
} = require("../controllers/savedRecipesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", getSavedRecipes);                    // GET /api/saved-recipes
router.post("/", saveRecipe);                       // POST /api/saved-recipes
router.delete("/:recipeId", removeSavedRecipe);     // DELETE /api/saved-recipes/:recipeId
router.get("/check/:recipeId", checkIfSaved);       // GET /api/saved-recipes/check/:recipeId

module.exports = router;

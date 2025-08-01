const Recipe = require("../models/Recipe");

// @desc Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all recipes with filters
exports.getAllRecipes = async (req, res) => {
  try {
    const {
      search,
      occasion,
      mealTime,
      culture,
      type,
      ingredient,
      quickFilter
    } = req.query;

    // Build filter query
    const query = {};

    // Initialize conditions array for $and
    const conditions = [];

    // Text search
    if (search) {
      // Split search into words and create a regex pattern
      const searchWords = search.trim().split(/\s+/);
      const searchConditions = searchWords.map(word => ({
        $or: [
          { title: { $regex: word, $options: 'i' } },
          { description: { $regex: word, $options: 'i' } },
          { ingredients: { $elemMatch: { $regex: word, $options: 'i' } } }
        ]
      }));

      // If there are search words, add them to conditions
      if (searchWords.length > 0) {
        // If multiple words, match any of them
        conditions.push({ $or: searchConditions });
      }
    }

    // Array filters (multiple values possible)
    if (occasion) {
      const occasionValues = Array.isArray(occasion) ? occasion : [occasion];
      if (occasionValues.length > 0) {
        conditions.push({ occasion: { $in: occasionValues } });
      }
    }

    if (mealTime) {
      const mealTimeValues = Array.isArray(mealTime) ? mealTime : [mealTime];
      if (mealTimeValues.length > 0) {
        conditions.push({ mealTime: { $in: mealTimeValues } });
      }
    }

    if (culture) {
      const cultureValues = Array.isArray(culture) ? culture : [culture];
      if (cultureValues.length > 0) {
        conditions.push({ culture: { $in: cultureValues } });
      }
    }

    if (type) {
      const typeValues = Array.isArray(type) ? type : [type];
      if (typeValues.length > 0) {
        conditions.push({ type: { $in: typeValues } });
      }
    }

    // Ingredient search
    if (ingredient) {
      conditions.push({ ingredients: { $regex: ingredient, $options: 'i' } });
    }

    // Apply conditions to query
    if (conditions.length > 0) {
      query.$and = conditions;
    }

    // Quick filters
    if (quickFilter) {
      const filters = Array.isArray(quickFilter) ? quickFilter : [quickFilter];
      filters.forEach(filter => {
        query[`quickFilters.${filter}`] = true;
      });
    }

    console.log('Search Query:', query);
    const recipes = await Recipe.find(query);
    console.log('Found Recipes:', recipes.length);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get a single recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Not found" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update recipe
exports.updateRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

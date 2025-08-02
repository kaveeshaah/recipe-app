const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const recipeRoutes = require("./routes/recipeRoutes");
const authRoutes = require("./routes/auth");      // Add auth routes here
const savedRecipesRoutes = require("./routes/savedRecipes"); // Add saved recipes routes
const authMiddleware = require("./middleware/authMiddleware");  // Auth middleware

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Public routes
app.use("/api/auth", authRoutes);        // Register & login routes
app.use("/api/recipes", recipeRoutes);   // Your existing recipe routes

// Protected routes
app.use("/api/saved-recipes", savedRecipesRoutes); // Saved recipes routes

// Example protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is protected data.` });
});

app.get("/", (req, res) => {
  res.send("API is working 🟢");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

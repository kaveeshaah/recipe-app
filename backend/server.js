const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');
const recipeRoutes = require("./routes/recipeRoutes");

// ✅ Load environment variables first!
dotenv.config();

// ✅ Then connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/recipes", recipeRoutes);

app.get("/", (req, res) => {
  res.send("API is working 🟢");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
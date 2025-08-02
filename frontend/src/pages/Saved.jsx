import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark } from "react-icons/fa"; // import bookmark icon
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Saved.css";

const Saved = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // success notification
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = () => {
    // Get token from user object in localStorage
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) {
      setError("Please login to view your saved recipes");
      setLoading(false);
      return;
    }

    fetch("/api/saved-recipes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "Failed to fetch saved recipes.");
          });
        }
        return res.json();
      })
      .then((data) => {
        setSavedRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleRemoveFromSaved = async (recipeId) => {
    // Get token from user object in localStorage
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) {
      alert("Please login to manage saved recipes");
      return;
    }

    // Find the recipe name before removing it
    const recipeToRemove = savedRecipes.find(
      (recipe) => recipe._id === recipeId
    );
    const recipeName = recipeToRemove?.strMeal || "Recipe";

    try {
      const response = await fetch(`/api/saved-recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove recipe from local state
        setSavedRecipes((prev) =>
          prev.filter((recipe) => recipe._id !== recipeId)
        );
        // Show success message
        setSuccessMessage(`✅ '${recipeName}' removed successfully!`);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error("Failed to remove recipe");
      }
    } catch (err) {
      alert("Error removing recipe. Please try again.");
    }
  };

  const filteredRecipes = savedRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="saved-page">
      <Navbar />

      {/* Hero Section */}
      <div className="saved-hero">
        <div className="hero-content">
          <h1 className="saved-title">Your Saved Recipes</h1>
          <p className="saved-subtitle">
            Discover and enjoy your favorite recipes
          </p>

          <div className="hero-search">
            <div className="hero-search-container">
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search your saved recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    // Handle search on Enter key
                  }
                }}
              />
              <button className="hero-search-btn">Search</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="my-recipes-container">
        {/* Use same class as Recipes page */}
        {loading && <div className="loader"></div>}

        {error && <p className="status-msg error">{error}</p>}

        {!loading && !error && filteredRecipes.length === 0 && (
          <p className="status-msg">
            {searchTerm
              ? "No recipes found matching your search."
              : "You haven't saved any recipes yet."}
          </p>
        )}

        {!loading && !error && filteredRecipes.length > 0 && (
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => (
              <div className="recipe-card" key={recipe._id}>
                <div className="recipe-img-container">
                  <img
                    className="recipe-img"
                    src={recipe.image || "/images/pancakes.jpg"}
                    alt={recipe.title}
                  />
                  <button
                    className="bookmark-btn"
                    onClick={() => handleRemoveFromSaved(recipe._id)}
                    aria-label="Remove from saved"
                    type="button"
                  >
                    <FaBookmark className="bookmark-icon saved" />
                  </button>
                </div>
                <div className="recipe-info">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  <p className="recipe-category">
                    {Array.isArray(recipe.category)
                      ? recipe.category.join(" > ")
                      : recipe.category}
                  </p>
                  <button
                    className="recipe-btn"
                    onClick={() => navigate(`/recipes/${recipe._id}`)}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Dots */}
      {!loading && !error && filteredRecipes.length > 0 && (
        <div className="pagination-dots">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}

      {/* Success Toast Notification */}
      {successMessage && <div className="success-toast">{successMessage}</div>}

      <Footer />
    </div>
  );
};

export default Saved;

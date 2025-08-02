import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa"; // import icons
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Recipes.css";
import Filter from "../components/Filter";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([]); // track saved recipe IDs
  const [savingRecipes, setSavingRecipes] = useState(new Set()); // track recipes being saved
  const [successMessage, setSuccessMessage] = useState(""); // success notification
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
    fetchSavedRecipes();
  }, []);

  const fetchRecipes = () => {
    fetch("/api/recipes")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch recipes.");
        }
        return res.json();
      })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchSavedRecipes = () => {
    // Get token from user object in localStorage
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) return; // User not logged in

    fetch("/api/saved-recipes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return []; // If error, return empty array
      })
      .then((data) => {
        const savedIds = data.map((recipe) => recipe._id);
        setSavedRecipes(savedIds);
      })
      .catch((err) => {
        console.error("Error fetching saved recipes:", err);
      });
  };

  const toggleSave = async (recipeId) => {
    // Get token from user object in localStorage
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) {
      alert("Please login to save recipes");
      return;
    }

    // Prevent multiple saves
    if (savingRecipes.has(recipeId)) return;

    setSavingRecipes((prev) => new Set(prev).add(recipeId));

    try {
      const isSaved = savedRecipes.includes(recipeId);

      if (isSaved) {
        // Remove from saved
        const response = await fetch(`/api/saved-recipes/${recipeId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setSavedRecipes((prev) => prev.filter((id) => id !== recipeId));
        } else if (response.status === 401) {
          alert("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          throw new Error("Failed to remove recipe");
        }
      } else {
        // Save recipe
        console.log("Attempting to save recipe:", recipeId); // Debug log
        console.log("Token being used:", token ? "Token exists" : "No token"); // Debug log

        const response = await fetch("/api/saved-recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipeId }),
        });

        console.log("Save response status:", response.status); // Debug log

        if (response.ok) {
          setSavedRecipes((prev) => [...prev, recipeId]);

          // Find the recipe name for the success message
          const savedRecipe = recipes.find((recipe) => recipe._id === recipeId);
          const recipeName = savedRecipe ? savedRecipe.title : "Recipe";

          // Show success message
          setSuccessMessage(`✅ "${recipeName}" saved successfully!`);

          // Hide message after 3 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        } else if (response.status === 401) {
          alert("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          const data = await response.json();
          console.log("Save error response:", data); // Debug log
          throw new Error(data.message || "Failed to save recipe");
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error);

      if (error.message === "Invalid token") {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert("Error saving recipe. Please try again.");
      }
    } finally {
      setSavingRecipes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recipeId);
        return newSet;
      });
    }
  };
  return (
    <div className="my-recipes-page">
      {/* Success Notification */}
      {successMessage && <div className="success-toast">{successMessage}</div>}

      <Filter setRecipes={setRecipes} />
      <Navbar />
      <div className="my-recipes-container">
        {loading && <div className="loader"></div>}

        {error && <p className="status-msg error">{error}</p>}

        {!loading && !error && recipes.length === 0 && (
          <p className="status-msg">You haven’t added any recipes yet.</p>
        )}

        {!loading && !error && recipes.length > 0 && (
          <div className="recipe-grid">
            {recipes.map((recipe) => {
              const isSaved = savedRecipes.includes(recipe._id);
              return (
                <div className="recipe-card" key={recipe._id}>
                  <div className="recipe-img-container">
                    <img
                      className="recipe-img"
                      src={recipe.image}
                      alt={recipe.title}
                    />
                    <button
                      className="bookmark-btn"
                      onClick={() => toggleSave(recipe._id)}
                      aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
                      type="button"
                      disabled={savingRecipes.has(recipe._id)}
                    >
                      {savingRecipes.has(recipe._id) ? (
                        <div className="saving-spinner">⏳</div>
                      ) : isSaved ? (
                        <FaBookmark className="bookmark-icon saved" />
                      ) : (
                        <FaRegBookmark className="bookmark-icon" />
                      )}
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
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Recipes;

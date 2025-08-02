import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaBookmark,
  FaRegBookmark,
  FaClock,
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa";
import Footer from "../components/Footer";
import "../css/ViewRecipe.css";

const ViewRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await fetchRecipe();
      await checkIfSaved();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${id}`);
      if (!response.ok) {
        throw new Error("Recipe not found");
      }
      const data = await response.json();
      setRecipe(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) return;

    try {
      const response = await fetch("/api/saved-recipes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const savedRecipes = await response.json();
        const isRecipeSaved = savedRecipes.some(
          (savedRecipe) => savedRecipe._id === id
        );
        setIsSaved(isRecipeSaved);
      }
    } catch (err) {
      console.error("Error checking saved status:", err);
    }
  };

  const toggleSave = async () => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) {
      alert("Please login to save recipes");
      return;
    }

    setSaving(true);

    try {
      if (isSaved) {
        const response = await fetch(`/api/saved-recipes/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setIsSaved(false);
          setSuccessMessage(
            `✅ "${recipe?.title || "Recipe"}" removed from saved!`
          );

          // Hide message after 3 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        }
      } else {
        const response = await fetch("/api/saved-recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipeId: id }),
        });
        if (response.ok) {
          setIsSaved(true);
          setSuccessMessage(
            `✅ "${recipe?.title || "Recipe"}" saved successfully!`
          );

          // Hide message after 3 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        }
      }
    } catch (err) {
      console.error("Error toggling save:", err);
      alert("Error saving recipe. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="view-recipe-container">
        <div className="loader">Loading recipe...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-recipe-container">
        <div className="error-message">
          <h2>Recipe Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/recipes")} className="back-btn">
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="view-recipe-container">
      {/* Success Notification */}
      {successMessage && <div className="success-toast">{successMessage}</div>}

      {/* Header with back button and save */}
      <div className="recipe-header">
        <button onClick={() => navigate("/recipes")} className="back-button">
          <FaArrowLeft /> Back to Recipes
        </button>
        <button
          onClick={toggleSave}
          className={`save-button ${isSaved ? "saved" : ""}`}
          disabled={saving}
        >
          {saving ? (
            <span>⏳</span>
          ) : isSaved ? (
            <FaBookmark />
          ) : (
            <FaRegBookmark />
          )}
          {isSaved ? "Saved" : "Save Recipe"}
        </button>
      </div>

      {/* Recipe Banner */}
      <div className="recipe-banner">
        <div className="recipe-image-section">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="recipe-main-image"
          />
        </div>
        <div className="recipe-info-section">
          <div className="recipe-meta">
            <span className="recipe-category">
              {recipe.mealTime?.[0] || "Main"} •{" "}
              {recipe.culture?.[0] || "International"}
            </span>
            {recipe.tags?.includes("Popular") && (
              <span className="popular-tag">🔥 Popular</span>
            )}
          </div>
          <h1 className="recipe-main-title">{recipe.title}</h1>
          <p className="recipe-description">{recipe.description}</p>

          <div className="recipe-stats">
            <div className="stat-item">
              <FaClock className="stat-icon" />
              <div>
                <span className="stat-label">Total Time</span>
                <span className="stat-value">
                  {recipe.cookingTime?.total || 30} mins
                </span>
              </div>
            </div>
            <div className="stat-item">
              <FaUsers className="stat-icon" />
              <div>
                <span className="stat-label">Servings</span>
                <span className="stat-value">{recipe.servings || 4}</span>
              </div>
            </div>
            <div className="stat-item">
              <span
                className={`difficulty-badge difficulty-${
                  recipe.difficulty?.toLowerCase() || "medium"
                }`}
              >
                {recipe.difficulty || "Medium"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="recipe-content">
        {/* Left Column - Ingredients */}
        <div className="ingredients-section">
          <div className="section-header">
            <span className="section-number">1</span>
            <h2>What You'll Need...</h2>
          </div>

          <div className="ingredients-list">
            {recipe.ingredients?.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                <span className="ingredient-bullet">◆</span>
                <span className="ingredient-text">{ingredient}</span>
              </div>
            ))}
          </div>

          {/* Nutrition Info */}
          {recipe.nutrition && (
            <div className="nutrition-section">
              <h3>Nutrition (per serving)</h3>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-label">Calories</span>
                  <span className="nutrition-value">
                    {recipe.nutrition.calories || 0}
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Protein</span>
                  <span className="nutrition-value">
                    {recipe.nutrition.protein || 0}g
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Carbs</span>
                  <span className="nutrition-value">
                    {recipe.nutrition.carbs || 0}g
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Fat</span>
                  <span className="nutrition-value">
                    {recipe.nutrition.fat || 0}g
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Instructions */}
        <div className="instructions-section">
          <div className="section-header">
            <span className="section-number">2</span>
            <h2>How To Cook</h2>
          </div>

          <div className="cooking-steps">
            {recipe.instructions && Array.isArray(recipe.instructions) ? (
              recipe.instructions
                .map((instructionString, arrayIndex) => {
                  // If the instruction string contains numbered steps, split them
                  if (/\d+\./.test(instructionString)) {
                    return instructionString
                      .split(/(?=\d+\.)/)
                      .filter((step) => step.trim())
                      .map((step, stepIndex) => {
                        const cleanStep = step.replace(/^\d+\.\s*/, "").trim();
                        if (!cleanStep) return null;
                        return (
                          <div
                            key={`${arrayIndex}-${stepIndex}`}
                            className="cooking-step"
                          >
                            <div className="step-number">{stepIndex + 1}</div>
                            <div className="step-content">
                              <div className="step-text">{cleanStep}</div>
                            </div>
                          </div>
                        );
                      })
                      .filter(Boolean);
                  } else {
                    // Single step without numbers
                    return (
                      <div key={arrayIndex} className="cooking-step">
                        <div className="step-number">{arrayIndex + 1}</div>
                        <div className="step-content">
                          <div className="step-text">{instructionString}</div>
                        </div>
                      </div>
                    );
                  }
                })
                .flat()
            ) : recipe.instructions ? (
              // If instructions is a string, split by numbered steps
              recipe.instructions
                .split(/(?=\d+\.)/)
                .filter((step) => step.trim())
                .map((step, index) => {
                  const cleanStep = step.replace(/^\d+\.\s*/, "").trim();
                  if (!cleanStep) return null;
                  return (
                    <div key={index} className="cooking-step">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">
                        <div className="step-text">{cleanStep}</div>
                      </div>
                    </div>
                  );
                })
                .filter(Boolean)
            ) : (
              <p>No instructions available</p>
            )}
          </div>

          {/* Important Note */}
          <div className="important-note">
            <div className="note-icon">📌</div>
            <div className="note-content">
              <h4>Important: Let The Recipe Rest</h4>
              <p>
                Once removed from the oven, let the dish sit/rest for at least
                15 minutes (up to 65 if minutes is fine, it will retain the heat
                well). This will allow it to thicken up a bit and help it keep
                its shape when cut. Resting is not required when reheating.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ViewRecipe;

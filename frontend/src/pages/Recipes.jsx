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
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/recipes") // Change to "/api/recipes/mine" if user-specific route
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
  }, []);

  const toggleSave = (id) => {
    setSavedRecipes((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  return (
    <div className="my-recipes-page">
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
                    >
                      {isSaved ? (
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

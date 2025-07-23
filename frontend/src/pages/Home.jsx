import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerImg from "../images/home_banner.jpg";
import "../css/Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const recipesPerPage = 4;

  const handleScroll = (e) => {
    const container = e.target;
    const scrollPosition = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const newIndex = Math.round(scrollPosition / itemWidth);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    fetch("/api/recipes?sort=-createdAt&limit=8")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch(() => setRecipes([]));
  }, []);

  return (
    <div className="home-page">
      <Navbar />
      {/* Banner Section */}
      <div className="home-banner">
        <div className="home-banner-quote">
          “DISCOVER
          <br />
          YOUR NEXT
          <br />
          FAVORITE
          <br />
          DISH”
        </div>
        <div className="home-banner-img-wrapper">
          <img className="home-banner-img" src={bannerImg} alt="Banner" />
          <button className="see-all-btn" onClick={() => navigate("/recipes")}>
            See All Recipes
          </button>
        </div>
      </div>

      {/* Popular Recipes Section */}
      <div className="popular-section">
        <h2 className="popular-title">OUR POPULAR RECIPES</h2>
        <div className="popular-recipes" onScroll={handleScroll}>
          {recipes.slice(0, 8).map((recipe) => (
            <div className="recipe-card" key={recipe._id}>
              <div className="recipe-img-container">
                <img
                  className="recipe-img"
                  src={recipe.image}
                  alt={recipe.title}
                />
                <button className="bookmark-btn">
                  <span className="bookmark-icon">★</span>
                </button>
              </div>
              <div className="recipe-info">
                <h3 className="recipe-title">{recipe.title}</h3>
                <div className="recipe-meta">
                  <div className="meta-item">
                    <span className="meta-label">Prep Time:</span> 10 min
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Cook Time:</span> 20 min
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Serves:</span> 4
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Difficulty:</span> Easy
                  </div>
                </div>
                <button
                  className="recipe-btn"
                  onClick={() => navigate(`/recipes/${recipe._id}`)}
                >
                  RECIPE
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="carousel-dots">
          {Array.from({
            length: Math.ceil(Math.min(recipes.length, 8) / recipesPerPage),
          }).map((_, index) => (
            <span
              key={index}
              className={`dot ${activeIndex === index ? "active" : ""}`}
            ></span>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

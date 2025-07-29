import React, { useState, useEffect } from "react";
import "../css/Filter.css";

const Filter = ({ setRecipes }) => {
  const [search, setSearch] = useState("");
  const [occasion, setOccasion] = useState([]);
  const [mealTime, setMealTime] = useState([]);
  const [culture, setCulture] = useState([]);
  const [type, setType] = useState([]);
  const [ingredient, setIngredient] = useState("");

  const handleCheckboxChange = (value, setter, state) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      const queryParams = new URLSearchParams();

      if (search) queryParams.append("search", search);
      occasion.forEach((o) => queryParams.append("occasion", o));
      mealTime.forEach((m) => queryParams.append("mealTime", m));
      culture.forEach((c) => queryParams.append("culture", c));
      type.forEach((t) => queryParams.append("type", t));
      if (ingredient) queryParams.append("ingredient", ingredient);

      console.log("Fetching recipes with filters:", queryParams.toString());

      try {
        const res = await fetch(`/api/recipes?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch recipes.");
        const data = await res.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching filtered recipes:", error);
        setRecipes([]);
      }
    };

    fetchFilteredRecipes();
  }, [search, occasion, mealTime, culture, type, ingredient, setRecipes]);

  return (
    <div className="filter-container">
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filter-section">
        <h4>Occasion</h4>
        {["Birthday", "Wedding", "Party", "Casual"].map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={occasion.includes(item)}
              onChange={() => handleCheckboxChange(item, setOccasion, occasion)}
            />
            {item}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4>Meal Time</h4>
        {["Breakfast", "Lunch", "Dinner", "Snack"].map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={mealTime.includes(item)}
              onChange={() => handleCheckboxChange(item, setMealTime, mealTime)}
            />
            {item}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4>Culture</h4>
        {["Sri Lankan", "Indian", "European", "Korean"].map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={culture.includes(item)}
              onChange={() => handleCheckboxChange(item, setCulture, culture)}
            />
            {item}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4>Type</h4>
        {["Healthy", "Vegan", "Dessert", "Fast Food"].map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={type.includes(item)}
              onChange={() => handleCheckboxChange(item, setType, type)}
            />
            {item}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4>Main Ingredient</h4>
        <input
          type="text"
          placeholder="e.g., Chicken"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Filter;

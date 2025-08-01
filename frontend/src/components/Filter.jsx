import React, { useState, useEffect } from "react";
import "../css/Filter.css";

const Filter = ({ setRecipes }) => {
  const [search, setSearch] = useState("");
  const [occasion, setOccasion] = useState([]);
  const [mealTime, setMealTime] = useState([]);
  const [culture, setCulture] = useState([]);
  const [type, setType] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [quickFilters, setQuickFilters] = useState({
    quick: false,
    healthy: false,
    simple: false,
  });
  const [shouldFetch, setShouldFetch] = useState(false);

  const handleCheckboxChange = (value, setter, state) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  const handleQuickFilterChange = (filter) => {
    setQuickFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleSearch = () => {
    if (search.trim()) {
      setShouldFetch(true);
    }
  };

  // Debounce function to avoid too many API calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Debounced search function that triggers after user stops typing
  const debouncedSearch = debounce(() => {
    if (search.trim()) {
      setShouldFetch(true);
    }
  }, 500); // Wait 500ms after user stops typing

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim()) {
      debouncedSearch();
    }
  };

  const handleApplyFilters = () => {
    setShouldFetch(true);
  };

  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      if (!shouldFetch) return;

      const queryParams = new URLSearchParams();

      if (search) queryParams.append("search", search);
      occasion.forEach((o) => queryParams.append("occasion", o));
      mealTime.forEach((m) => queryParams.append("mealTime", m));
      culture.forEach((c) => queryParams.append("culture", c));
      type.forEach((t) => queryParams.append("type", t));
      if (ingredient) queryParams.append("ingredient", ingredient);

      // Add quick filters
      Object.entries(quickFilters).forEach(([key, value]) => {
        if (value) queryParams.append("quickFilter", key);
      });

      console.log("Fetching recipes with filters:", queryParams.toString());

      try {
        const res = await fetch(`/api/recipes?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch recipes.");
        const data = await res.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching filtered recipes:", error);
        setRecipes([]);
      } finally {
        setShouldFetch(false);
      }
    };

    fetchFilteredRecipes();
  }, [
    shouldFetch,
    search,
    occasion,
    mealTime,
    culture,
    type,
    ingredient,
    quickFilters,
    setRecipes,
  ]);

  return (
    <div className="filter-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={handleSearchChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button className="search-button" onClick={handleSearch}>
          SEARCH NOW
        </button>
      </div>
      <div className="quick-filters">
        <label>
          <input
            type="checkbox"
            checked={quickFilters.quick}
            onChange={() => handleQuickFilterChange("quick")}
          />
          Quick
        </label>
        <label>
          <input
            type="checkbox"
            checked={quickFilters.healthy}
            onChange={() => handleQuickFilterChange("healthy")}
          />
          Healthy
        </label>
        <label>
          <input
            type="checkbox"
            checked={quickFilters.simple}
            onChange={() => handleQuickFilterChange("simple")}
          />
          Simple
        </label>
      </div>

      <div className="filter-section">
        <div className="filter-row">
          <span className="filter-label">Occasion:</span>
          {["Christmas", "Thanksgiving", "New Year"].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={occasion.includes(item)}
                onChange={() =>
                  handleCheckboxChange(item, setOccasion, occasion)
                }
              />
              {item}
            </label>
          ))}
        </div>

        <div className="filter-row">
          <span className="filter-label">Meal Time:</span>
          {["Breakfast", "Lunch", "Dinner"].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={mealTime.includes(item)}
                onChange={() =>
                  handleCheckboxChange(item, setMealTime, mealTime)
                }
              />
              {item}
            </label>
          ))}
        </div>

        <div className="filter-row">
          <span className="filter-label">Cultures:</span>
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

        <div className="filter-row">
          <span className="filter-label">Type:</span>
          {["Vegetarian", "Meats"].map((item) => (
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

        <div className="filter-row">
          <span className="filter-label">Ingredients:</span>
          <select
            className="ingredient-select"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
          >
            <option value="">select ingredient</option>
            <option value="chicken">Chicken</option>
            <option value="beef">Beef</option>
            <option value="fish">Fish</option>
            <option value="vegetables">Vegetables</option>
          </select>
        </div>
      </div>

      <button className="apply-filters" onClick={handleApplyFilters}>
        APPLY FILTERS
      </button>
    </div>
  );
};

export default Filter;

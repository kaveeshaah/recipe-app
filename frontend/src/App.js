import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';  
import Recipes from './pages/Recipes';
import Saved from './pages/Saved';
import ViewRecipe from './pages/ViewRecipe';
import Navbar from './components/Navbar';

// Wrapper component to handle navbar visibility
const AppContent = ({ user, setUser }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar user={user} setUser={setUser} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/about" element={<About />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<ViewRecipe />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </>
  );
};

const App = () => {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Update localStorage when user state changes
  const handleSetUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };
  
  return (
    <Router>
      <AppContent user={user} setUser={handleSetUser} />
    </Router>
  );
};

export default App;

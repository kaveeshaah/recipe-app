import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import About from './pages/About';  
import Recipes from './pages/Recipes';
import Saved from './pages/Saved';
import ViewRecipe from './pages/ViewRecipe';
import Navbar from './components/Navbar';

// Wrapper component to handle navbar visibility
const AppContent = ({ user, setUser, justLoggedIn, setJustLoggedIn }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname) && !location.pathname.startsWith('/reset-password');

  return (
    <>
      {showNavbar && <Navbar user={user} setUser={setUser} />}
      <Routes>
        <Route path="/" element={<Home justLoggedIn={justLoggedIn} setJustLoggedIn={setJustLoggedIn} />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
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
  
  // Track if user just logged in (for welcome message)
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  
  // Update localStorage when user state changes
  const handleSetUser = (userData, isLogin = false) => {
    setUser(userData);
    setJustLoggedIn(isLogin); // Set to true only when logging in
    
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
      setJustLoggedIn(false);
    }
  };
  
  return (
    <Router>
      <AppContent 
        user={user} 
        setUser={handleSetUser} 
        justLoggedIn={justLoggedIn}
        setJustLoggedIn={setJustLoggedIn}
      />
    </Router>
  );
};

export default App;

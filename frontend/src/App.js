import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import About from './pages/About';  
import Recipes from './pages/Recipes';
import Saved from './pages/Saved'; // Assuming you have a Saved page 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/saved" element={<Saved />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;

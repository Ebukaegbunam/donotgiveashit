// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NamePage from './components/NamePage';
import RatingPage from './components/RatingPage';
import './App.css';

function App() {
  const [userData, setUserData] = useState({
    nameOrInitials: '',
    rating: 50
  });

  const handleNameSubmit = (nameOrInitials) => {
    setUserData({ ...userData, nameOrInitials });
  };

  const handleRatingChange = (rating) => {
    setUserData({ ...userData, rating });
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/" 
            element={<NamePage onSubmit={handleNameSubmit} />} 
          />
          <Route 
            path="/rating" 
            element={
              userData.nameOrInitials ? 
                <RatingPage 
                  nameOrInitials={userData.nameOrInitials} 
                  rating={userData.rating} 
                  onRatingChange={handleRatingChange} 
                /> : 
                <Navigate to="/" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
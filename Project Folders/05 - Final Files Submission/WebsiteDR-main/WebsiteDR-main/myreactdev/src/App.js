// //C:\react-js\myreactdev\src\App.js
import React, { } from 'react';
import './App.css';
  
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
  
import LandingPage from "./pages/LandingPage";
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ML_model from './pages/ML_model'

function App() {
  return (
    <div className="vh-100 gradient-custom">
    <div className="container">
   
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/ml_model" element={<ML_model />} />
        </Routes>
      </BrowserRouter>
    </div>
    </div>
  );
}
   
export default App;
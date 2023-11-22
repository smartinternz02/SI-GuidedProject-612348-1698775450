//C:\react-js\myreactdev\src\pages\LandingPage.js
import React, { } from "react";
import './LandingPage.css';
import img1 from '../Images/Landingpage.jpg';
import {Link} from 'react-router-dom';
 
export default function LandingPage(){
 
  return (
    <div class="landing-page">
    <div class="container">
        <div class="content">
            <img src={img1} alt="Landing Page Image" class="landing-image" />
            <h1>Deep Learning Fundus Image Analysis for Early Detection of Diabetic Retinopathy.</h1>
            <div class="button-container">
                <p>
                    <Link to="/login" class="btn btn-success">Login</Link> | 
                    <Link to="/register" class="btn btn-success">Register</Link>
                </p>
            </div>
        </div>
    </div>
</div>

  );
}
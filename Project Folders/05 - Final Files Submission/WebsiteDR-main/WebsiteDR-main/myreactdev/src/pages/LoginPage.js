//C:\react-js\myreactdev\src\pages\LoginPage.js
import React, { useState } from "react";
import axios from 'axios';
import './LoginPage.css';
import {useNavigate} from "react-router-dom"; 
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
export default function LoginPage(){
 
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
   
    const navigate = useNavigate();
     
    const logInUser = () => {
        if(email.length === 0){
          alert("Email has left Blank!");
        }
        else if(password.length === 0){
          alert("password has left Blank!");
        }
        else{
            axios.post('http://127.0.0.1:5000/login', {
                email: email,
                password: password
            })
            .then(function (response) {
                console.log(response);
                //console.log(response.data);
                navigate("/ml_model"); //check once if error arise
            })
            .catch(function (error) {
                console.log(error, 'error');
                if (error.response.status === 401) {
                    alert("Invalid credentials");
                }
            });
        }
    }
 
    let imgs = [
      'https://as1.ftcdn.net/v2/jpg/03/39/70/90/1000_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg',
    ];
     
  return (
    
    <div>
        <div className="container h-100">
          <div className="container-fluid h-custom">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-md-9 col-lg-6 col-xl-5">
                <img src={imgs[0]} className="img-fluid"/>
              </div>
              <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <form>
                  <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                    <p className="lead-fw-normal-mb-0-me-3">Log Into Your Account</p>
                  </div>
 
                  <div className="form-outline mb-4">
                  <label className="form-label-1" for="form3Example3">Email address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="form3Example3" className="form-control form-control-lg" placeholder="Enter a valid email address" />
                  </div>
 
             
                  <div className="form-outline mb-3">
                  <label className="form-label-2" for="form3Example4">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="form3Example4" className="form-control form-control-lg" placeholder="Enter password" />
                    
                  </div>
 
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check mb-0">
                      <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                      <label className="form-check-label" for="form2Example3">
                        Remember me
                      </label>
                    </div>
                    <a href="#!" className="text-body">Forgot password?</a>
                  </div>
                  <div>
                  <GoogleOAuthProvider clientId="385505748878-64gn9k87j10tgn4qtl7ft8vlci8modj7.apps.googleusercontent.com">
                  <GoogleLogin 
                  onSuccess={credentialResponse => {
                    console.log(jwtDecode(credentialResponse.credential));
                  }}
                  onError={() => {
                     console.log('Login Failed');  }}/>;                    
                  </GoogleOAuthProvider>;
                  </div>
 
                  <div className="text-center text-lg-start mt-4 pt-2">
                    <button type="button" className="btn btn-primary btn-lg" onClick={logInUser} >Login</button>
                    {/* <p><Link to="/ml_model" className="btn btn-success">Login</Link> </p> */}
                    <p className="small fw-bold mt-2 pt-1 mb-0">Want to predict? <a href="/ml_model" className="link-danger">Predict</a></p>
                    <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="/register" className="link-danger">Register</a></p>
                  </div>
 
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
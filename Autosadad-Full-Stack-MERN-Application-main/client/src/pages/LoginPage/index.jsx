import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // To redirect after login
import "./LoginPage.css";

const LoginPage = () => {
  // 1. State to store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 2. Function to handle the "Sign In" button click
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors

    try {
      // Points to your backend port (usually 5000) and the route in userRoutes.js
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      // 3. Success! Store the token for Milestone 3 requirements
      console.log("Login Success:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(response.data));

      alert("Login successful!");
      navigate("/dashboard"); // Send user to the dashboard
    } catch (err) {
      // Handle errors (wrong password, server down, etc.)
      setError(err.response?.data?.error || "Login failed. Is the server running?");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p style={{ color: "red", fontSize: "0.8rem" }}>{error}</p>}
        
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
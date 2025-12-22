// src/pages/HomePage.jsx
import React from "react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="welcome-card">
        <h2>Welcome Back!</h2>
        <p>Here’s an overview of your autopayments and balances.</p>
      </div>

      <div className="overview-cards">
        <div className="balance-card">
          <h3>Total Balance</h3>
          <p>$12,450.75</p>
        </div>
        <div className="payments-card">
          <h3>Upcoming Payments</h3>
          <p>3 payments due this week</p>
        </div>
        <div className="alerts-card">
          <h3>Alerts</h3>
          <p>2 transactions need approval</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute"; 

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BillsPage from "./pages/BillsPage";
import RemindersPage from "./pages/RemindersPage";
import PaymentsPage from "./pages/PaymentsPage";
import AddBillPage from "./pages/AddBillPage"; // 1. Import the new page
import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Header title="AutoSadad" /><HomePage /></>} />
        <Route path="/login" element={<><Header title="Login" /><LoginPage /></>} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <Header title="My Bills" />
              <BillsPage />
            </ProtectedRoute>
          }
        />

        {/* 2. New Protected Route for Adding Bills */}
        <Route
          path="/add-bill"
          element={
            <ProtectedRoute>
              <Header title="Add New Bill" />
              <AddBillPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Header title="Reminders" />
              <RemindersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Header title="Payments" />
              <PaymentsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<><Header title="Not Found" /><NotFoundPage /></>} />
      </Routes>
    </div>
  );
}

export default App;
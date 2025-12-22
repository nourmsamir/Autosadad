import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [bills, setBills] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // 1. Fetch User Profile
        const profileRes = await axios.get("http://localhost:5000/api/users/profile", config);
        setUser(profileRes.data);

        // 2. Fetch User Bills from live API
        const billsRes = await axios.get("http://192.168.100.12:5000/api/bills", config);
        setBills(billsRes.data);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- REFINED LOGIC FOR MILESTONE 3 ---
  
  // Total Spent should only calculate bills marked as "Paid"
  const totalSpent = bills
    .filter(bill => bill.status === "Paid")
    .reduce((acc, bill) => acc + (bill.amount || 0), 0);

  // Pending Count finds everything not yet paid
  const pendingCount = bills.filter(bill => bill.status !== "Paid").length;

  // Show only the 5 most recent activities to keep the dashboard tidy
  const recentBills = [...bills].reverse().slice(0, 5);

  if (loading) return <div className="dashboard-container">Loading secure data...</div>;

  return (
    <div className="dashboard-container">
      <h2 style={{ color: "#ffcc00", marginBottom: "20px" }}>
        Welcome back, {user ? user.username : "User"}!
      </h2>

      <div className="stats-cards">
        <div className="card">
          <h3>Total Spent</h3>
          <p style={{ color: "#00ff00" }}>${totalSpent.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Pending Payments</h3>
          <p style={{ color: "#ff4444" }}>{pendingCount} Payments</p>
        </div>
        <div className="card">
          <h3>Phone Registered</h3>
          <p>{user?.phone || "No phone added"}</p>
        </div>
      </div>

      <div className="transactions-table">
        <h3>Recent Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Provider</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBills.length > 0 ? (
              recentBills.map((bill) => (
                <tr key={bill._id}>
                  <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                  <td>{bill.provider} ({bill.billType})</td>
                  <td>${bill.amount}</td>
                  <td style={{ 
                    color: bill.status === "Paid" ? "#00ff00" : "#ff4444",
                    fontWeight: "bold"
                  }}>
                    {bill.status || "Pending"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No bills found. Click 'Bills' to add one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
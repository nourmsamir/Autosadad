import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./BillsPage.css";

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // New: For payment simulation
  const navigate = useNavigate();

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/bills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBills(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // --- UPDATED: SIMULATED PAYMENT FLOW ---
  const handlePay = async (billId) => {
    const confirmPayment = window.confirm("Redirecting to secure payment gateway. Proceed?");
    
    if (confirmPayment) {
      setIsProcessing(true); // Start simulation
      
      // Simulate a 2-second delay for "Processing..."
      setTimeout(async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.put(`http://localhost:5000/api/bills/${billId}`, 
            { status: "Paid" }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setIsProcessing(false);
          alert("Payment Successful! Bill marked as Paid.");
          fetchBills(); 
        } catch (error) {
          setIsProcessing(false);
          alert("Payment Gateway Error.");
        }
      }, 2000); 
    }
  };

  const handleDelete = async (billId) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/bills/${billId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchBills(); 
      } catch (error) {
        alert("Delete failed.");
      }
    }
  };

  if (loading) return <div className="bills-container">Loading your bills...</div>;

  return (
    <div className="bills-container">
      {/* Simulation Overlay */}
      {isProcessing && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", 
          alignItems: "center", zIndex: 1000, color: "#ffcc00"
        }}>
          <h2>Processing Secure Payment...</h2>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Upcoming Bills</h2>
        <button 
          onClick={() => navigate("/add-bill")} 
          style={{ padding: "10px", backgroundColor: "#ffcc00", border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          + Add New Bill
        </button>
      </div>

      <div className="bills-list" style={{ marginTop: "20px" }}>
        {bills.length > 0 ? (
          bills.map((bill) => (
            <div className="bill-card" key={bill._id} style={{ border: "1px solid #444", padding: "15px", marginBottom: "10px", borderRadius: "8px" }}>
              <h3>{bill.provider}</h3>
              <p>Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
              <p>Amount: ${bill.amount}</p>
              <p>Status: <strong style={{ color: bill.status === "Paid" ? "#00ff00" : "#ff4444" }}>{bill.status}</strong></p>
              
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button 
                  onClick={() => handlePay(bill._id)} 
                  disabled={bill.status === "Paid" || isProcessing}
                  style={{ backgroundColor: bill.status === "Paid" ? "#555" : "#ffcc00", flex: 1, fontWeight: "bold" }}
                >
                  {bill.status === "Paid" ? "COMPLETED" : "PAY NOW"}
                </button>

                <button 
                  onClick={() => handleDelete(bill._id)} 
                  style={{ backgroundColor: "#ff4444", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#aaa" }}>No bills found. Click "+ Add New Bill" to start!</p>
        )}
      </div>
    </div>
  );
};

export default BillsPage;
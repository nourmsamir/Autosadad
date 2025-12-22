import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBillPage = () => {
  const [formData, setFormData] = useState({
    provider: "",
    amount: "",
    dueDate: "",
    billType: "Utility",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/bills", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Bill added to database!");
      navigate("/bills"); // Go back to see your new live bill
    } catch (err) {
      console.error("Error saving bill:", err);
      alert("Failed to save bill. Check console.");
    }
  };

  return (
    <div className="bills-container">
      <h2>Add New Bill</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
        <input 
          type="text" 
          placeholder="Provider (e.g., WE, Electricity Co)" 
          required 
          onChange={(e) => setFormData({ ...formData, provider: e.target.value })} 
        />
        <input 
          type="number" 
          placeholder="Amount" 
          required 
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
        />
        <input 
          type="date" 
          required 
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} 
        />
        <select onChange={(e) => setFormData({ ...formData, billType: e.target.value })}>
          <option value="Utility">Utility</option>
          <option value="Internet">Internet</option>
          <option value="Mobile">Mobile</option>
        </select>
        <button type="submit" style={{ backgroundColor: "#ffcc00", fontWeight: "bold", padding: "10px" }}>
          Save Bill
        </button>
      </form>
    </div>
  );
};

export default AddBillPage;
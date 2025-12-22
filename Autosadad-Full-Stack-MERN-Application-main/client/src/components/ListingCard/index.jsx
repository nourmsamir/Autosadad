// src/components/ListingCard.jsx
import React from "react";

const ListingCard = ({ title, amount, dueDate }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        width: "200px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0" }}>{title}</h3>
      <p style={{ margin: "0 0 4px 0" }}>Amount: ${amount}</p>
      <p style={{ margin: 0 }}>Due: {dueDate}</p>
    </div>
      );
};

export default ListingCard;

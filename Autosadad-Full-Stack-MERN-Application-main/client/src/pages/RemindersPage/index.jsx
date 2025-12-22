import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RemindersPage.css";

const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token"); // Verify security
      const { data } = await axios.get("http://localhost:5000/api/bills", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Logic: Filter for bills due within the next 7 days
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const urgentBills = data.filter((bill) => {
        const dueDate = new Date(bill.dueDate);
        return bill.status === "Pending" && dueDate >= today && dueDate <= nextWeek;
      });

      setReminders(urgentBills);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // Update status directly from reminders
  const handleMarkAsDone = async (billId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/bills/${billId}`, 
        { status: "Paid" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReminders(); // Refresh list
    } catch (error) {
      alert("Failed to update reminder.");
    }
  };

  if (loading) return <div className="reminders-container">Loading reminders...</div>;

  return (
    <div className="reminders-container">
      <h2>Payment Reminders</h2>
      {reminders.length > 0 ? (
        reminders.map((bill) => (
          <div className="reminder-card" key={bill._id}>
            <p>
              <strong>{bill.provider}</strong> - Due: {new Date(bill.dueDate).toLocaleDateString()}
            </p>
            <p>Amount: ${bill.amount}</p>
            <button onClick={() => handleMarkAsDone(bill._id)}>Mark as Done</button>
          </div>
        ))
      ) : (
        <p className="no-reminders">✅ You're all caught up! No urgent bills this week.</p>
      )}
    </div>
  );
};

export default RemindersPage;
import { useState, useEffect } from "react";
import axios from "axios";
import "./PaymentsPage.css";

function PaymentsPage() {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // UPDATED: Points back to your local server
  const API_URL = "http://localhost:5000/api/bills";

  const [formData, setFormData] = useState({
    provider: "",
    amount: "",
    method: "Credit/Debit Card",
    details: "" 
  });

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentHistory(data.filter((bill) => bill.status === "Paid"));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching history:", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const downloadReceipt = (bill) => {
    const receiptText = `
      --- AUTOSADAD PAYMENT RECEIPT ---
      Transaction ID: ${bill._id}
      Provider: ${bill.provider}
      Amount Paid: $${bill.amount}
      Payment Method: ${bill.method || "Standard"}
      Date: ${new Date(bill.updatedAt).toLocaleString()}
      Status: ${bill.status}
      
      Thank you for using AutoSadad!
      ---------------------------------
    `;
    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt_${bill.provider}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        // FIX: Included billType: "Utility" to satisfy backend schema
        await axios.post(API_URL, 
          { 
            ...formData, 
            billType: "Utility", 
            status: "Paid", 
            dueDate: new Date() 
          }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        alert(`Success! $${formData.amount} paid via ${formData.method}`);
        setShowModal(false);
        setIsProcessing(false);
        fetchHistory(); 
      } catch (err) {
        console.error("Payment Error:", err.response?.data || err.message);
        // UPDATED: Error message corrected for localhost
        alert("Payment failed. Make sure your backend server is running on localhost:5000");
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="payments-container">
      <h2>Make a Payment</h2>

      <div className="payment-card">
        <h3>One-Time Payment</h3>
        <input 
            type="text" 
            placeholder="Payee Name" 
            onChange={(e) => setFormData({...formData, provider: e.target.value})} 
        />
        <input 
            type="number" 
            placeholder="Amount (EGP)" 
            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
        />
        
        <label style={{color: "#aaa", fontSize: "12px", display: "block", marginTop: "10px"}}>Select Method:</label>
        <select 
            style={{ width: "100%", padding: "10px", margin: "10px 0", background: "#333", color: "white" }}
            onChange={(e) => setFormData({...formData, method: e.target.value})}
        >
          <option value="Credit/Debit Card">💳 Credit/Debit Card</option>
          <option value="InstaPay">⚡ InstaPay</option>
          <option value="Vodafone Cash">🔴 Vodafone Cash</option>
        </select>
        
        <button onClick={() => setShowModal(true)} style={{marginTop: "10px", width: "100%"}}>Proceed to Secure Payment</button>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          backgroundColor: "rgba(0,0,0,0.9)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div className="modal-content" style={{ background: "#1a1a1a", padding: "30px", borderRadius: "15px", width: "400px", border: "1px solid #ffcc00" }}>
            <h3 style={{color: "#ffcc00", textAlign: "center"}}>{formData.method} Gateway</h3>
            <p style={{textAlign: "center", color: "#888"}}>Paying <strong>{formData.provider}</strong>: ${formData.amount}</p>
            
            <form onSubmit={handleFinalSubmit}>
              {formData.method === "Credit/Debit Card" && (
                <>
                  <input type="text" placeholder="Card Number (16-digits)" required style={{marginBottom: "10px", width: "100%", padding: "10px", background: "#222", color: "#fff", border: "1px solid #444"}} />
                  <div style={{display: "flex", gap: "10px", marginBottom: "10px"}}>
                    <input type="text" placeholder="MM/YY" required style={{padding: "10px", flex: 1, background: "#222", color: "#fff", border: "1px solid #444"}} />
                    <input type="text" placeholder="CVV" required style={{padding: "10px", flex: 1, background: "#222", color: "#fff", border: "1px solid #444"}} />
                  </div>
                </>
              )}

              {formData.method === "InstaPay" && (
                <input type="text" placeholder="Your InstaPay Address" required style={{width: "100%", padding: "10px", marginBottom: "10px", background: "#222", color: "#fff", border: "1px solid #444"}} />
              )}

              {formData.method === "Vodafone Cash" && (
                <input type="text" placeholder="Vodafone Wallet Number (010...)" required style={{width: "100%", padding: "10px", marginBottom: "10px", background: "#222", color: "#fff", border: "1px solid #444"}} />
              )}

              <div style={{display: "flex", gap: "10px", marginTop: "20px"}}>
                <button type="button" onClick={() => setShowModal(false)} style={{background: "#444", flex: 1, padding: "10px", cursor: "pointer", border: "none", color: "white"}}>Cancel</button>
                <button type="submit" disabled={isProcessing} style={{background: "#00ff00", color: "#000", flex: 2, padding: "10px", fontWeight: "bold", cursor: "pointer", border: "none"}}>
                  {isProcessing ? "Verifying..." : "Confirm & Pay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="payment-history-section" style={{ marginTop: "40px" }}>
        <h2>Payment History</h2>
        {loading ? <p>Loading...</p> : (
            <div className="history-list">
            {paymentHistory.map((bill) => (
                <div key={bill._id} className="history-item" style={{ 
                    display: "flex", justifyContent: "space-between", alignItems: "center", 
                    padding: "15px", borderBottom: "1px solid #444", background: "#1a1a1a", marginBottom: "10px" 
                }}>
                <div style={{ flex: 2 }}>
                    <strong>{bill.provider}</strong>
                    <div style={{ fontSize: "12px", color: "#888" }}>Via {bill.method}</div>
                </div>
                <div style={{ flex: 1 }}>${bill.amount}</div>
                <div style={{ flex: 1, color: "#00ff00" }}>{bill.status}</div>
                <button 
                    onClick={() => downloadReceipt(bill)}
                    style={{ background: "none", border: "1px solid #ffcc00", color: "#ffcc00", padding: "5px 10px", cursor: "pointer" }}
                >
                    Receipt 📄
                </button>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}

export default PaymentsPage;
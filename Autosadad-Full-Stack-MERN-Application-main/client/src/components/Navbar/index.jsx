import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  // Check if the user is logged in by looking for the token
  const isAuthenticated = localStorage.getItem("token");

  const handleLogout = () => {
    // Remove the token and user info from storage
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    
    // Alert the user and redirect to the login page
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav style={{ 
      padding: "10px", 
      background: "#333", // Darker background for a professional look
      color: "#fff",
      display: "flex",
      gap: "15px",
      alignItems: "center"
    }}>
      <Link style={{ color: "#fff", textDecoration: "none" }} to="/">Home</Link>
      
      {!isAuthenticated ? (
        // Show only if NOT logged in
        <Link style={{ color: "#fff", textDecoration: "none" }} to="/login">Login</Link>
      ) : (
        // Show only if IS logged in
        <>
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/dashboard">Dashboard</Link>
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/bills">Bills</Link>
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/reminders">Reminders</Link>
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/payments">Payments</Link>
          
          <button 
            onClick={handleLogout} 
            style={{ 
              background: "#ffcc00", // Matches your yellow theme
              border: "none", 
              padding: "5px 10px", 
              cursor: "pointer",
              borderRadius: "4px",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
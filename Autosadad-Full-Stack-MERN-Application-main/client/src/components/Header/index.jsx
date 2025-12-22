import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg"; // path to your logo
import "./style.css";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo-container">
        <img src={logo} alt="Website logo" className="logo" />

        <span className="logo-text">AutoSadad</span>
      </Link>

      <nav>
        <Link to="/">Home</Link> | <Link to="/add">Add Listing</Link>
      </nav>
    </header>
  );
}

export default Header;



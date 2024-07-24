import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Add your CSS here for styling

const Navbar = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      <Link to="/" onClick={scrollToTop} className="logo">
        EDUNAVIGATOR
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/filter">Find Your Dream College</Link>
        </li>
        <li>
          <Link to="/chatbot">Chatbot</Link>
        </li>
        {/* Add other navigation links here */}
      </ul>
    </nav>
  );
};

export default Navbar;

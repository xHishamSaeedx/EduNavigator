import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainContent from "./components/MainContent";
import FooterSection from "./components/FooterSection";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <MainContent />
        <FooterSection />
      </div>
    </Router>
  );
};

export default App;

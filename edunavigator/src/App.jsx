import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FilterForm from "./components/FilterForm";
import Chatbot from "./components/Chatbot";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import FooterSection from "./components/FooterSection";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <AboutSection />
                </>
              }
            />
            <Route
              path="/filter"
              element={
                <section className="card-container">
                  <div className="card">
                    <FilterForm />
                  </div>
                </section>
              }
            />
            <Route
              path="/chatbot"
              element={
                <section className="card-container">
                  <div className="card">
                    <Chatbot />
                  </div>
                </section>
              }
            />
            <Route path="/contact" element={<ContactSection />} />
          </Routes>
        </main>
        <FooterSection />
      </div>
    </Router>
  );
};

export default App;

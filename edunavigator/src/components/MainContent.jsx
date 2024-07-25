import React from "react";
import { Route, Routes } from "react-router-dom";
import FilterForm from "./FilterForm";
import Chatbot from "./Chatbot";
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
import HeroSection from "./HeroSection"; // Import HeroSection
import "./MainContent.css"; // Import the CSS file
import chatbotimg from "./chatbot3.jpg";
import searchimg from "./filter.png";

const MainContent = () => {
  return (
    <main className="main-content">
      <HeroSection /> {/* Include HeroSection here */}
      <Routes>
        <Route path="/" element={<AboutSection />} />
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
      {/* New Section */}
      <section className="guidance-section">
        <h2>Get Guidance</h2>
        <div className="guidance-cards">
          <div className="guidance-card">
            <img src={searchimg} alt="Filter Form" />
            <h3>Filter Form</h3>
            <p>
              Use our filter system to find colleges based on your criteria.
            </p>
            <a href="/filter" className="btn">
              Explore
            </a>
          </div>
          <div className="guidance-card">
            <img src={chatbotimg} alt="Chatbot" />
            <h3>Chatbot</h3>
            <p>
              Ask questions and get instant answers with our LLM-based chatbot.
            </p>
            <a href="/chatbot" className="btn">
              Ask Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;

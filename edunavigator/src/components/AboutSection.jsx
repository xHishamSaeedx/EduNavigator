import React from "react";
import "./AboutSection.css"; // Add your CSS here for styling

const AboutSection = () => {
  return (
    <section className="about">
      <h2>About EduNavigator</h2>
      <p>
        EduNavigator is a dedicated platform for EAMCET-passed students seeking
        guidance on engineering colleges in Telangana. Our mission is to help
        students navigate their options by providing a robust filter system that
        matches their eligibility and preferences. We offer a comprehensive
        search tool to find colleges based on various criteria such as caste,
        rank, branch, and tuition fees. Additionally, EduNavigator features an
        LLM-based chatbot designed to answer all your queries about colleges,
        admissions, and more. Our goal is to make your journey towards higher
        education smooth and informed.
      </p>
    </section>
  );
};

export default AboutSection;

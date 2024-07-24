import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import FilterForm from "./components/FilterForm";
import Chatbot from "./components/Chatbot";

const App = () => {
  return (
    <Router>
      <div>
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/filter">Filter Form</Link>
              </li>
              <li>
                <Link to="/chatbot">Chatbot</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <section>
                  {/* Hero section */}
                  <h1>Welcome to EduNavigator</h1>
                  <p>Your one-stop solution to find your dream college.</p>
                </section>
              }
            />
            <Route path="/filter" element={<FilterForm />} />
            <Route path="/chatbot" element={<Chatbot />} />
            {/* Add other routes for about, contact, etc. */}
          </Routes>
        </main>
        <footer>{/* Add footer content here */}</footer>
      </div>
    </Router>
  );
};

export default App;

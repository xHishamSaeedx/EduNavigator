import axios from "axios";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css"; // Ensure this CSS file is linked

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(""); // Clear previous response
    try {
      const res = await axios.post("http://localhost:8000/ask-question", {
        question,
      });
      setResponse(res.data.reply);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-heading">Ask the Chatbot</h1>
      <form onSubmit={handleQuestionSubmit} className="chatbot-form">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          className="chatbot-input"
        />
        <button type="submit" className="chatbot-button">
          Ask
        </button>
      </form>
      {isLoading ? (
        <div className="loading-screen">Loading...</div>
      ) : (
        response && (
          <div className="chatbot-response">
            <ReactMarkdown className="markdown">{response}</ReactMarkdown>
          </div>
        )
      )}
    </div>
  );
};

export default Chatbot;

import axios from "axios";
import React, { useState } from "react";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/ask-question", {
        question,
      });
      setResponse(res.data.reply);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
  };

  return (
    <div>
      <h1>Ask the Chatbot</h1>
      <form onSubmit={handleQuestionSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
        />
        <button type="submit">Ask</button>
      </form>
      <div>
        <h2>Response</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default Chatbot;

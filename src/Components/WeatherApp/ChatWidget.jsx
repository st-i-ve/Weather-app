import React, { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";
import getdataThroughai from "../services/weatheraitest";
import { IoChatbubbleEllipsesOutline, IoClose, IoSend, IoInformationCircleOutline } from "react-icons/io5";

const ChatWidget = ({ weather, units }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "hello i am your assistant", sender: "responder" },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const chatBoxRef = useRef(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleHelp = () => {
    // i added a simple help handler that shows basic info
    const helpMessage = {
      text: "Hi! I'm your weather assistant. You can ask me about current weather, forecasts, or any weather-related questions. Try asking things like 'Will it rain tomorrow?' or 'What's the temperature like?'",
      sender: "responder"
    };
    setMessages(prev => [...prev, helpMessage]);
    setIsChatOpen(true);
  };

  const handleInputChange = (event) => {
    setUserMessage(event.target.value);
  };

  const handleUserMessageSubmit = async (event) => {
    event.preventDefault();
    if (userMessage.trim() !== "") {
      const newUserMessage = { text: userMessage, sender: "user" };

      const newMessages = [...messages, newUserMessage];
      setMessages(newMessages);

      setUserMessage("");

      scrollToBottom();

      const newaidata = await getdataThroughai(newMessages, weather, units);

      // Simulate response from responder after 1 second
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: newaidata, sender: "responder" },
        ]);
        scrollToBottom();
      }, 1000);
    }
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="floating-dock">
      {/* help button */}
      {!isChatOpen && (
        <button className="dock-button help-button" onClick={handleHelp}>
          <IoInformationCircleOutline size={24} />
          <div className="button-label">Help</div>
        </button>
      )}
      
      {/* chat widget */}
      <div className={`chat-widget ${isChatOpen ? "open" : ""}`}>
        {!isChatOpen && (
          <button className="dock-button toggle-button" onClick={toggleChat}>
            <IoChatbubbleEllipsesOutline size={24} />
            <div className="button-label">Chat</div>
          </button>
        )}
        <div className="chat-container">
        {isChatOpen && (
          <div className="chat-header">
            <span className="chat-title">Weather Assistant</span>
            <div className="close-button" onClick={toggleChat}>
              <IoClose className="close-icon" size={16} />
            </div>
          </div>
        )}
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div className="message-bubble">{message.text}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleUserMessageSubmit} className="user-input">
          <input
            type="text"
            value={userMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <button type="submit" className="send-button">
            <IoSend size={18} />
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;

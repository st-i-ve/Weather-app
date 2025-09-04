import React, { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";
import getdataThroughai from "../../Service/AIservice";
import { IoChatbubbleEllipsesOutline, IoClose, IoSend } from "react-icons/io5";
import { Tooltip } from "react-tooltip";

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

  // prevent body scrolling when chat is open on mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 480;
    if (isMobile) {
      if (isChatOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    
    // cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isChatOpen]);

  // handle mobile viewport height for browser address bar
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    const isMobile = window.innerWidth <= 480;
    if (isMobile) {
      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);
      window.addEventListener('orientationchange', setViewportHeight);
      
      return () => {
        window.removeEventListener('resize', setViewportHeight);
        window.removeEventListener('orientationchange', setViewportHeight);
      };
    }
  }, []);

  return (
    <div className={`chat-widget ${isChatOpen ? "open" : ""}`}>
      {!isChatOpen && (
        <>
          <div
            className="toggle-button"
            onClick={toggleChat}
            data-tooltip-id="chat-tooltip"
            data-tooltip-content="Click me to talk to your agricultural assistant"
          >
            <IoChatbubbleEllipsesOutline size={24} />
          </div>
          <Tooltip
            id="chat-tooltip"
            place="left"
            style={{
              backgroundColor: "#4a90e2",
              color: "white",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </>
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
  );
};

export default ChatWidget;

import React, { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";
import getdataThroughai from "../services/weatheraitest";

const ChatWidget = ({weather,units}) => {
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

  const handleUserMessageSubmit = async(event) => {
    event.preventDefault();
    if (userMessage.trim() !== "") {
      const newUserMessage = { text: userMessage, sender: "user" };

      const newMessages=[...messages, newUserMessage];
      setMessages(newMessages);
      
   
      setUserMessage("");
      
      scrollToBottom();

      const newaidata=await getdataThroughai(newMessages,weather,units);
  
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
    <div className={`chat-widget ${isChatOpen ? "open" : ""}`}>
      <div className="toggle-area" onClick={toggleChat}></div>{" "}
      {/* Clickable area to toggle chat */}
      <div className="toggle-button" onClick={toggleChat}>
        {isChatOpen ? "Close Chat" : "Open Chat"}
      </div>
      {isChatOpen && (
        <div>
          <div className="chat-box" ref={chatBoxRef}
           >
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
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;

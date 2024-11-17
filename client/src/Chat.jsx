import { useState, useEffect } from "react";
import Pusher from "pusher-js";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const handleMessageSend = async () => {
    const response = await fetch("http://localhost:5000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: newMessage }),
    });

    if (response.ok) {
      setNewMessage("");
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="New Message..."
      />
      <button onClick={handleMessageSend}>Senden</button>
    </div>
  );
};

export default Chat;

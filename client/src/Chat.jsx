import { useState, useEffect } from "react";
import Pusher from "pusher-js";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [inChatroom, setInChatroom] = useState(false);

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: data.username, message: data.message, time: data.time },
      ]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const handleMessageSend = async () => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    if (!newMessage.trim()) return;
    const response = await fetch("http://localhost:5000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: newMessage, username, time }),
    });

    if (response.ok) {
      setNewMessage("");
    }
  };

  if (!inChatroom) {
    return (
      <div>
        <h2>Willkommen zur Chatbox</h2>
        <input
          type="text"
          placeholder="Wähle einen Benutzernamen"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => setInChatroom(true)} disabled={!username.trim()}>
          Chat betreten
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            {" "}
            <strong>{msg.username}</strong>: {msg.message}{" "}
            <span>({msg.time})</span>
          </div>
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

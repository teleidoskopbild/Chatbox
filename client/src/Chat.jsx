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
      <div className="flex flex-col items-center p-8 bg-blue-100 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Chatbox</h2>
        <input
          type="text"
          placeholder="Choose a Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border-2 border-gray-300 rounded-md mb-4"
        />
        <button
          onClick={() => setInChatroom(true)}
          disabled={!username.trim()}
          className="bg-blue-500 text-white py-2 px-4 rounded-md disabled:bg-gray-300"
        >
          Enter Chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 bg-blue-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Chat</h2>
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-4 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="border-b py-2">
            {" "}
            <strong className="text-blue-600">{msg.username}</strong>:{" "}
            {msg.message}{" "}
            <span className="text-sm text-gray-500">({msg.time})</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="New Message..."
        className="p-2 w-full max-w-xl border-2 border-gray-300 rounded-md mb-4"
      />
      <button
        onClick={handleMessageSend}
        className="bg-blue-500 text-white py-2 px-4 rounded-md disabled:bg-gray-300"
      >
        Senden
      </button>
    </div>
  );
};

export default Chat;

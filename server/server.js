import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Pusher from "pusher";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
});

app.get("/", (req, res) => {
  res.send("Chatbox Server is working!");
});

app.post("/message", (req, res) => {
  const { message, username, time } = req.body;

  pusher.trigger("chat", "message", {
    message: message,
    username: username,
    time: time,
  });

  res.status(200).send("Nachricht gesendet");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server in running on Port ${PORT}`);
});

import { useState } from "react";
import HeaderNav from "../headerNav/headerNav";
import styles from "./geminiChat.module.css";

function Message({ m }) {
  return (
    <div className={`${styles.message} ${m.role === "user" ? styles.own : ""}`}>
      {m.message}
    </div>
  );
}

function GeminiChat() {
  const [chat, setChat] = useState([
    { message: "fuck you", role: "model" },
    { message: "fuck you too", role: "user" },
  ]);

  return (
    <div className={styles.GeminiChatContainer}>
      <HeaderNav />
      <div className={styles.chatContainer}>
        <div className={styles.allMessages}>
          {chat.map((m) => (
            <Message m={m} />
          ))}
        </div>
        <form
          className={styles.inputBoxContainer}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input type="text" placeholder="Enter text to chat" />
          <button type="submit">
            <span class="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
      <div className={styles.aiWords}>
        use ai suggested words to practice typing
      </div>
    </div>
  );
}

export default GeminiChat;

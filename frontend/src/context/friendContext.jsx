import { createContext, useContext, useEffect, useState } from "react";
import { getConversation, loadConversations } from "../utlis/handleApi";
import userContext from "./userCotext";

const friendContext = createContext();

export function FriendProvider({ children }) {
  const { token } = useContext(userContext);
  const [conversationsList, setConversationsList] = useState([]);
  const [friendId, setFriendId] = useState("");
  const [conversationSelectedIndex, setConersationSelectedIndex] = useState(-1);
  const [userStatus, setUserStatus] = useState("none"); //chatting, challenge, result

  useEffect(() => {
    loadConversations(setConversationsList, token);
  }, []);

  function loadMessages(i) {
    if (conversationsList[i].messages === undefined) {
      getConversation(conversationsList[i]._id, setConversationsList);
    }
  }

  function loadMessageforDuel(conversationId) {
    getConversation(conversationId, setConversationsList);
  }

  return (
    <friendContext.Provider
      value={{
        setUserStatus,
        conversationsList,
        setConversationsList,
        friendId,
        setFriendId,
        conversationSelectedIndex,
        setConersationSelectedIndex,
        loadMessages,
        loadMessageforDuel,
      }}
    >
      {children}
    </friendContext.Provider>
  );
}

export default friendContext;

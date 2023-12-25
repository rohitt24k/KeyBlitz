import { useContext, useEffect, useRef, useState } from "react";
import HeaderNav from "../../components/headerNav/headerNav";
import styles from "./friends.module.css";
import {
  addMessage,
  createConversation,
  getConversation,
  loadConversations,
  searchUser,
  sendData,
} from "../../utlis/handleApi";
import userContext from "../../context/userCotext";
import socketContext from "../../context/socketContext";

function FriendList({ name, imageIndex, userId, setCurrentFriendDetail }) {
  return (
    <div
      className={styles.friendList}
      onClick={() => {
        setCurrentFriendDetail({ userId, name });
      }}
    >
      <img src={`./images/avatar/${imageIndex}.png`} alt="user" />
      {name}
    </div>
  );
}

function ConversationList({
  userId,
  data,
  handleSelect,
  imageIndex,
  setFriendId,
}) {
  const friend = data.users.find((d) => d.userId !== userId);

  return (
    <div
      className={styles.friendList}
      onClick={() => {
        handleSelect();
        setFriendId(friend.userId);
      }}
    >
      <img src={`./images/avatar/${imageIndex}.png`} alt="user" />
      {friend.name}
    </div>
  );
}

function Message({ message, own }) {
  return (
    <div className={`${own && styles.own} ${styles.message}`}>{message}</div>
  );
}

function Friends() {
  const [search, setSearch] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [currentFriendDetail, setCurrentFriendDetail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [conversationsList, setConversationsList] = useState([]);
  const [conversationSelectedIndex, setConersationSelectedIndex] = useState(-1);
  // const [conversationId, setConversationId] = useState("");
  const [friendId, setFriendId] = useState("");

  const { userId, token } = useContext(userContext);
  const { socket } = useContext(socketContext);

  const messageRef = useRef(null);

  function handleAddMessage(data, conversationId, friendId) {
    socket.emit("addMessage", { data, conversationId, friendId });
  }

  useEffect(() => {
    if (messageRef.current) {
      const container = messageRef.current;
      // container.scrollTo({
      //   top: container.scrollHeight,
      //   behavior: "smooth",
      // });
      container.scrollTop = container.scrollHeight;
    }
  }, [conversationsList, conversationSelectedIndex]);

  useEffect(() => {
    if (socket) {
      socket.on("addMessage", ({ data, conversationId }) => {
        // const conv = [...conversationsList];
        // console.log(conv);
        // conv.forEach((c) => {
        //   if (c._id === conversationId) {
        //     c.messages.push(data);
        //   }
        // });
        // console.log(conv);
        setConversationsList((prev) => {
          console.log("error");
          const newData = [...prev];
          newData.forEach((d) => {
            if (d._id === conversationId) {
              const newMess = [...d.messages, data];
              d.messages = newMess;
            }
          });
          return newData;
        });
        // console.log(data, conversationId);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (search.length > 3) {
      const time = setTimeout(() => {
        searchUser(search, setFriendsList);
      }, 1000);

      return () => clearTimeout(time);
    }
  }, [search]);

  useEffect(() => {
    loadConversations(setConversationsList, token);
  }, []);

  // useEffect(() => {
  //   if (conversationId) {
  //     if (
  //       conversationsList.find(
  //         (c) => c._id === conversationId && c.messages === undefined
  //       )
  //     ) {
  //       getConversation(conversationId, setConversationsList);
  //     }
  //   }
  // }, [conversationId]);

  useEffect(() => {
    if (conversationSelectedIndex !== -1) {
      if (conversationsList[conversationSelectedIndex].messages === undefined) {
        getConversation(
          conversationsList[conversationSelectedIndex]._id,
          setConversationsList
        );
      }
    }
  }, [conversationSelectedIndex]);

  return (
    <div className={styles.friendsContainer}>
      <HeaderNav />
      <div className={styles.friendsListContainer}>
        <nav>
          <li>Friends</li>
          <li>Groups</li>
        </nav>
        <main>
          <section className={styles.leftSection}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            <div className={styles.friendListCard}>
              {!search
                ? conversationsList.map((d, i) => (
                    <ConversationList
                      data={d}
                      // setConversationId={setConversationId}
                      handleSelect={() => {
                        setConersationSelectedIndex(i);
                      }}
                      setFriendId={setFriendId}
                      userId={userId}
                      imageIndex={i + 1}
                      key={i}
                    />
                  ))
                : friendsList.map((d, i) => (
                    <FriendList
                      name={d.name}
                      userId={d._id}
                      key={d._id}
                      imageIndex={i + 1}
                      setCurrentFriendDetail={setCurrentFriendDetail}
                    />
                  ))}
              {/* <FriendList name="Rohit Kumar" imageIndex={1} />
              <FriendList name="Simple Person" imageIndex={2} /> */}
            </div>
          </section>
          <section className={styles.rightSection}>
            {conversationSelectedIndex !== -1 ? (
              <>
                <div className={styles.messagesContainer} ref={messageRef}>
                  {/* {conversation.messages?.map((m) => (
                    <Message
                      message={m.message}
                      own={m.senderId === userId ? true : false}
                    />
                  ))} */}
                  {/* {conversationsList
                    .find((d) => d._id === conversationId)
                    .messages?.map((m) => (
                      <Message
                        message={m.message}
                        own={m.senderId === userId ? true : false}
                      />
                    ))} */}
                  {conversationsList[conversationSelectedIndex].messages?.map(
                    (m, i) => (
                      <Message
                        message={m.message}
                        own={m.senderId === userId ? true : false}
                        key={i}
                      />
                    )
                  )}
                </div>
                <footer>
                  <button>Send a Dual</button>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      const data = { senderId: userId, message: userMessage };
                      addMessage(
                        data,
                        conversationsList[conversationSelectedIndex]._id
                      );
                      handleAddMessage(
                        data,
                        conversationsList[conversationSelectedIndex]._id,
                        friendId
                      );
                      const newPush = [...conversationsList];
                      newPush[conversationSelectedIndex].messages.push(data);
                      setConversationsList(newPush);
                      setUserMessage("");
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Type a message"
                      value={userMessage}
                      onChange={(e) => {
                        setUserMessage(e.target.value);
                      }}
                    />
                    <button type="submit">Send</button>
                  </form>
                </footer>
              </>
            ) : (
              <p>Select a conversation to chat</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Friends;

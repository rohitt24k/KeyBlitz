import { useContext, useEffect, useRef, useState } from "react";
import HeaderNav from "../../components/headerNav/headerNav";
import styles from "./friends.module.css";
import {
  addMessage,
  createConversation,
  getConversation,
  loadConversations,
  searchUser,
  startMatch,
} from "../../utlis/handleApi";
import userContext from "../../context/userCotext";
import socketContext from "../../context/socketContext";
import friendContext from "../../context/friendContext";
import { useNavigate } from "react-router-dom";
import OfflinePopup from "../../components/offlinePopup/offlinePopup";

function FriendList({
  name,
  imageIndex,
  userId,
  setCurrentFriendDetail,
  setNonFriend,
  setFriendId,
}) {
  return (
    <div
      className={styles.friendList}
      onClick={() => {
        setCurrentFriendDetail({ userId, name });
        setNonFriend(true);
        setFriendId(userId);
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

function Match({ status, own, winner, speed, handleMatchStart }) {
  let message = "";
  if (status === "request" && !own) {
    message = "Accept";
  } else if (status === "request" && own) {
    message = "Request Sent";
  }

  return (
    <div className={`${own && styles.own} ${styles.message}`}>
      <div className={styles.top}>DUEL</div>
      <div
        className={styles.bottom}
        onClick={() => {
          if (message === "Accept") {
            handleMatchStart();
          }
        }}
      >
        {message}
      </div>
    </div>
  );
}

function Friends() {
  const [search, setSearch] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [currentFriendDetail, setCurrentFriendDetail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [nonFriend, setNonFriend] = useState(false);

  // const [conversationId, setConversationId] = useState("");

  const { userId, token } = useContext(userContext);
  const { socket, startGame, showOfflinePopup, setShowOfflinePopup } =
    useContext(socketContext);
  const {
    setUserStatus,
    conversationsList,
    setConversationsList,
    friendId,
    setFriendId,
    conversationSelectedIndex,
    setConersationSelectedIndex,
    loadMessages,
    loadMessageforDuel,
  } = useContext(friendContext);

  const messageRef = useRef(null);

  function handleAddMessage(data, conversationId, friendId) {
    socket.emit("addMessage", { data, conversationId, friendId });
  }

  function handleDuelSend(friendId) {
    socket.emit("duelRequest", {
      friendId,
      conversationId: conversationsList[conversationSelectedIndex]._id,
    });
  }

  function handleMatchStart() {
    console.log("match will start for friend: ", friendId);
    startGame(friendId);
  }

  // function handleExpireDual(m) {
  //   // console.log();

  //   // console.log(m.match.expiryTime);

  //   const timeRemaining = new Date(m.match.expiryTime) - new Date(m.timestamp);
  //   if (timeRemaining > 0) {
  //     setTimeout(() => {
  //       console.log("settimeout");
  //       console.log(timeRemaining);

  //       getConversation(
  //         conversationsList[conversationSelectedIndex]._id,
  //         setConversationsList
  //       );
  //     }, timeRemaining);
  //   } else {
  //     console.log("settimeout else");
  //     getConversation(
  //       conversationsList[conversationSelectedIndex]._id,
  //       setConversationsList
  //     );
  //   }
  // }

  useEffect(() => {
    setUserStatus("chatting");
  }, []);

  useEffect(() => {
    if (messageRef.current) {
      const container = messageRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [conversationsList, conversationSelectedIndex]);

  useEffect(() => {
    if (socket) {
      socket.on("addMessage", ({ data, conversationId }) => {
        setConversationsList((prev) => {
          const index = prev.findIndex((d) => d._id === conversationId);

          if (index === -1) {
            //need to hot reload and maintain previous things like just only change conversationsList
            // console.log('a hot reload')
            loadConversations(setConversationsList, token);
          } else {
            if (prev[index].messages) {
              prev[index].messages.push(data);
              // console.log("the data is added");
            }
          }
          return [...prev];
        });
      });
      socket.on("duelRequest", ({ conversationId }) => {
        loadMessageforDuel(conversationId);
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

  const navigate = useNavigate();
  return (
    <div className={styles.friendsContainer}>
      <HeaderNav />
      <div className={styles.friendsListContainer}>
        <nav>
          <li>Friends</li>
          <li
            onClick={() => {
              navigate("/");
            }}
          >
            Groups
          </li>
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
                        loadMessages(i);
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
                      setFriendId={setFriendId}
                      imageIndex={i + 1}
                      setCurrentFriendDetail={setCurrentFriendDetail}
                      setNonFriend={setNonFriend}
                    />
                  ))}
            </div>
          </section>
          <section className={styles.rightSection}>
            {conversationSelectedIndex !== -1 || nonFriend ? (
              <>
                <div className={styles.messagesContainer} ref={messageRef}>
                  {!nonFriend &&
                    conversationsList[conversationSelectedIndex].messages?.map(
                      (m, i) => {
                        if (!m.match?.status) {
                          return (
                            <Message
                              message={m.message}
                              own={m.senderId === userId ? true : false}
                              key={i}
                            />
                          );
                        } else {
                          return (
                            <Match
                              status={m.match.status}
                              own={m.senderId === userId ? true : false}
                              key={i}
                              handleMatchStart={handleMatchStart}
                            />
                          );
                        }
                      }
                    )}
                </div>
                <footer>
                  {showOfflinePopup && (
                    <OfflinePopup setShowOfflinePopup={setShowOfflinePopup} />
                  )}
                  <button
                    onClick={() => {
                      if (nonFriend) {
                        createConversation(
                          currentFriendDetail,
                          conversationsList,
                          setConversationsList,
                          setConersationSelectedIndex,
                          setNonFriend,
                          token
                        );
                      } else {
                        startMatch(
                          conversationsList[conversationSelectedIndex]._id,
                          setConversationsList,
                          token
                        );
                        handleDuelSend(friendId);
                      }
                    }}
                  >
                    {!nonFriend ? "Send a Dual" : "Add to friends"}
                  </button>
                  {!nonFriend && (
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
                  )}
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

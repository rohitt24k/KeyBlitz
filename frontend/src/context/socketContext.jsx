import { useNavigate } from "react-router-dom";
import userContext from "./userCotext";
import { io } from "socket.io-client";
import textContext from "./textContext";
import friendContext from "./friendContext";

const { createContext, useEffect, useContext, useState } = require("react");

const socketContext = createContext();

export function SocketProvider({ children }) {
  const { token, userId, ownName } = useContext(userContext);
  const [socket, setSocket] = useState(null);
  const [matchResult, setMatchResult] = useState([]);
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const { setTextToBeTyped, setIsOnline, isCompleted, wpm } =
    useContext(textContext);

  const { friendId } = useContext(friendContext);

  const [, setRoomDetails] = useState({
    isInaRoom: false,
    roomName: "Noice",
    playersInRoom: [
      { name: "Player1" },
      { name: "Player2" },
      { name: "Player3" },
    ],
  });

  const [result] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (socket && isCompleted && friendId) {
      socket.emit("finishResult", { wpm: wpm.current, friendId, token });
      setMatchResult((prev) => {
        prev.push({ userId, wpm: wpm.current, name: ownName });
        return [...prev];
      });
    }
  }, [isCompleted, friendId, ownName, socket, token, userId, wpm]);

  useEffect(() => {
    const newSocket = io("https://keyblitzapi.onrender.com");
    // const newSocket = io("http://192.168.25.201:3001");

    newSocket.on("connect", () => {
      console.log(newSocket.id);
      newSocket.emit("addNewUser", { token });
    });

    setSocket(newSocket);

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on("users", (user) => {
        console.log(user);
      });

      socket.on("roomCreated", (room) => {
        setRoomDetails({
          isInaRoom: true,
          roomName: room.roomName,
          playersInRoom: [],
        });
      });

      socket.on("roomJoined", (room) => {
        setRoomDetails({
          isInaRoom: true,
          roomName: room.roomName,
          playersInRoom: Object.values(room.players),
        });
      });

      socket.on("playersUpdate", (players) => {
        setRoomDetails((prev) => {
          return {
            ...prev,
            playersInRoom: Object.values(players),
          };
        });
      });

      socket.on("startGame", (paragraph) => {
        if (paragraph === null) {
          console.log("player is offline");
          setShowOfflinePopup(true);
        } else {
          console.log("the game will start in 3 2 1...");
          navigate("/challenge");
          setTextToBeTyped(paragraph);
          setIsOnline(true);
          setMatchResult([]);
        }
      });

      socket.on("finishResult", ({ wpm, userId, name }) => {
        setMatchResult((prev) => {
          prev.push({ userId, wpm, name: name });
          return [...prev];
        });
      });
    }
  }, [socket, navigate, setIsOnline, setTextToBeTyped]);

  function handleCreateSubmit(roomName) {
    socket.emit("createRoom", roomName);
  }

  function handleJoinSubmit(roomName) {
    socket.emit("joinRoom", roomName);
  }

  function startGame(friendId) {
    socket.emit("startGame", friendId);
  }

  function handleTextIndexChange(index, friendId) {
    socket.emit("indexChange", { index, friendId });
    console.log("index change of me to: ", friendId);
  }

  return (
    <socketContext.Provider
      value={{
        // roomDetails,
        handleCreateSubmit,
        handleJoinSubmit,
        socketId: socket?.id,
        startGame,
        handleTextIndexChange,
        socket,
        result,
        matchResult,
        showOfflinePopup,
        setShowOfflinePopup,
      }}
    >
      {children}
    </socketContext.Provider>
  );
}

export default socketContext;

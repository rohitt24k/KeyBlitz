import { useNavigate } from "react-router-dom";
import userContext from "./userCotext";
import { io } from "socket.io-client";
import textContext from "./textContext";

const { createContext, useEffect, useContext, useState } = require("react");

const socketContext = createContext();

export function SocketProvider({ children }) {
  const { token } = useContext(userContext);
  const [socket, setSocket] = useState(null);
  const { setTextToBeTyped, setIsOnline, isCompleted, wpm } =
    useContext(textContext);

  const [roomDetails, setRoomDetails] = useState({
    isInaRoom: false,
    roomName: "Noice",
    playersInRoom: [
      { name: "Player1" },
      { name: "Player2" },
      { name: "Player3" },
    ],
  });

  const [result, setResult] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (socket && isCompleted) {
      socket.emit("finishResult", { wpm, roomName: roomDetails.roomName });
    }
  }, [isCompleted]);

  useEffect(() => {
    const newSocket = io("https://keyblitzapi.onrender.com/");

    newSocket.on("connect", () => {
      console.log(newSocket.id);
      newSocket.emit("addNewUser", { token });
    });

    setSocket(newSocket);

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

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
        console.log("the game will start in 3 2 1...");
        navigate("/challenge");
        setTextToBeTyped(paragraph);
        setIsOnline(true);
      });

      socket.on("finishResult", (playersDetail) => {
        setResult(Object.values(playersDetail));
      });
    }
  }, [socket]);

  function handleCreateSubmit(roomName) {
    socket.emit("createRoom", roomName);
  }

  function handleJoinSubmit(roomName) {
    socket.emit("joinRoom", roomName);
  }

  function startGame() {
    socket.emit("startGame", roomDetails.roomName);
  }

  function handleTextIndexChange(index) {
    socket.emit("indexChange", { index, roomName: roomDetails.roomName });
  }

  return (
    <socketContext.Provider
      value={{
        roomDetails,
        handleCreateSubmit,
        handleJoinSubmit,
        socketId: socket?.id,
        startGame,
        handleTextIndexChange,
        socket,
        result,
      }}
    >
      {children}
    </socketContext.Provider>
  );
}

export default socketContext;

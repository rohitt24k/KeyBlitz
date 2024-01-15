import { useContext, useEffect, useState } from "react";
import styles from "./online.module.css";
import HeaderNav from "../../components/headerNav/headerNav";
import socketContext from "../../context/socketContext";
import { chatStart } from "../../utlis/handleApi";

function PlayerContainer({ name }) {
  return <div className={styles.playerContainer}>{name}</div>;
}

function Online() {
  const [joinValue, setJoinValue] = useState("JOIN ROOM");
  const [createValue, setCreateValue] = useState("CREATE ROOM");

  const {
    roomDetails,
    handleJoinSubmit,
    handleCreateSubmit,
    socketId,
    startGame,
  } = useContext(socketContext);

  useEffect(() => {}, []);

  return (
    <div className={styles.onlineContainer}>
      <HeaderNav />
      <main className={styles.main}>
        <section className={styles.leftSection}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleJoinSubmit(joinValue);
            }}
          >
            <input
              type="text"
              className="h5"
              value={joinValue}
              onClick={(e) => {
                if (e.target.value === "JOIN ROOM") {
                  setJoinValue("");
                }
              }}
              onChange={(e) => {
                setJoinValue(e.target.value);
              }}
              placeholder="JOIN ROOM"
            />
          </form>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateSubmit(createValue);
            }}
          >
            <input
              type="text"
              className="h5"
              value={createValue}
              onClick={(e) => {
                if (e.target.value === "CREATE ROOM") {
                  setCreateValue("");
                }
              }}
              onChange={(e) => {
                setCreateValue(e.target.value);
              }}
              placeholder="CREATE ROOM"
            />
          </form>
          <button
            onClick={() => {
              chatStart();
            }}
          >
            click!
          </button>
        </section>

        {roomDetails?.isInaRoom && (
          <section className={styles.rightSection}>
            <p className="h5">{roomDetails.roomName}</p>
            <div className={styles.playerContainerDiv}>
              {roomDetails.playersInRoom?.map((d, i) => {
                if (d.socketId !== socketId)
                  return <PlayerContainer name={d.name} key={i} />;
                return "";
              })}
            </div>
            <button onClick={startGame}>START</button>
          </section>
        )}
      </main>
    </div>
  );
}

export default Online;

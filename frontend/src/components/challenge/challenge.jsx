import { useContext, useEffect, useRef } from "react";
import MainTyping from "../mainTyping/mainTyping";
import { Car1, Car2 } from "../svgs/car";
import Track from "../svgs/track";
import styles from "./challenge.module.css";
import socketContext from "../../context/socketContext";
import friendContext from "../../context/friendContext";

function Challenge() {
  const carsSvg = useRef(null);
  const { handleTextIndexChange, socket } = useContext(socketContext);
  const { friendId } = useContext(friendContext);

  useEffect(() => {
    if (socket) {
      socket.on("indexChange", ({ index }) => {
        handleOpponentCarMove(index);
      });
    }
  }, [socket]);

  function handleOwnCarMove(index) {
    const start = 14;
    const move = (70 - 14) / 50;
    carsSvg.current.querySelectorAll("svg")[0].style.left = `${
      start + index * move
    }%`;
  }

  function handleOpponentCarMove(index) {
    const start = 9;
    const move = (72 - 9) / 50;
    if (carsSvg.current) {
      carsSvg.current.querySelectorAll("svg")[1].style.left = `${
        start + index * move
      }%`;
    }
  }

  function handleIndex(index) {
    handleTextIndexChange(index, friendId);
  }

  return (
    <div className={styles.challengeContainer}>
      <section className={styles.topSection}>
        <div className={styles.track}>
          <Track />
        </div>
        <div className={styles.car} ref={carsSvg}>
          <Car1 />
          <Car2 />
        </div>
      </section>
      <section>
        <MainTyping
          handleIndex={handleIndex}
          handleOwnCarMove={handleOwnCarMove}
        />
      </section>
    </div>
  );
}

export default Challenge;

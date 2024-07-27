import { useContext } from "react";
import socketContext from "../../context/socketContext";
import HeaderNav from "../headerNav/headerNav";
import ShowResult from "../showResult/showResult";
import styles from "./onlineResult.module.css";

function Rank({ name, wpm, index }) {
  return (
    <div className={styles.rankContainer}>
      <span className={styles.rank}>{index + 1}.</span>
      <span className={styles.name}>{name}</span>
      <span className={styles.wpm}>{wpm}</span>
    </div>
  );
}

function OnlineResult() {
  const { matchResult } = useContext(socketContext);

  // useEffect(() => {
  //   console.log(result);
  // }, [result]);
  return (
    <div className={styles.onlineResultContainer}>
      <HeaderNav />

      {/* {result.map((d) => {
        if (d.wpm >= 0) {
          return <p>{d.wpm}</p>;
        }
        return "";
      })} */}

      <main>
        <section className={styles.normalResult}>
          <ShowResult />
        </section>
        <section className={styles.rightSide}>
          <p className="h5">LeaderBoard</p>
          {matchResult.map((d, i) => (
            <Rank name={d.name} wpm={d.wpm} index={i} key={i} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default OnlineResult;

import { useContext, useEffect } from "react";
import HeaderNav from "../headerNav/headerNav";
import ShowResult from "../showResult/showResult";
import styles from "./onlineResult.module.css";
import socketContext from "../../context/socketContext";

function OnlineResult() {
  const { result } = useContext(socketContext);
  useEffect(() => {
    console.log(result);
  }, [result]);
  return (
    <div className={styles.onlineResultContainer}>
      <HeaderNav />

      {result.map((d) => {
        if (d.wpm >= 0) {
          return <p>{d.wpm}</p>;
        }
        return "";
      })}

      <section className={styles.normalResult}>
        <ShowResult />
      </section>
    </div>
  );
}

export default OnlineResult;

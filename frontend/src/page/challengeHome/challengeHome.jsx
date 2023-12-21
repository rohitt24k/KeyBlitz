import { useContext } from "react";
import Challenge from "../../components/challenge/challenge";
import styles from "./challengeHome.module.css";
import textContext from "../../context/textContext";
import OnlineResult from "../../components/onlineResult/onlineResult";

function ChallengeHome() {
  const { isCompleted } = useContext(textContext);
  return (
    <div className={styles.challengeHomeContainer}>
      {isCompleted ? <OnlineResult /> : <Challenge />}
    </div>
  );
}

export default ChallengeHome;

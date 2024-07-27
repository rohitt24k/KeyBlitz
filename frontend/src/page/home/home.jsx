import { useContext } from "react";
import HeaderNav from "../../components/headerNav/headerNav";
import MainTyping from "../../components/mainTyping/mainTyping";
import styles from "./home.module.css";
import textContext from "../../context/textContext";
import ShowResult from "../../components/showResult/showResult";

function Home() {
  const { isCompleted } = useContext(textContext);
  return (
    <div className={styles.homeContainer}>
      <HeaderNav />
      <main>{isCompleted ? <ShowResult /> : <MainTyping />}</main>
    </div>
  );
}

export default Home;

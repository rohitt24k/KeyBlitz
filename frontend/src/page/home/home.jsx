import { useContext, useEffect, useState } from "react";
import HeaderNav from "../../components/headerNav/headerNav";
import MainTyping from "../../components/mainTyping/mainTyping";
import styles from "./home.module.css";
import { useNavigate } from "react-router-dom";
import textContext from "../../context/textContext";
import ShowResult from "../../components/showResult/showResult";

function Home() {
  const { isCompleted } = useContext(textContext);

  // useEffect(() => {
  //   if (!userId) {
  //     let x = document.cookie;

  //     if (x) {
  //       setUserId(true);
  //     } else {
  //       navigate("/login");
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   console.log("home renders");
  // }, []);
  return (
    <div className={styles.homeContainer}>
      <HeaderNav />
      <main>{isCompleted ? <ShowResult /> : <MainTyping />}</main>
    </div>
  );
}

export default Home;

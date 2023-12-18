import { useState } from "react";
import styles from "./typedText.module.css";

function TypedText({ correct, incorrect }) {
  const [data, setData] = useState(correct);

  // console.log(`${correct}  ${incorrect}`);

  return (
    <div
      className={`${styles.typedTextContainer} ${
        correct === incorrect ? "" : styles.wordErr
      }`}
      onMouseEnter={() => {
        setData(incorrect);
      }}
      onMouseLeave={() => {
        setData(correct);
      }}
    >
      {data.split("").map((c, i) => (
        <span className={correct[i] === incorrect[i] ? "" : styles.err} key={i}>
          {c}
        </span>
      ))}
    </div>
  );
}

export default TypedText;

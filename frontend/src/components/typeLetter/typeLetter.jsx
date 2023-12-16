import styles from "./typeLetter.module.css";

function TypeLetter({ word }) {
  return (
    <div className={`${styles.typeLetterContainer}`}>
      <div></div>
      {word.split("").map((l, i) => (
        <span key={i} className="n">
          {l}
        </span>
      ))}
    </div>
  );
}

export default TypeLetter;

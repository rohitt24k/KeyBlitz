import styles from "./showResult.module.css";
import ChartComponent from "../chart/chart";
import { useContext, useMemo } from "react";
import TypedText from "./typedText/typedText";
import textContext from "../../context/textContext";
import { useNavigate } from "react-router-dom";

function ShowResult() {
  const {
    changeTextToBeTyped,
    finalParagraphTypedByUser,
    textToBeTyped,
    typeSpeedData,
    typeErrorData,
    setIsCompleted,
    getTimeDifferences,
    wpm,
    isOnline,
  } = useContext(textContext);

  const textData = textToBeTyped.split(" ");
  const navigate = useNavigate();

  // function setClipboard(data) {
  //   const jsonString = JSON.stringify(data);
  //   const textToCopy = `JSON:${jsonString}`;

  //   navigator.clipboard.writeText(textToCopy).then(
  //     () => {
  //       console.log("Data successfully copied to clipboard!");
  //     },
  //     (error) => {
  //       console.error("Unable to copy data to clipboard:", error);
  //     }
  //   );
  // }

  // Function to calculate final WPM
  function calculateFinalWPM(timeStamps, textData, typeErrorData) {
    const errorCount = typeErrorData.current.filter((d) => d).length;
    const totalTime =
      (timeStamps[timeStamps.length - 1] - timeStamps[0]) / 60000;

    return Math.round((textData.length - errorCount) / totalTime);
  }

  // Calculate final WPM

  wpm.current = calculateFinalWPM(
    typeSpeedData.current,
    textData,
    typeErrorData
  );

  const correctText = useMemo(
    () => textToBeTyped.trim().split(" "),
    [textToBeTyped]
  );
  // const incorrectText = useMemo(
  //   () => finalParagraphTypedByUser.current.trim().split(" "),
  //   [finalParagraphTypedByUser.current]
  // );

  // console.log("to be typed final :", textToBeTyped);

  // console.log("this is the final typed :", finalParagraphTypedByUser.current);

  // console.log("tezttobe typed normal");
  return (
    <div className={styles.showResultContainer}>
      <section className={styles.leftSide}>
        <h1>{wpm.current}</h1>
        <p className="h4">wpm</p>
        <div>
          <h1>95</h1>
          <p className="h4">%</p>
        </div>
        <p className="h4">acc.</p>
      </section>
      <div className={styles.rightSide}>
        <main>
          <ChartComponent
            data={getTimeDifferences(typeSpeedData.current, textData)}
          />
        </main>
        <section>
          {correctText.map((c, i) => (
            <TypedText
              correct={c}
              incorrect={finalParagraphTypedByUser.current[i]}
              key={i}
            />
          ))}
        </section>
        {!isOnline && (
          <div className={styles.nextButton}>
            <button
              className={`${styles.nextButton}`}
              onClick={() => {
                setIsCompleted(false);
                changeTextToBeTyped(50);
              }}
            >
              next
            </button>
            {/* <button
              onClick={() => {
                navigate("/aichat");
              }}
            >
              Analyse
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowResult;

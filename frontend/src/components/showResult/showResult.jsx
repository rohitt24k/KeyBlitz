import styles from "./showResult.module.css";
import ChartComponent from "../chart/chart";
import { useCallback, useEffect, useMemo } from "react";
import TypedText from "./typedText/typedText";
import { sendData } from "../../utlis/handleApi";

function ShowResult({
  finalParagraph,
  textToBeTyped,
  typeSpeedData,
  textData,
  typeErrorData,
  errors,
  setNext,
  setIsCompleted,
}) {
  // Function to calculate time differences for each word
  function getTimeDifferences(timestamps, textData) {
    const wordLenData = textData.map((w) => w.length);

    // Calculate average word length
    const averageWordLen =
      wordLenData.reduce((a, b) => a + b, 0) / wordLenData.length;

    const timeDifferences = [];

    // Calculate time differences between consecutive words
    for (let i = 0; i < timestamps.length - 1; i++) {
      let diff = (timestamps[i + 1] - timestamps[i]) / 60000; // Convert to minutes
      timeDifferences.push(diff.toFixed(2));
    }

    const eachWordSpeed = [];

    // Calculate speed for each word
    for (let i = 0; i < timeDifferences.length; i++) {
      eachWordSpeed.push(
        Math.round(wordLenData[i] / averageWordLen / timeDifferences[i])
      );
    }

    return eachWordSpeed;
  }

  function setClipboard(data) {
    const jsonString = JSON.stringify(data);
    const textToCopy = `JSON:${jsonString}`;

    navigator.clipboard.writeText(textToCopy).then(
      () => {
        console.log("Data successfully copied to clipboard!");
      },
      (error) => {
        console.error("Unable to copy data to clipboard:", error);
      }
    );
  }

  // Function to calculate final WPM
  function calculateFinalWPM(timeStamps, textData, typeErrorData) {
    const errorCount = typeErrorData.current.filter((d) => d).length;
    const totalTime =
      (timeStamps[timeStamps.length - 1] - timeStamps[0]) / 60000;

    return Math.round((textData.length - errorCount) / totalTime);
  }

  // Get the array of word speeds
  const eachWordSpeed = getTimeDifferences(typeSpeedData.current, textData);
  // console.log(eachWordSpeed);

  // Calculate final WPM
  const finalWPM = calculateFinalWPM(
    typeSpeedData.current,
    textData,
    typeErrorData
  );

  const copyData = {
    textToBeTyped,
    errors,
    finalParagraph,
    wpm: finalWPM,
  };

  const correctText = useMemo(() => textToBeTyped.split(" "), [textToBeTyped]);
  const incorrectText = useMemo(
    () => finalParagraph.split(" "),
    [finalParagraph]
  );

  // useEffect(() => {
  // }, []);
  useEffect(() => {
    console.log("tezttobe typed");
    sendData(copyData);
  }, [textToBeTyped]);

  return (
    <div className={styles.showResultContainer}>
      <section className={styles.leftSide}>
        <h1>{finalWPM}</h1>
        <p className="h4">wpm</p>
        <div>
          <h1>95</h1>
          <p className="h4">%</p>
        </div>
        <p
          className="h4"
          onClick={() => {
            setClipboard(copyData);
            console.log("clicked");
          }}
        >
          acc.
        </p>
      </section>
      <div className={styles.rightSide}>
        <main>
          <ChartComponent data={eachWordSpeed} />
        </main>
        <section>
          {correctText.map((c, i) => (
            <TypedText correct={c} incorrect={incorrectText[i]} key={i} />
          ))}
        </section>
        <div className={styles.nextButton}>
          <button
            className={`${styles.nextButton}`}
            onClick={() => {
              setNext((prev) => !prev);
              setIsCompleted(false);
            }}
          >
            next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowResult;

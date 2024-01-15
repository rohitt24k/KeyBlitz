import { sendData } from "../utlis/handleApi";
import userContext from "./userCotext";
// import newTextData from "../texts/output";
import newTextData from "../texts/oxford3000";

const {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} = require("react");

const textContext = createContext();

export function TextProvider({ children }) {
  //all the states
  const [textToBeTyped, setTextToBeTyped] = useState(
    // getRandomParagraph(data, 50)
    getRandomParagraphFromArray(newTextData, 50)
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [timePassed, setTimePassed] = useState(0);

  const [isOnline, setIsOnline] = useState(false);

  const { token } = useContext(userContext);
  //all the useEffects
  const typeSpeedData = useRef([]);
  const typeErrorData = useRef([]);
  const charErrorByUser = useRef([]);
  const finalParagraphTypedByUser = useRef("");
  const wpm = useRef(0);

  function getRandomParagraph(longParagraph, length) {
    // Split the long paragraph into an array of words
    const words = longParagraph.split(/\s+/);

    // Check if the paragraph has fewer than 50 words
    if (words.length <= 50) {
      return longParagraph; // Return the entire paragraph
    }

    // Choose a random starting index for the 50-word excerpt
    const startIndex = Math.floor(Math.random() * (words.length - length));

    // Extract a 50-word excerpt
    const excerpt = words.slice(startIndex, startIndex + length).join(" ");

    return excerpt;
  }

  function getRandomParagraphFromArray(array, length) {
    const len = array.length - length;
    const random = Math.floor(len * Math.random());
    const newarr = array.slice(random, random + length);
    return newarr.join(" ");
  }

  function changeTextToBeTyped(length) {
    // setTextToBeTyped(getRandomParagraph(data, length));
    setTextToBeTyped(getRandomParagraphFromArray(newTextData, length));
  }

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

    // console.log("averagelen: ", averageWordLen);

    // console.log(timeDifferences);

    const eachWordSpeed = [];

    // Calculate speed for each word
    for (let i = 0; i < timeDifferences.length; i++) {
      eachWordSpeed.push(
        Math.round(wordLenData[i] / averageWordLen / timeDifferences[i])
      );
    }

    return eachWordSpeed;
  }

  useEffect(() => {
    //setting back , resetting

    setTimePassed(0);
    typeSpeedData.current = [];
    typeErrorData.current = [];
    charErrorByUser.current = [];
    finalParagraphTypedByUser.current = [];
    setTimePassed(0);
    setIsCompleted(false);
    wpm.current = 0;
  }, [textToBeTyped]);

  useEffect(() => {
    if (isCompleted) {
      const newArr = charErrorByUser.current.map((e) => {
        return [
          e.correctCharacter,
          e.typedCharacter,
          e.position.wordIndex,
          e.position.charIndex,
          e.errorType,
        ];
      });
      console.log(newArr);

      const copyData = {
        textToBeTyped,
        errors: newArr,
        finalParagraphTypedByUser: finalParagraphTypedByUser.current.join(" "),
        wpm: wpm.current,
      };
      sendData(copyData, token);
      // console.log(typeErrorData);
    }
  }, [isCompleted]);

  return (
    <textContext.Provider
      value={{
        textToBeTyped,
        changeTextToBeTyped,
        typeSpeedData,
        typeErrorData,
        charErrorByUser,
        finalParagraphTypedByUser,
        timePassed,
        setTimePassed,
        isCompleted,
        setIsCompleted,
        getTimeDifferences,
        setTextToBeTyped,
        wpm,
        isOnline,
        setIsOnline,
      }}
    >
      {children}
    </textContext.Provider>
  );
}

export default textContext;

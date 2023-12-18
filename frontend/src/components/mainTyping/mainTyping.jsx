import { useContext, useEffect, useRef, useState } from "react";
import styles from "./mainTyping.module.css";
import TypeLetter from "../typeLetter/typeLetter";
import ShowResult from "../showResult/showResult";
import textContext from "../../context/textContext";

function MainTyping({ setNext }) {
  const {
    textToBeTyped,
    typeSpeedData,
    typeErrorData,
    charErrorByUser,
    finalParagraphTypedByUser,
    timePassed,
    setTimePassed,
    setIsCompleted,
  } = useContext(textContext);

  //declaring stated
  const [userInput, setUserInput] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isBlur, setIsBlur] = useState(false);
  const [typeStart, setTypeStart] = useState(false);

  //declaring reference
  const prevUserInputLen = useRef(0); // to store previous input for finding whether BACKSPACE is clicked or not
  const prevTextIndex = useRef(null); // to store previous index
  const inputElem = useRef(null); // reference to the input BOX
  const elem = useRef(null); // for the div that contains all the word
  const isBackspace = useRef(false);

  const textData = textToBeTyped.split(" ");

  // useEffect(() => {
  //   if (!isCompleted) {
  //     setTypeStart(false);
  //     setTimePassed(0);
  //     setTextIndex(0);
  //     setUserInput("");
  //     prevUserInputLen.current = null;
  //     prevTextIndex.current = null;
  //     incorrectWord.current = null;
  //     typeSpeedData.current = [];
  //     typeErrorData.current = [];
  //     charErrorByUser.current = [];
  //     finalParagraphTypedByUser.current = "";
  //   }
  // }, [isCompleted]);

  useEffect(() => {
    // Focus on the input element when the component mounts
    inputElem.current?.focus();
  }, []);

  useEffect(() => {
    //changing className for the cursor
    //remove the classname from the previous div
    if (textIndex !== 0) {
      let DOMcharTypedDiv =
        elem.current.children[textIndex - 1].querySelector("div");
      DOMcharTypedDiv.classList.remove("cursorActive");
    }
    let DOMcharTypedDiv =
      elem.current.children[textIndex + 1]?.querySelector("div");
    DOMcharTypedDiv?.classList.remove("cursorActive");

    DOMcharTypedDiv = elem.current?.children[textIndex];
    let cursor = DOMcharTypedDiv?.querySelector("div");
    cursor?.classList.add("cursorActive");
  }, [textIndex]);

  useEffect(() => {
    let intervalId;

    // Start the timer when typing begins
    if (typeStart) {
      intervalId = setInterval(() => {
        setTimePassed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    // Stop the timer on blur or when typing is completed
    if (isBlur || textIndex === textData.length) {
      clearInterval(intervalId);
    }

    // Cleanup function to clear the interval
    return () => {
      clearInterval(intervalId);
    };
  }, [isBlur, typeStart]);

  function handleEmptyBackspace() {
    // console.log("this is an empty backspace");

    if (textIndex > 0 && typeErrorData.current[textIndex - 1] !== 0) {
      setTextIndex(textIndex - 1);
      const prevInput =
        finalParagraphTypedByUser.current.split(" ")[textIndex - 1];
      setUserInput(prevInput);
      // console.log(`${prevInput.length}  ${prevInput}`);

      let DOMcharTypedDiv = elem.current.children[textIndex - 1];
      DOMcharTypedDiv.classList?.remove("wordError");
      finalParagraphTypedByUser.current =
        finalParagraphTypedByUser.current.split(" ").slice(0, -2).join(" ") +
        " ";
      // console.log(finalParagraphTypedByUser.current);
    }
  }

  function handleCtrlBackspace() {
    // console.log("this is a CTRL+backspace");

    let DOMcharTypedDiv = elem.current.children[textIndex];
    let DOMcharTyped;
    DOMcharTyped = DOMcharTypedDiv.querySelectorAll("span");

    Array.from(DOMcharTyped).forEach((sp) => {
      if (sp.classList.contains("error")) {
        DOMcharTypedDiv.removeChild(sp);
      } else {
        sp.className = "n";
        sp.style.color = "var(--secondary-color)";
      }
    });

    let cursor = DOMcharTypedDiv.querySelector("div");
    cursor.style.transform = `translateX(0px)`;
  }

  function handleBackspace() {
    // console.log("this is a normal Backspace");

    let DOMcharTypedDiv = elem.current.children[textIndex];
    let DOMcharTyped;

    DOMcharTyped =
      DOMcharTypedDiv.querySelectorAll("span")[userInput.length - 1];
    // console.log(DOMcharTypedDiv);

    // console.log(DOMcharTyped);

    if (DOMcharTyped?.classList.contains("error")) {
      DOMcharTypedDiv.removeChild(DOMcharTyped);
    } else {
      if (DOMcharTyped?.classList.contains("e")) {
        DOMcharTyped.classList.remove("e");
      }
      DOMcharTyped.style.color = "var(--secondary-color)";
      DOMcharTyped.classList.add("n");
    }

    if (userInput.length === 1) {
      let cursor = DOMcharTypedDiv.querySelector("div");
      cursor.style.transform = `translateX(0px)`;
    } else {
      let width =
        DOMcharTypedDiv.querySelector("span").getBoundingClientRect().width;
      let cursor = DOMcharTypedDiv.querySelector("div");
      width = width * (userInput.length - 1);
      cursor.style.transform = `translateX(${width}px)`;
    }
  }

  useEffect(() => {
    if (userInput !== "") {
      const typedChar = userInput[userInput.length - 1];
      let DOMcharTypedDiv = elem.current.children[textIndex];
      let DOMcharTyped =
        DOMcharTypedDiv.querySelectorAll("span")[userInput.length - 1];

      if (!DOMcharTyped?.classList.contains("error")) {
        if (
          DOMcharTypedDiv.querySelectorAll("span").length < userInput.length
        ) {
          //wrong character typed longer that actual

          const span = document.createElement("span");
          span.innerText = typedChar;
          span.classList.add("error");
          span.style.color = "var(--error-color)";
          DOMcharTypedDiv.appendChild(span);

          //adding the error data
          const error = {
            correctCharacter: " ",
            typedCharacter: typedChar,
            position: { wordIndex: textIndex, charIndex: userInput.length },
            errorType: "addition",
          };
          charErrorByUser.current.push(error);
        } else {
          //correct character is typed

          const charTyped = DOMcharTyped?.innerText;

          if (charTyped === typedChar) {
            DOMcharTyped.style.color = "var(--primary-color)";
            DOMcharTyped.classList.remove("n");

            // Check if typing is completed

            if (
              textIndex === textData.length - 1 &&
              Array.from(DOMcharTypedDiv.querySelectorAll("span")).length ===
                userInput.length
            ) {
              finalParagraphTypedByUser.current =
                finalParagraphTypedByUser.current + userInput;

              typeSpeedData.current.push(Date.now());
              setTypeStart(false);
              setIsCompleted(true);
            }
          } else {
            //incorrect character is typed

            DOMcharTyped.classList.add("e");
            DOMcharTyped.classList.remove("n");
            DOMcharTyped.style.color = "var(--error-color)";

            //adding the error data
            const error = {
              correctCharacter: charTyped,
              typedCharacter: typedChar,
              position: { wordIndex: textIndex, charIndex: userInput.length },
              errorType: "Substitution",
            };
            charErrorByUser.current.push(error);
          }
        }
      }

      let width =
        DOMcharTypedDiv.querySelector("span").getBoundingClientRect().width;
      let cursor = DOMcharTypedDiv.querySelector("div");
      width = width * userInput.length;

      cursor.style.transform = `translateX(${width}px)`;
    }

    isBackspace.current = false;

    //update the previous value
    prevUserInputLen.current = userInput.length;

    // Check for the end of typing
    if (textIndex === textData.length) {
      setTypeStart(false);
      setIsCompleted(true);
    }
  }, [userInput]);

  return (
    <div
      className={`${styles.mainTypingContainer} ${
        isBlur && styles.mainTypingContainer_blur
      }`}
    >
      <section>
        <span>{textIndex}</span>
        <div className={`${styles.blurText}`}>Click to unblur</div>
        <span>{`${(timePassed / 60).toFixed(0)}:${timePassed % 60}`}</span>
      </section>
      <div className={`${styles.textContainer} h5`} ref={elem}>
        {textData.map((t, i) => (
          <TypeLetter word={t} key={i} />
        ))}
      </div>
      <div>
        <input
          type="text"
          value={userInput}
          className={styles.inputBox}
          ref={inputElem}
          onFocus={() => {
            setIsBlur(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && userInput === "") {
              // isBackspace.current = true;
              handleEmptyBackspace();
            }
            // if ((e.ctrlKey || e.metaKey) && e.key === "Backspace") {
            //   handleCtrlBackspace();
            //   console.log("whatttt");
            // }
          }}
          onBlur={(e) => {
            setIsBlur(true);
          }}
          onChange={(e) => {
            if (prevUserInputLen.current === e.target.value.length) {
              //nothing has changed i dont know why
              console.log("nothing has changed i dont know why");
            } else if (prevUserInputLen.current < e.target.value.length) {
              //userInput length has increased
              // console.log("userInput length has increased");

              if (textIndex === 0 && userInput === "") {
                setTypeStart(true);
                typeSpeedData.current.push(Date.now());
              }
              if (e.nativeEvent.data === " " && userInput === "") {
                // Do nothing
              } else if (e.nativeEvent.data === " ") {
                //space is being clicked

                let DOMcharTypedDiv = elem.current.children[textIndex];
                let containsError = 0;
                Array.from(DOMcharTypedDiv.children).forEach((c) => {
                  if (
                    c.classList.contains("e") ||
                    c.classList.contains("error") ||
                    c.classList.contains("n")
                  ) {
                    containsError++;
                  }
                });

                typeErrorData.current.push(containsError);
                if (containsError) {
                  DOMcharTypedDiv.classList.add("wordError");
                }

                finalParagraphTypedByUser.current =
                  finalParagraphTypedByUser.current + userInput + " ";
                setTextIndex(textIndex + 1);

                // console.log(finalParagraphTypedByUser.current);

                typeSpeedData.current.push(Date.now());
                setUserInput("");
              } else {
                //new Char is being typed
                setUserInput(e.target.value);
              }
            } else if (prevUserInputLen.current > e.target.value.length) {
              //userInput length has decreased || backspace is being clicked
              // console.log("userInput length has decreased");
              if (e.target.value === "") {
                // isBackspace.current = true;
                handleCtrlBackspace();
                // console.log("CTRL + backspace is clicked");
              } else {
                // console.log("Backspace");
                handleBackspace();
              }
              setUserInput(e.target.value);
            }
          }}
        />
      </div>
    </div>
  );
}

export default MainTyping;

import { useEffect, useRef, useState } from "react";
import styles from "./mainTyping.module.css";
import TypeLetter from "../typeLetter/typeLetter";
import ShowResult from "../showResult/showResult";

// const textToBeTyped =
//   "Beware when using Copilot for bing searches. I asked Copilot to find me a youtube video summariser and it displayed links and summaries to a few different websites. I worked my way down the list looking at each link. One of the links flagged up my antivirus and I had to expend some time to deal with a repeated virus attack from the website that Copilot suggested.";

//  I asked Copilot to find me a youtube video summariser and it displayed links and summaries to a few different websites. I worked my way down the list looking at each link. One of the links flagged up my antivirus and I had to expend some time to deal with a repeated virus attack from the website that Copilot suggested.

function MainTyping({ textToBeTyped, setNext }) {
  //declaring stated
  const [userInput, setUserInput] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [timePassed, setTimePassed] = useState(0);
  const [isBlur, setIsBlur] = useState(false);
  const [typeStart, setTypeStart] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  //declaring reference
  const prevUserInputLen = useRef(null); // to store previous input for finding whether BACKSPACE is clicked or not
  const prevTextIndex = useRef(null); // to store previous index
  const inputElem = useRef(null); // reference to the input BOX
  const incorrectWord = useRef(null); // checking error to add underline to the mistaken word
  const elem = useRef(null); // for the div that contains all the word
  const typeSpeedData = useRef([]);
  const typeErrorData = useRef([]);
  const charErrorByUser = useRef([]);
  const finalParagraphTypedByUser = useRef("");

  const textData = textToBeTyped.split(" ");

  useEffect(() => {
    // Focus on the input element when the component mounts
    inputElem.current?.focus();
    console.log("hey");
  }, [textToBeTyped]);

  useEffect(() => {
    //remove the classname from the previous div
    if (textIndex !== 0) {
      let DOMcharTypedDiv =
        elem.current.children[textIndex - 1].querySelector("div");
      DOMcharTypedDiv.classList.remove("cursorActive");
    }

    let DOMcharTypedDiv = elem.current?.children[textIndex];
    let cursor = DOMcharTypedDiv?.querySelector("div");
    cursor?.classList.add("cursorActive");

    // let width = DOMcharTypedDiv.clientWidth;
    // width = width / 2;
    // console.log(width);

    // // width = width ;
    // cursor.style.transform = `translateX(${width}px)`;

    // class="typeLetter_cursor__hpbt3"
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

  useEffect(() => {
    let isBackspace = false;

    // Check if backspace is pressed
    if (
      prevTextIndex.current === textIndex &&
      prevUserInputLen.current > userInput.length
    ) {
      isBackspace = true;
    }

    const checkWordCorrect = prevTextIndex.current !== textIndex;

    // Check if the previous word contains an error
    if (checkWordCorrect && textIndex !== 0) {
      let DOMcharTypedDiv = elem.current.children[prevTextIndex.current];
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
        console.log("contains error");
        incorrectWord.current = incorrectWord.current + 1;
        DOMcharTypedDiv.classList.add("wordError");
      }
    }

    // console.log(elem.current.children[1].querySelectorAll("span").length);

    if (userInput !== "" || isBackspace) {
      const typedChar = userInput[userInput.length - 1];
      let DOMcharTypedDiv = elem.current.children[textIndex];
      let DOMcharTyped =
        DOMcharTypedDiv.querySelectorAll("span")[userInput.length - 1];

      if (!isBackspace) {
        if (
          DOMcharTypedDiv.querySelectorAll("span").length < userInput.length
        ) {
          //wrong character typed longer that actual

          const span = document.createElement("span");
          span.innerText = typedChar;
          span.classList.add("error");
          span.style.color = "var(--error-color)";
          DOMcharTypedDiv.appendChild(span);

          let width =
            DOMcharTypedDiv.querySelector("span").getBoundingClientRect().width;
          let cursor = DOMcharTypedDiv.querySelector("div");
          width = width * userInput.length;
          cursor.style.transform = `translateX(${width}px)`;

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

            let width =
              DOMcharTypedDiv.querySelector("span").getBoundingClientRect()
                .width;
            let cursor = DOMcharTypedDiv.querySelector("div");
            width = width * userInput.length;
            cursor.style.transform = `translateX(${width}px)`;

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

            let width =
              DOMcharTypedDiv.querySelector("span").getBoundingClientRect()
                .width;
            let cursor = DOMcharTypedDiv.querySelector("div");
            width = width * userInput.length;
            cursor.style.transform = `translateX(${width}px)`;

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
      } else {
        //backspace is clicked
        DOMcharTyped =
          DOMcharTypedDiv.querySelectorAll("span")[
            prevUserInputLen.current - 1
          ];
        if (DOMcharTyped.classList.contains("error")) {
          DOMcharTypedDiv.removeChild(DOMcharTyped);
        } else {
          if (DOMcharTyped.classList.contains("e")) {
            DOMcharTyped.classList.remove("e");
            DOMcharTyped.classList.add("n");
          }
          DOMcharTyped.style.color = "var(--secondary-color)";
        }

        let width =
          DOMcharTypedDiv.querySelector("span").getBoundingClientRect().width;
        let cursor = DOMcharTypedDiv.querySelector("div");
        width = width * userInput.length;
        cursor.style.transform = `translateX(${width}px)`;
      }
    }

    // Update the previous value
    prevUserInputLen.current = userInput.length;
    prevTextIndex.current = textIndex;

    // Check for the end of typing
    if (textIndex === textData.length) {
      setTypeStart(false);
      setIsCompleted(true);
    }
  }, [userInput]);

  return isCompleted ? (
    <ShowResult
      textToBeTyped={textToBeTyped}
      typeSpeedData={typeSpeedData}
      textData={textData}
      typeErrorData={typeErrorData}
      errors={charErrorByUser.current}
      finalParagraph={finalParagraphTypedByUser.current}
      setNext={setNext}
      setIsCompleted={setIsCompleted}
    />
  ) : (
    <div
      className={`${styles.mainTypingContainer} ${
        isBlur && styles.mainTypingContainer_blur
      }`}
      onClick={() => {
        // inputElem.current.focus();
      }}
    >
      <section>
        <span>{textIndex}</span>
        <div className={`${styles.blurText}`}>Click to unblur</div>
        <span>{`${(timePassed / 60).toFixed(0)}:${timePassed % 60}`}</span>
      </section>
      <div
        className={`${styles.textContainer} h5`}
        ref={elem}
        // onClick={(e) => {
        //   e.stopPropagation(); // Prevent the click event from reaching parent elements
        // }}
      >
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
          onBlur={(e) => {
            setIsBlur(true);
          }}
          onChange={(e) => {
            if (textIndex === 0 && userInput === "") {
              setTypeStart(true);
              typeSpeedData.current.push(Date.now());
            }

            if (e.nativeEvent.data === " " && userInput === "") {
              // Do nothing
            } else if (e.nativeEvent.data === " ") {
              //space is being clicked
              finalParagraphTypedByUser.current =
                finalParagraphTypedByUser.current + userInput + " ";
              setTextIndex(textIndex + 1);
              typeSpeedData.current.push(Date.now());
              setUserInput("");
            } else {
              setUserInput(e.target.value);
            }
          }}
        />
      </div>
    </div>
  );
}

export default MainTyping;

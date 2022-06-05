import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { CHALLENGE_LENGTH, PENALITY } from "../../constants";

function Game() {
  const [counter, setCounter] = useState(0);
  const [Timetaken, setTimeTaken] = useState(0);
  const [time, setTime] = useState();
  const [Challenge, setChallenge] = useState("");
  const [IsDisabled, setIsDisabled] = useState(false);
  const inputRef = useRef(null);
  const [InputField, setInputField] = useState("");
  const [BestTime, setBestTime] = useState(0.0);

  const startGame = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < CHALLENGE_LENGTH; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setChallenge(result);
    setTime(0);
    inputRef.current.focus();
    setIsDisabled(false);
    setInputField("");
  };

  //initilizing game at opening of website
  useLayoutEffect(() => {
    startGame();
    try {
      let UserBestTime = JSON.parse(localStorage.getItem("UserBestTime"));
      if (UserBestTime) {
        setBestTime(UserBestTime);
      }
    } catch (e) {
      localStorage.setItem("UserBestTime", JSON.stringify(0.0));
    }
  }, []);

  useEffect(() => {
    if (!IsDisabled) {
      inputRef.current.focus();
    }
  }, [IsDisabled]);

  const resetData = () => {
    setTime(0);
    setCounter(0);
    startGame();
  };

  const handleTimeTaken = (Timetaken) => {
    const timeinseconds = (Timetaken / 1000).toFixed(3);

    if (BestTime === 0 || timeinseconds < BestTime) {
      setBestTime(timeinseconds);
      localStorage.setItem("UserBestTime", JSON.stringify(timeinseconds));
    }
    setTimeTaken(timeinseconds);
  };

  const handleKey = (e) => {
    if (time === 0) {
      setTime(performance.now());
    }
    if (e.key.toUpperCase() === Challenge[counter]) {
      if (counter === CHALLENGE_LENGTH - 1) {
        const Timetaken = performance.now() - time;
        handleTimeTaken(Timetaken);
        resetData();
      } else {
        setCounter(counter + 1);
      }
    } else {
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false);
      }, PENALITY);
    }
  };

  const handleInputChange = (e) => {
    setInputField(e.target.value);
  };

  return (
    <div className="wrapper">
      <div className="alphabet-container">
        <h1>{Challenge[counter]}</h1>
      </div>
      <div className="stats-container">
        <span>Time: {Timetaken} s </span>
        <span>my best time: {BestTime} s!</span>
      </div>
      {IsDisabled ? <span style={{ color: "red" }}>Incorrect</span> : null}
      <div className="user-input-container">
        <input
          disabled={IsDisabled}
          ref={inputRef}
          onKeyDown={handleKey}
          onChange={handleInputChange}
          value={InputField}
          type="text"
        />
        <button onClick={resetData}>reset</button>
      </div>
    </div>
  );
}

export default Game;

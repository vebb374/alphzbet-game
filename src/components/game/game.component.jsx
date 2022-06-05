import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import "./game.styles.scss";
import { CHALLENGE_LENGTH, PENALITY } from "../../constants";
import { useReward } from "react-rewards";

function Game() {
  //current index of the challenge string
  const [Counter, setCounter] = useState(0);
  //Time taken to complete the Challenge
  const [Timetaken, setTimeTaken] = useState(0);
  const [CurrentTime, setCurrentTime] = useState();
  const [Challenge, setChallenge] = useState([]);
  const [IsDisabled, setIsDisabled] = useState(false);
  const [InputField, setInputField] = useState("");
  const [BestTime, setBestTime] = useState(0.0);

  const inputRef = useRef(null);

  const { reward: confettiReward, isAnimating } = useReward(
    "rewardId",
    "confetti",
    {
      angle: 90,
      spread: 360,
    }
  );

  //function to initialize challenge string and focus on input field
  const startGame = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = [];
    const charactersLength = characters.length;
    for (let i = 0; i < CHALLENGE_LENGTH; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    setChallenge(result);
    setCurrentTime(0);
    inputRef.current.focus();
    setIsDisabled(false);
    setInputField("");
  };

  //initilizing game and retreiving previous best at opening of website
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

  //focus on the input whenever the penality is over
  useEffect(() => {
    if (!IsDisabled) {
      inputRef.current.focus();
    }
  }, [IsDisabled]);

  //function to  reset state values and start a new game
  const resetData = () => {
    setCurrentTime(0);
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
    if (CurrentTime === 0) {
      setCurrentTime(performance.now());
    }
    if (Counter === CHALLENGE_LENGTH) {
      setIsDisabled(true);
    } else if (e.key.toUpperCase() === Challenge[Counter]) {
      if (Counter === CHALLENGE_LENGTH - 1) {
        const Timetaken = performance.now() - CurrentTime;
        handleTimeTaken(Timetaken);
        confettiReward();
        setChallenge((Challenge) => [...Challenge, "Success !"]);
      }
      setCounter(Counter + 1);
    } else {
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false);
      }, PENALITY);
    }
  };

  const handleInputChange = (e) => {
    setInputField(e.target.value.toUpperCase());
  };

  console.log(Challenge);
  return (
    <div className="wrapper">
      <div className="alphabet-container">
        <h1 id="rewardId">{Challenge[Counter]}</h1>
      </div>
      <div className="stats-container">
        <p className="time-taken">Time: {Timetaken} s </p>
        <p>my best time: {BestTime} s!</p>
      </div>
      <span className={"disabled-text" + (IsDisabled ? "" : " invisible")}>
        Incorrect
      </span>
      <div className="user-input-container">
        <input
          className="user-input"
          disabled={IsDisabled}
          ref={inputRef}
          onKeyDown={handleKey}
          onChange={handleInputChange}
          value={InputField}
          type="text"
          placeholder="Type here"
        />
        <button className="reset-button" onClick={resetData}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default Game;

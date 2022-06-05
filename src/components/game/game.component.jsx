import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import "./game.styles.scss";
import { CHALLENGE_LENGTH, PENALITY, CONFETTI_CONFIG } from "../../constants";
import { useReward } from "react-rewards";

function Game() {
  //current index of the challenge string
  const [Counter, setCounter] = useState(0);
  //Time taken to complete the Challenge
  const [Time, setTime] = useState(0);
  const [IsRunning, setIsRunning] = useState(false);
  const [Challenge, setChallenge] = useState([]);
  const [IsDisabled, setIsDisabled] = useState(false);
  const [InputField, setInputField] = useState("");
  const [BestTime, setBestTime] = useState(0.0);

  const inputRef = useRef(null);

  const { reward: confettiReward } = useReward(
    "rewardId",
    "confetti",
    CONFETTI_CONFIG
  );

  useEffect(() => {
    let interval;
    if (IsRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!IsRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [IsRunning]);

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
      localStorage.setItem("UserBestTime", JSON.stringify(0));
    }
  }, []);

  //focus on the input whenever the penality is over
  useEffect(() => {
    if (!IsDisabled) {
      inputRef.current.focus();
    }
  }, [IsDisabled]);

  useEffect(() => {
    if (Counter === CHALLENGE_LENGTH) {
      setIsDisabled(true);
    }
  }, [Counter]);

  useEffect(() => {
    if (Challenge[Challenge.length - 1] === "Success !" && !IsRunning) {
      confettiReward();
    }
  }, [Challenge, IsRunning]);

  //function to  reset state values and start a new game
  const resetData = () => {
    setIsRunning(false);
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
  };

  const handleKey = (e) => {
    if (!IsDisabled) {
      setTime(0);
      setIsRunning(true);
    }

    if (e.key.toUpperCase() === Challenge[Counter]) {
      if (Counter === CHALLENGE_LENGTH - 1) {
        setIsRunning(false);
        handleTimeTaken(Time);
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

  return (
    <div className="wrapper">
      <div id="rewardId" className="alphabet-container">
        <h1>{Challenge[Counter]}</h1>
      </div>
      <div className="stats-container">
        <p className="time-taken">
          <span>
            time: {("0" + Math.floor((Time / 60000) % 60)).slice(-2)}:
          </span>
          <span>{("0" + Math.floor((Time / 1000) % 60)).slice(-2)}:</span>
          <span>{("0" + ((Time / 10) % 100)).slice(-2)} s</span>
        </p>
        <p>my best Time: {BestTime} s!</p>
      </div>
      <span
        className={
          "disabled-text" + (IsDisabled && IsRunning ? "" : " invisible")
        }
      >
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

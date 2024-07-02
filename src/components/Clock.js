import React, { useState, useEffect } from "react";
import Segment from "./Segment";
import "../assets/Clock.css";

function Clock({ size }) {
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  }

  return (
    <div className="clock">
      <Segment
        style={{ left: "0px" }}
        size={size}
        num={parseInt(time.hours[0])}
      ></Segment>
      <Segment
        style={{ left: String(size * 10) + "px" }}
        size={size}
        num={parseInt(time.hours[1])}
      ></Segment>
      <div
        className="clock-up clock-left"
        style={{
          width: size * 2 + "px",
          height: size * 2 + "px",
          top: size * 2.5 + "px",
          left: size * 20 + "px",
        }}
      ></div>
      <div
        className="clock-down clock-left"
        style={{
          width: size * 2 + "px",
          height: size * 2 + "px",
          top: size * 8.5 + "px",
          left: size * 20 + "px",
        }}
      ></div>
      <Segment
        style={{ left: String(size * 24) + "px" }}
        size={size}
        num={parseInt(time.minutes[0])}
      ></Segment>
      <Segment
        style={{ left: String(size * 34) + "px" }}
        size={size}
        num={parseInt(time.minutes[1])}
      ></Segment>
      <div
        className="clock-up clock-right"
        style={{
          width: size * 2 + "px",
          height: size * 2 + "px",
          top: size * 2.5 + "px",
          left: size * 44 + "px",
        }}
      ></div>
      <div
        className="clock-down clock-right"
        style={{
          width: size * 2 + "px",
          height: size * 2 + "px",
          top: size * 8.5 + "px",
          left: size * 44 + "px",
        }}
      ></div>
      <Segment
        style={{ left: String(size * 48) + "px" }}
        size={size}
        num={parseInt(time.seconds[0])}
      ></Segment>
      <Segment
        style={{ left: String(size * 58) + "px" }}
        size={size}
        num={parseInt(time.seconds[1])}
      ></Segment>
    </div>
  );
}

export default Clock;

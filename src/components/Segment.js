import React from "react";
import "../assets/Segment.css";

function Segment({ style, size, num = 0 }) {
  const segment = [
    [1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 0, 0, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [1, 0, 1, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 1],
  ];

  return (
    <div className="segment" style={style}>
      <div
        className={segment[num][0] === 0 ? "segment0" : "segment0 segment-on"}
        style={{
          width: size * 5 + "px",
          height: size + "px",
          left: size + "px",
        }}
      ></div>
      <div
        className={segment[num][1] === 0 ? "segment1" : "segment1 segment-on"}
        style={{
          width: size + "px",
          height: size * 5 + "px",
          top: size + "px",
          left: size * 6 + "px",
        }}
      ></div>
      <div
        className={segment[num][2] === 0 ? "segment2" : "segment2 segment-on"}
        style={{
          width: size + "px",
          height: size * 5 + "px",
          top: size * 7 + "px",
          left: size * 6 + "px",
        }}
      ></div>
      <div
        className={segment[num][3] === 0 ? "segment3" : "segment3 segment-on"}
        style={{
          width: size * 5 + "px",
          height: size + "px",
          top: size * 12 + "px",
          left: size + "px",
        }}
      ></div>
      <div
        className={segment[num][4] === 0 ? "segment4" : "segment4 segment-on"}
        style={{
          width: size + "px",
          height: size * 5 + "px",
          top: size * 7 + "px",
        }}
      ></div>
      <div
        className={segment[num][5] === 0 ? "segment5" : "segment5 segment-on"}
        style={{
          width: size + "px",
          height: size * 5 + "px",
          top: size + "px",
        }}
      ></div>
      <div
        className={segment[num][6] === 0 ? "segment6" : "segment6 segment-on"}
        style={{
          width: size * 5 + "px",
          height: size + "px",
          top: size * 6 + "px",
          left: size + "px",
        }}
      ></div>
    </div>
  );
}

export default Segment;

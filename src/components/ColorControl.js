// Modal.js
import React from "react";
import "../assets/ColorControl.css";

const ColorControl = ({
  height = "30px",
  width = "30px",
  value = "#000000",
  borderRadius = "50%",
  onChange,
}) => {
  return (
    <div
      className="div-color"
      style={{
        height: height,
        width: width,
        borderRadius: borderRadius,
        border: "3px solid white",
      }}
    >
      <input
        className="color-control"
        type="color"
        value={value}
        onChange={onChange}
      ></input>
    </div>
  );
};

export default ColorControl;

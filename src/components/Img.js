import React from "react";
import "../assets/Img.css";

const Img = ({ children, props }) => {
  const dynamicStyle = props;

  return (
    <div className={dynamicStyle.img} style={dynamicStyle}>
      {children}
    </div>
  );
};

export default Img;

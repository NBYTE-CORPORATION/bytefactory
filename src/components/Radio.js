import React from "react";
import "../assets/Radio.css";

function Radio({ list = {}, fn = {}, value = {}, style = {} }) {
  const handleChange = (event) => {
    fn.setSelectedValue(event.target.value);
    fn.change(value.change);
  };

  const drowRadio = function () {
    if (list.length === 0) {
      return undefined;
    }

    let radio = list.map((item, index) => {
      return (
        <div className="div_radio1" key={item.value + "" + index}>
          <label>
            <input
              type="radio"
              value={item.value}
              checked={value.selectedValue === item.value}
              onChange={handleChange}
            />
            {"  " + item.text}
          </label>
        </div>
      );
    });
    return radio;
  };

  return (
    <div className="div_radio" style={style}>
      {drowRadio()}
    </div>
  );
}

export default Radio;

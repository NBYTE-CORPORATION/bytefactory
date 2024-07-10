import React, { useState, useRef, useEffect } from "react";
import Radio from "../components/Radio";
import _c from "../js/common";
import "../assets/QueryConversion.css";

function QueryConversion() {
  const [tbl, setTbl] = useState("");
  const [selectedValue, setSelectedValue] = useState("SELECT");
  const [leftTarValue, setLeftTarValue] = useState("");
  const [rightTarValue, setRightTarValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    change(leftTarValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tbl, selectedValue, leftTarValue]);

  const change = function (text) {
    if (text.length === 0) {
      setRightTarValue("");
      return;
    }

    let arr;
    if (text.indexOf(",") !== -1) {
      text = _c.replaceAll(text, "\n", "");
      arr = text.split(",");
    } else {
      arr = text.split("\n");
    }

    let table = String(tbl).toUpperCase();
    let returnText = "";

    arr = arr.map((item) => {
      return String(item).toUpperCase().trim();
    });

    switch (selectedValue) {
      case "SELECT":
        returnText = "\t\tSELECT";

        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            returnText += " " + arr[i] + "\n";
          } else {
            returnText += "\t\t     , " + arr[i] + "\n";
          }
        }

        returnText += "\t\t  FROM " + table + "\n";
        returnText += "\t\t ORDER BY 1";
        break;
      case "INSERT":
        returnText = "\t\tINSERT INTO " + table + " (\n";

        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            returnText += "\t\t            " + arr[i] + "\n";
          } else {
            returnText += "\t\t          , " + arr[i] + "\n";
          }
        }

        returnText += "\t\t     ) VALUES (\n";

        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            returnText += "\t\t            #{" + arr[i] + "}\n";
          } else {
            returnText += "\t\t          , #{" + arr[i] + "}\n";
          }
        }

        returnText += "\t\t)";
        break;
      case "UPDATE":
        returnText = "\t\tUPDATE " + table + "\n";

        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            returnText += "\t\t   SET " + arr[i] + " = #{" + arr[i] + "}\n";
          } else {
            returnText += "\t\t     , " + arr[i] + " = #{" + arr[i] + "}\n";
          }
        }

        returnText += "\t\tWHERE 1 = 1";
        break;
      case "DELETE":
        returnText = "\t\tDELETE " + table + "\n";

        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            returnText += "\t\t WHERE " + arr[i] + " = #{" + arr[i] + "}\n";
          } else {
            returnText += "\t\t   AND " + arr[i] + " = #{" + arr[i] + "}\n";
          }
        }

        break;
      default:
        break;
    }

    setRightTarValue(returnText);
  };

  const handleFocus = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  return (
    <div className="div_queryConversion">
      <div className="div_queryConversion_1 div_top">
        <div className="div_queryConversion_2 div_top_1 div_tbl">
          <input
            type="text"
            value={tbl}
            placeholder="TABLE_NAME"
            onChange={(e) => {
              setTbl(e.target.value);
            }}
          ></input>
        </div>
        <Radio
          list={[
            { value: "SELECT", text: "SELECT" },
            { value: "INSERT", text: "INSERT" },
            { value: "UPDATE", text: "UPDATE" },
            { value: "DELETE", text: "DELETE" },
          ]}
          value={{ selectedValue: selectedValue, change: leftTarValue }}
          fn={{ setSelectedValue: setSelectedValue, change: change }}
          style={{ display: "flex" }}
        ></Radio>
      </div>
      <div className="div_queryConversion_1 div_bottom">
        <textarea
          className="tar_left"
          value={leftTarValue}
          onChange={(e) => {
            setLeftTarValue(e.target.value);
          }}
        ></textarea>
        <textarea
          placeholder="READ_ONLY"
          ref={textareaRef}
          readOnly
          className="tar_right"
          value={rightTarValue}
          onFocus={handleFocus}
          onDragStart={handleDragStart}
        ></textarea>
      </div>
    </div>
  );
}

export default QueryConversion;

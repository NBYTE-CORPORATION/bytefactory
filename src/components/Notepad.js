import React from "react";
import "../assets/Notepad.css"; // CSS 파일을 불러옵니다.
import ColorControl from "../components/ColorControl";

const Notepad = ({ showNotepad, setShowNotepad, setDays, days }) => {
  const handleInputChange = (e, type) => {
    const { value } = e.target;

    setShowNotepad((prevState) => ({
      ...prevState,
      [type]: value,
    }));

    setDays(updateRecursive(type, days, showNotepad.id, value));
  };

  const updateRecursive = (type, days, dayId, newContext) => {
    if (showNotepad.type === "book") {
      return days.map((day) => {
        if (day.id === dayId) {
          return { ...day, context: newContext };
        } else if (day.children) {
          return {
            ...day,
            children: updateRecursive(
              "context",
              day.children,
              dayId,
              newContext
            ),
          }; // 재귀적으로 자식 노드도 업데이트
        }

        return day;
      });
    } else {
      const updatedDays = JSON.parse(JSON.stringify(days));
      updatedDays[dayId][type] = newContext;
      return updatedDays;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
        background: "#0000009e",
        zIndex: 10,
        display: showNotepad.visible ? "block" : "none",
      }}
    >
      <div
        className="notepad"
        style={{ display: showNotepad.visible ? "block" : "none", zIndex: 10 }}
      >
        <div className="notepad-head">
          {showNotepad.noteType === "days" ? (
            <input
              type="text"
              className="notepad-title-input"
              value={showNotepad.title || ""}
              onChange={(e) => handleInputChange(e, "title")}
            ></input>
          ) : (
            <p type="text" className="notepad-title-text">
              {showNotepad.title || ""}
            </p>
          )}

          {showNotepad.backgroundColor ? (
            <ColorControl
              width="20px"
              height="20px"
              value={showNotepad.backgroundColor}
              onChange={(e) => handleInputChange(e, "backgroundColor")}
            ></ColorControl>
          ) : null}
          <div style={{ width: "5px" }}></div>
          {showNotepad.color ? (
            <ColorControl
              width="20px"
              height="20px"
              value={showNotepad.color}
              onChange={(e) => handleInputChange(e, "color")}
            ></ColorControl>
          ) : null}
          <div style={{ width: "5px" }}></div>
          <button
            className="notepad-close"
            onClick={() =>
              setShowNotepad({
                visible: false,
                id: null,
                day: null,
                title: null,
                context: null,
              })
            }
          >
            X
          </button>
        </div>
        <div className="notepad-body">
          <textarea
            className="notepad-context"
            value={showNotepad.context || ""}
            onChange={(e) => handleInputChange(e, "context")}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Notepad;

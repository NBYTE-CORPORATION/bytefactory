import React, { useState, useEffect } from "react";
import Notepad from "../components/Notepad";
import calendarHelp from "../js/Calendarhelp";
import colorHelp from "../js/Colorhelp";
import "../assets/Calendar.css";

const Calendar = () => {
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                                             @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@               초기 설정                     @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                                             @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  // 일정
  const [days, setDays] = useState([]); // [{type, id:uniqueId, day:dayId, firstDay, lastDay, index, title, context, length, backgroundColor, color}]
  // 일정 복사
  const [daysCopy, setDaysCopy] = useState("");

  // 카테고리
  const [dutes, setDutes] = useState([]); // [{id, day, text}]
  // 카테고리 복사
  //  const [dutesCopy, setDutesCopy] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPath, setSelectedPath] = useState([]);
  const [hoveredText, setHoveredText] = useState(null);
  const [clickedCellId, setClickedCellId] = useState("");

  const [dargThings, setDargThings] = useState();

  const [draggingOver, setDraggingOver] = useState(0);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    selectedDayId: null,
    type: null,
  });
  const [ctrlPressed, setCtrlPressed] = useState(false); // ctrl 키 상태 추가
  const [shiftPressed, setShiftPressed] = useState(false); // shift 키 상태 추가

  const [showNotepad, setShowNotepad] = useState({
    visible: false,
    id: null,
    day: null,
    maintext: null,
    context: null,
  });

  // 로컬 스토리지에서 북마크 데이터 불러오기
  useEffect(() => {
    const savedDays = localStorage.getItem("CalendarDay");
    const savedDutes = localStorage.getItem("CalendarDute");

    if (savedDays) {
      setDays(JSON.parse(savedDays));
    }
    if (savedDutes) {
      setDutes(JSON.parse(savedDutes));
    }
  }, []);

  // 세션 스토리지 관련 설정 건드리는 거.
  // 임시
  // setTimeout(() => {
  //   let updatedItems = days;
  //   if (!!updatedItems) {
  //     for (let i = 0; i < updatedItems.length; i++) {
  //       if (updatedItems[i].day !== updatedItems[i].firstDay) {
  //         updatedItems = updatedItems.filter((item) => item.title);
  //         setDays(updatedItems);
  //       }
  //     }
  //   }
  // }, 2000);

  // 로컬 스토리지에 북마크 데이터 저장하기
  useEffect(() => {
    if (Array.isArray(days) && days.length > 0) {
      localStorage.setItem("CalendarDay", JSON.stringify(days));
    } else {
      localStorage.removeItem("CalendarDay");
    }
  }, [days]);

  useEffect(() => {
    if (Array.isArray(dutes) && dutes.length > 0) {
      localStorage.setItem("CalendarDute", JSON.stringify(dutes));
    } else {
      localStorage.removeItem("CalendarDute");
    }
  }, [dutes]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Control") {
        setCtrlPressed(true);
      }
      if (event.key === "Shift") {
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "Control") {
        setCtrlPressed(false);
      }
      if (event.key === "Shift") {
        setShiftPressed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      // contextMenu가 보이는 경우, 이를 숨깁니다.
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

    // 클릭 이벤트 리스너 등록
    document.addEventListener("click", handleClickOutside);

    // 클린업 함수에서 이벤트 리스너 제거
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  초기 설정                  @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                                             @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  달력 공통                  @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//

  // 이번 달
  const goToTodayMonth = () => {
    setCurrentDate(() => new Date());
  };
  // 이전 달
  const goToPreviousMonth = () => {
    let today = new Date();

    if (
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() + 1 === currentDate.getMonth()
    ) {
      setCurrentDate(
        (prevDate) =>
          new Date(
            prevDate.getFullYear(),
            prevDate.getMonth() - 1,
            today.getDate()
          )
      );
    } else {
      setCurrentDate(
        (prevDate) =>
          new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
      );
    }
  };

  // 다음 달
  const goToNextMonth = () => {
    let today = new Date();

    if (
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() - 1 === currentDate.getMonth()
    ) {
      setCurrentDate(
        (prevDate) =>
          new Date(
            prevDate.getFullYear(),
            prevDate.getMonth() + 1,
            today.getDate()
          )
      );
    } else {
      setCurrentDate(
        (prevDate) =>
          new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
      );
    }
  };

  // 달력 클릭
  const handleDayClick = (event, dayId) => {
    let newPathIndex;
    let selectedPathArr = [...selectedPath];

    if (
      (event.ctrlKey && event.button === 0) ||
      (event.shiftKey && event.button === 0)
    ) {
      if (
        selectedPath[0] &&
        selectedPath[0].substring(0, 1) === String(dayId).substring(0, 1)
      ) {
        if (selectedPathArr.includes(dayId)) {
          selectedPathArr = selectedPathArr.filter((item) => item !== dayId);
        } else {
          selectedPathArr.push(dayId);
        }
      } else {
        selectedPathArr = [];
        selectedPathArr.push(dayId);
      }
    } else if (event.button === 0) {
      newPathIndex = selectedPath.indexOf(dayId);

      if (newPathIndex === -1) {
        selectedPathArr = [];
        selectedPathArr.push(dayId);
      }
    }

    let selectedPathSet = new Set(selectedPathArr);
    selectedPathArr = Array.from(selectedPathSet);
    setSelectedPath(selectedPathArr);
  };

  // 달력 클릭2
  const handleContextMenu = (event, dayId, type, objDay) => {
    event.preventDefault();
    event.stopPropagation();

    let selectedPathArr = [...selectedPath];
    if (ctrlPressed || shiftPressed) {
      // ctrl 키가 눌려있지 않을 때만 처리
      if (selectedPath[0] && selectedPath[0].substring(0, 1) === type) {
        selectedPathArr.push(type + "_" + dayId);
      } else {
        selectedPathArr = [];
        selectedPathArr.push(type + "_" + dayId);
      }
    } else {
      if (selectedPath[0] && selectedPath[0].substring(0, 1) === type) {
        if (type === "d") type = "b";
        if (type === "dute") type = "t";
        selectedPathArr.push(type + "_" + dayId);
      } else {
        selectedPathArr = [];
        selectedPathArr.push(type + "_" + dayId);
      }
    }

    let selectedPathSet = new Set(selectedPathArr);
    selectedPathArr = Array.from(selectedPathSet);
    setSelectedPath(selectedPathArr);

    if (objDay) {
      dayId = objDay;
    }

    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      selectedDayId: dayId,
      type: type,
    });
  };

  // 달력 변수
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
  const lastDayOfLastMonth = new Date(
    currentYear,
    currentMonth - 1,
    0
  ).getDate();

  // Get the dates of the previous month
  const previousMonthDates = [];
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Convert Sunday (0) to 6
  for (let i = startDay; i >= 0; i--) {
    previousMonthDates.push(lastDayOfLastMonth - i);
  }

  // 달력 클래스 달기
  const getDayClassName = (year, month, day, isWeekend, index, index_week) => {
    let className = "";
    if (
      month < currentMonth ||
      (month === currentMonth - 1 && day < currentDay)
    ) {
      className = "prev-month";
    } else if (
      month > currentMonth ||
      (month === currentMonth - 1 && day > currentDay)
    ) {
      className = "next-month";
      if (index % 7 === 6) {
        className += " end_month";
      }
    } else {
      className = "current-month";
    }
    if (day === currentDay && month === currentMonth && year === currentYear) {
      let today = new Date();

      if (today.getDate() === day) {
        className += " today";
      }
    }
    if (isWeekend) {
      className += " weekend";
    }

    if (index_week === 0 && index === 0) {
      className += " start_month";
    }

    const dateKey =
      year + String(month).padStart(2, "0") + String(day).padStart(2, "0");
    if (calendarHelp.holiday && calendarHelp.holiday[dateKey]) {
      className += " holiday";
    }

    return className;
  };

  // 달력 마우스 이동
  const handleMousetbodyMove = (e) => {
    if (!clickedCellId) {
      return false;
    }

    let updateSelectedPath;

    const targetId = e.target;
    let findId = "";
    let element = targetId;

    while (element && findId === "") {
      const findIndex = element.className.indexOf("b_");
      if (findIndex !== -1) {
        findId = element.className.substring(findIndex, findIndex + 10);
      }
      element = element.parentElement;
    }

    if (clickedCellId === "paint") {
      updateSelectedPath = selectedPath;

      if (findId) {
        updateSelectedPath.push(findId);
      }

      let updateSelectedPathSet = new Set(updateSelectedPath);
      updateSelectedPath = [...updateSelectedPathSet];

      setSelectedPath(updateSelectedPath);
    }

    if (clickedCellId === "clear") {
      updateSelectedPath = [];

      if (findId) {
        updateSelectedPath.push(findId);
      }

      let updateSelectedPathSet = new Set(updateSelectedPath);
      updateSelectedPath = [...updateSelectedPathSet];

      const filteredArray = selectedPath.filter(
        (item) => !updateSelectedPath.includes(item)
      );

      setSelectedPath(filteredArray);
    }
  };

  // 달력 마우스 누르기
  const handleMousetbodyDown = (e) => {
    if (e.button === 2) return false;

    const targetId = e.target;
    let element = targetId;
    let findId = "";

    while (element && findId === "") {
      const findIndex = element.className.indexOf("b_");
      if (findIndex !== -1) {
        findId = element.className.substring(findIndex, findIndex + 10);
      }
      element = element.parentElement;
    }

    if (findId) {
      if (selectedPath.includes(findId)) {
        setClickedCellId("clear");
      } else {
        setClickedCellId("paint");
      }
    }
  };

  // 달력 마우스 올리기
  const handleMousetbodyUp = () => {
    setClickedCellId("");
  };

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  달력 공통                  @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                                             @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  일정 공통                  @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//

  // 일정 공통 부분
  const controlDropAndPasteDay = (updatedItems, findId) => {
    updatedItems = [...updatedItems, findId];

    let newFirstDaysSet = new Set();
    let newFirstDays = [];
    for (let i = 0; i < findId.length; i++) {
      newFirstDaysSet.add(findId);
    }

    newFirstDays = Array.from(newFirstDaysSet);
    controlDropAndPasteAndCreateDay(updatedItems, newFirstDays);
  };

  // 일정 공통 부분2
  const controlDropAndPasteAndCreateDay = (updatedItems, newFirstDays) => {
    let doArr;
    for (let i = 0; i < newFirstDays.length; i++) {
      doArr = calendarHelp.doIndexControl1(
        updatedItems,
        newFirstDays[i].id,
        newFirstDays[i].firstDay,
        newFirstDays[i].lastDay
      );

      if (doArr.length !== 0) {
        updatedItems.sort((a, b) => {
          if (a.firstDay === b.firstDay) {
            return a.length - b.length;
          } else {
            return a.firstDay.localeCompare(b.firstDay);
          }
        });
        doArr.sort((a, b) => {
          if (a.firstDay === b.firstDay) {
            return a.length - b.length;
          } else {
            return a.firstDay.localeCompare(b.firstDay);
          }
        });

        calendarHelp.doIndexControl2(updatedItems, doArr);
      }
    }

    updatedItems.sort((a, b) => {
      return a.id - b.id;
    });

    updatedItems.map((e, i) => {
      if (e.id === daysCopy) {
        setDaysCopy(i);
      }
      return (e.id = i);
    });

    setDays(updatedItems);
    setSelectedPath([]);
  };

  // 일정 생성
  const handleCreateDay = () => {
    let createDays, newDays, uniqueId, bColor, fColor;
    const strippedDays = selectedPath.map((dayId) => dayId.substring(2)); // 'b_' 제거
    const sortedDays = strippedDays.sort(); // 정렬

    createDays = calendarHelp.createDayArray(sortedDays); //[[], []]

    newDays = createDays.map((createDay, i) => {
      // uniqueId = Number(Date.now().toString()) + i;
      uniqueId = Math.max(...days.map((day) => day.id));

      if (uniqueId === -Infinity) {
        uniqueId += i;
      } else {
        uniqueId += i + 1;
      }

      bColor = colorHelp.getRandomColor();
      fColor = colorHelp.getRandomColor(bColor);

      return (createDay = {
        type: "Notepad",
        id: uniqueId,
        day: createDay[0],
        firstDay: createDay[0],
        lastDay: createDay[createDay.length - 1],
        title: createDay[0] ? "제목을 입력하세요." : null,
        context: null,
        index: 0,
        length: createDay.length,
        backgroundColor: bColor,
        color: fColor,
      });
    });

    let testDays = [];
    testDays = [...days, ...newDays];

    let newFirstDaysSet = new Set();
    let newFirstDays = [];
    for (let i = 0; i < newDays.length; i++) {
      newFirstDaysSet.add(newDays[i]);
    }

    newFirstDays = Array.from(newFirstDaysSet);
    controlDropAndPasteAndCreateDay(testDays, newFirstDays);
  };

  // 일정 삭제
  const handleRemoveDay = (day) => {
    let id;

    if (!!day) {
      id = day;
    } else {
      id = contextMenu.selectedDayId;
    }

    if (id.id === daysCopy) {
      setDaysCopy("");
    }

    const updatedItems = days.filter((item) => item.id !== id.id);

    let doArr = calendarHelp.doIndexControl1(
      days,
      id.id,
      id.firstDay,
      id.lastDay
    );

    doArr = doArr.filter((item) => item.id !== id.id);
    if (doArr.length !== 0) {
      days.sort((a, b) => {
        if (a.firstDay === b.firstDay) {
          return a.length - b.length;
        } else {
          return a.firstDay.localeCompare(b.firstDay);
        }
      });
      doArr.sort((a, b) => {
        if (a.firstDay === b.firstDay) {
          return a.length - b.length;
        } else {
          return a.firstDay.localeCompare(b.firstDay);
        }
      });
      calendarHelp.doIndexControl2(days, doArr);
    }

    if (!!day) {
      return updatedItems;
    } else {
      updatedItems.sort((a, b) => {
        return a.id - b.id;
      });

      updatedItems.map((e, i) => {
        if (e.id === daysCopy) {
          setDaysCopy(i);
        }
        return (e.id = i);
      });

      setDays(updatedItems);
    }
  };

  // 일정 보여주기
  const renderDayView = (dayId, index) => {
    return days.map((day) => renderDayLineView(day, dayId, index));
  };

  // 일정 라인 그리기
  const renderDayLineView = (day, dayId, index) => {
    if (day.firstDay <= dayId && day.lastDay >= dayId && day.index === index) {
      return (
        <div
          draggable="true"
          key={day.id + "_" + index}
          className={
            "new_line " +
            day.id +
            " " +
            (day.firstDay === dayId && day.lastDay === dayId
              ? "all_line"
              : day.firstDay === dayId
              ? "first_line"
              : day.lastDay === dayId
              ? "last_line"
              : "body_line")
          }
          style={
            day.index === index
              ? {
                  backgroundColor: day.backgroundColor,
                  color: day.color,
                  cursor: "pointer",
                }
              : null
          }
          onDragStart={(e) => dragStartDays(e, day)}
          onContextMenu={(e) => handleContextMenu(e, day.day, "d", day)}
          onMouseDown={(e) => onMouseDayDown(e, day)}
          onDoubleClick={(e) => onDaysDoubleClick(e, day)}
        >
          {setLineText(day, dayId, index)}
        </div>
      );
    }
  };

  // 일정 텍스트 출력
  const setLineText = (day, dayId, index) => {
    if (day.firstDay === dayId && day.index === index) {
      return (
        <p className="line-text">
          <input
            style={{
              width: "170px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              background: "transparent",
              border: "0px",
              outline: "none",
              color: day.color,
            }}
            value={day.title}
            onChange={(e) => setLineTitle(e, day)}
          ></input>
        </p>
      );
    } else {
      let date = calendarHelp.getCreateDate(dayId);
      let dayOfWeek = date.getDay();

      if (dayOfWeek === 0) {
        return (
          <p className="line-text">
            <input
              style={{
                width: "170px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                background: "transparent",
                border: "0px",
                outline: "none",
                color: day.color,
              }}
              value={day.title}
              onChange={(e) => setLineTitle(e, day)}
            ></input>
          </p>
        );
      } else {
        return <p className="line-text"></p>;
      }
    }
  };

  // 일정 텍스트 변경
  const setLineTitle = (e, day) => {
    const updatedDays = JSON.parse(JSON.stringify(days));
    updatedDays[day.id].title = e.target.value;
    setDays(updatedDays);
  };

  // 일정 이동
  const handleMoveDay = () => {
    setDaysCopy(contextMenu.selectedDayId.id);
  };

  // 일정 붙어넣기
  const handlePasteDay = () => {
    const findDay = daysCopy;
    let findId = calendarHelp.findId(days, findDay);
    let updatedItems = handleRemoveDay(findId[0]);

    findId = findId[0];
    findId.day = contextMenu.selectedDayId;
    findId.firstDay = contextMenu.selectedDayId;

    let newYear = parseInt(contextMenu.selectedDayId.substring(0, 4));
    let newMonth = parseInt(contextMenu.selectedDayId.substring(4, 6)) - 1;
    let newDay = parseInt(contextMenu.selectedDayId.substring(6, 8));
    let date = new Date(newYear, newMonth, newDay + findId.length - 1);

    newYear = date.getFullYear();
    newMonth = String(date.getMonth() + 1).padStart(2, "0");
    newDay = String(date.getDate()).padStart(2, "0");
    let formattedDate = `${newYear}${newMonth}${newDay}`;

    findId.lastDay = formattedDate;
    findId.index = 0;

    controlDropAndPasteDay(updatedItems, findId);
  };

  // 일정 드래그 시작
  const dragStartDays = (e, day) => {
    const findDay = day;
    setDargThings(findDay);
    setSelectedPath([]);
  };

  // 일정 마우스 다운
  const onMouseDayDown = (e) => {
    e.stopPropagation();
  };

  // 일정 카테고리 드래그 중
  const dargOverThings = (e, dateString) => {
    e.preventDefault();

    if (!dateString) {
      let element = e.target;

      while (!!element.className) {
        if (element.className.indexOf("previous-month-button") !== -1) {
          if (draggingOver === 10) {
            goToPreviousMonth();
            setDraggingOver(0);
          } else {
            setDraggingOver(draggingOver + 1);
          }
          break;
        } else if (element.className.indexOf("next-month-button") !== -1) {
          if (draggingOver === 10) {
            goToNextMonth();
            setDraggingOver(0);
          } else {
            setDraggingOver(draggingOver + 1);
          }
          break;
        } else if (element.className.indexOf("today-month-button") !== -1) {
          if (draggingOver === 10) {
            goToTodayMonth();
            setDraggingOver(0);
          } else {
            setDraggingOver(draggingOver + 1);
          }
          break;
        } else {
          setDraggingOver(0);
          element = element.parentElement;
        }
      }
    } else {
      if (dargThings && dargThings.type) {
        const findDay = dargThings;
        let arr = [];
        let nextDate;
        const date = calendarHelp.getCreateDate(dateString);
        for (let i = 0; i < findDay.length; i++) {
          nextDate =
            date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2);
          arr.push("b_" + nextDate);
          date.setDate(date.getDate() + 1);
        }

        setSelectedPath([...arr]);
      } else {
        let arr = [];
        let nextDate;
        const date = calendarHelp.getCreateDate(dateString);

        nextDate =
          date.getFullYear() +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          ("0" + date.getDate()).slice(-2);
        arr.push("b_" + nextDate);
        date.setDate(date.getDate() + 1);

        setSelectedPath([...arr]);
      }
    }
  };

  // 일정 카테고리 드롭
  const dropThings = () => {
    if (dargThings && dargThings.type) {
      const findDay = dargThings;
      let findId = calendarHelp.findId(days, findDay.id);
      let updatedItems = handleRemoveDay(findId[0]);

      clearTimeout(draggingOver);
      setDraggingOver(0);

      findId = findId[0];
      findId.day = selectedPath[0].match(/\d+$/)[0];
      findId.firstDay = selectedPath[0].match(/\d+$/)[0];
      findId.lastDay = selectedPath[selectedPath.length - 1].match(/\d+$/)[0];
      findId.index = 0;

      controlDropAndPasteDay(updatedItems, findId);
    } else {
      const findDute = dargThings;
      let findId = findDute.id;
      let updatedItems = handleRemoveDute(findId);

      findDute.day = selectedPath[0].match(/\d+$/)[0];

      updatedItems.push(findDute);

      updatedItems.map((e, i) => {
        if (findId === e.id) {
          findId = i;
        }
        return (e.id = i);
      });

      setHoveredText({ id: findId, day: findDute.day });
      setDutes(updatedItems);
    }
  };

  // 일정 메모 보여주기
  const onDaysDoubleClick = (e, day) => {
    if (e.ctrlKey) return false;
    if (e.shiftKey) return false;
    if (e.button === 2) return false;

    setSelectedPath([]);
    e.preventDefault();
    e.stopPropagation();

    setShowNotepad({
      visible: true,
      id: day.id,
      title: day.title,
      context: day.context,
      backgroundColor: day.backgroundColor,
      color: day.color,
      noteType: "days",
    });
  };

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  일정 관리                  @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                                             @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  카테 고리                  @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//

  // 카테고리 생성
  const handleCreateDute = (id) => {
    if (String(selectedPath).substring(0, 1) === "t") {
      let updateDutes = dutes;

      updateDutes.sort((a, b) => {
        return a.id - b.id;
      });

      updateDutes.map((e, i) => {
        return (e.id = i);
      });

      let uniqueId = Math.max(...updateDutes.map((dute) => dute.id));
      // uniqueId = String(Number(Date.now().toString())) + dute.length;

      if (uniqueId === -Infinity) {
        uniqueId = 0;
      } else {
        uniqueId += 1;
      }

      for (const e of selectedPath) {
        updateDutes.push({
          id: uniqueId,
          day: String(e).substring(2),
          title: id,
          context: "",
        });

        uniqueId += 1;
      }

      setDutes([...updateDutes]);
      setSelectedPath([]);
    }
  };

  // 카테고리 삭제
  const handleRemoveDute = (dute) => {
    let id;

    if (dute || dute === 0) {
      id = dute;

      const updatedItems = dutes.filter((item) => item.id !== id);

      return updatedItems;
    } else {
      id = contextMenu.selectedDayId.id;

      const updatedItems = dutes.filter((item) => item.id !== id);

      updatedItems.map((e, i) => {
        return (e.id = i);
      });

      setDutes(updatedItems);
    }
  };

  // 카테고리 호버
  const handleMouseEnter = (id, day) => {
    if (!hoveredText || hoveredText.id !== id) {
      setHoveredText({ id: id, day: day });
    }
  };

  // 카테고리 호버 떠나기
  const handleMouseLeave = () => {
    if (hoveredText && !hoveredText.context && hoveredText.context !== "") {
      setHoveredText();
    }
  };

  // 카테고리 마우스 다운
  const onMouseDownDutes = (e) => {
    e.stopPropagation();
  };

  const setKeyDownDute = (e, dute) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      setHoveredText(dute);
    } else if (e.key === "Escape" || e.key === "Enter") {
      setHoveredText();
    }
  };

  // 카테고리 텍스트 변경
  const setDuteTitle = (e, dute) => {
    setHoveredText(dute);
    const updatedDutes = JSON.parse(JSON.stringify(dutes));
    updatedDutes[dute.id].context = e.target.value;
    setDutes(updatedDutes);
  };

  // 카테고리 드래그 시작
  const dragStartDutes = (e, dute) => {
    const findDute = dute;
    setDargThings(findDute);
    setSelectedPath([]);
  };

  // 카테고리 메모 보여주기
  const onDoubleClickDutes = (e, dute) => {
    if (e.ctrlKey) return false;
    if (e.shiftKey) return false;
    if (e.button === 2) return false;

    e.preventDefault();
    e.stopPropagation();

    setShowNotepad({
      visible: true,
      id: dute.id,
      day: dute.day,
      title: dute.title,
      context: dute.context,
      noteType: "dutes",
    });
  };

  // 카테고리 보여주기
  const renderDayTopView = (dayId) => {
    return dutes.map((dute) => renderDayTopLineView(dute, dayId));
  };

  // 카테고리 그리기
  const renderDayTopLineView = (dute, dayId) => {
    if (dute.day === dayId) {
      return (
        <div
          key={dute.id}
          draggable="true"
          className="day-top-line-view"
          onMouseLeave={() => handleMouseLeave()}
          onMouseEnter={() => handleMouseEnter(dute.id, dute.day)}
          onContextMenu={(e) => handleContextMenu(e, dute.day, "dute", dute)}
          onMouseDown={(e) => onMouseDownDutes(e)}
          onDoubleClick={(e) => onDoubleClickDutes(e, dute)}
          onDragStart={(e) => dragStartDutes(e, dute)}
        >
          <span
            style={{
              transition: "all 1s ease",
              width:
                hoveredText &&
                hoveredText.id === dute.id &&
                hoveredText.day === dute.day
                  ? String(dute.title + " " + dute.context).length * 13 < 100
                    ? String(dute.title + " " + dute.context).length * 13
                    : 100
                  : String(dute.title).length * 10,
              whiteSpace: "nowrap", // Prevent text wrapping
              textOverflow: "ellipsis",
            }}
          >
            <span>
              {dute.title + " "}
              <input
                type="text"
                style={{
                  transition: "all 1s ease",
                  width:
                    hoveredText &&
                    hoveredText.id === dute.id &&
                    hoveredText.day === dute.day
                      ? (String(dute.title + " " + dute.context).length - 2) *
                          13 <
                        75
                        ? (String(dute.title + " " + dute.context).length - 2) *
                          13
                        : 75
                      : 0,
                  color:
                    hoveredText &&
                    hoveredText.id === dute.id &&
                    hoveredText.day === dute.day
                      ? "black"
                      : "transparent",
                  background: "transparent",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  border: "0px",
                  outline: "none",
                }}
                value={
                  hoveredText &&
                  hoveredText.id === dute.id &&
                  hoveredText.day === dute.day
                    ? dute.context
                    : dute.context
                }
                onChange={(e) => setDuteTitle(e, dute)}
                onFocus={() => setHoveredText(dute)}
                onKeyDown={(e) => setKeyDownDute(e, dute)}
                onBlur={() => {
                  setHoveredText();
                }}
              ></input>
            </span>
          </span>
        </div>
      );
    }
  };

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  카테 고리                  @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                                             @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  우클릭 메뉴                @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//

  // 우클릭 메뉴
  const renderContextMenu = () => {
    if (!contextMenu.visible) return null;

    if (contextMenu.type === "b") {
      return (
        <ul
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <li onClick={() => handleCreateDay()}>추가</li>
          {daysCopy === 0 || !!daysCopy ? (
            <li onClick={() => handlePasteDay()}>붙어넣기</li>
          ) : (
            ""
          )}
        </ul>
      );
    } else if (contextMenu.type === "d" || contextMenu.type === "dute") {
      if (selectedPath.length !== 0) {
        setSelectedPath([]);
      }

      if (contextMenu.type === "d") {
        return (
          <ul
            className="context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <li onClick={() => handleMoveDay()}>이동</li>
            <li onClick={() => handleRemoveDay()}>삭제</li>
          </ul>
        );
      } else if (contextMenu.type === "dute") {
        return (
          <ul
            className="context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <li onClick={() => handleRemoveDute()}>삭제</li>
          </ul>
        );
      }
    } else if (contextMenu.type === "t") {
      return (
        <ul
          className="context-menu"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-evenly",
            width: "158px",
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <li style={{ width: "21px" }} onClick={() => handleCreateDute("🎉")}>
            🎉
          </li>
          <li style={{ width: "21px" }} onClick={() => handleCreateDute("⏲️")}>
            ⏲️
          </li>
          <li style={{ width: "21px" }} onClick={() => handleCreateDute(" ⭐")}>
            ⭐
          </li>
          <li style={{ width: "21px" }} onClick={() => handleCreateDute(" ⚽")}>
            ⚽
          </li>
          <li style={{ width: "21px" }} onClick={() => handleCreateDute("💳")}>
            💳
          </li>
          <li style={{ width: "21px" }} onClick={() => handleCreateDute("🍺")}>
            🍺
          </li>
        </ul>
      );
    }
  };

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  우클릭 메뉴                @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                                             @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  아직 기타                  @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//

  // const copyBookMark = () => {
  //   const savedNodes = localStorage.getItem("bookmarks");
  //   let node = {};
  //   if (savedNodes) {
  //     node = JSON.parse(savedNodes);
  //   }

  //   let date1, date2;
  //   let before_date1;
  //   let book_days = days;
  //   let total_title = "전체 일정",
  //     year_title = "",
  //     month_title = "";
  //   let total_context = "",
  //     year_context = "",
  //     month_context = "";
  //   let folder_index = calendarHelp.setCalendarBookmarkFolder(node);

  //   book_days.sort((a, b) => {
  //     if (a.firstDay === b.firstDay) {
  //       return a.length - b.length;
  //     } else {
  //       return a.firstDay.localeCompare(b.firstDay);
  //     }
  //   });

  //   for (let i = 0; i < book_days.length; i++) {
  //     date1 = calendarHelp.getCreateDate(book_days[i].firstDay, 1);
  //     date2 = calendarHelp.getCreateDate(book_days[i].lastDay, 1);

  //     if (!before_date1 || before_date1[0] !== date1[0]) {
  //       if (before_date1) {
  //         node = calendarHelp.setCalendarBookmarkcontext(
  //           node,
  //           folder_index,
  //           year_title,
  //           year_context
  //         );
  //       }

  //       year_title = date1[0] + "년도 일정";
  //       year_context = "";
  //     }
  //     if (!before_date1 || before_date1[1] !== date1[1]) {
  //       if (before_date1) {
  //         node = calendarHelp.setCalendarBookmarkcontext(
  //           node,
  //           folder_index,
  //           month_title,
  //           month_context
  //         );
  //       }

  //       month_title = date1[0] + "년도 " + date1[1] + "월 일정";
  //       month_context = "";
  //     }

  //     total_context = calendarHelp.setCalendarBookmark(
  //       book_days[i],
  //       date1,
  //       date2,
  //       total_context
  //     );

  //     year_context = calendarHelp.setCalendarBookmark(
  //       book_days[i],
  //       date1,
  //       date2,
  //       year_context
  //     );

  //     month_context = calendarHelp.setCalendarBookmark(
  //       book_days[i],
  //       date1,
  //       date2,
  //       month_context
  //     );

  //     before_date1 = date1;
  //   }

  //   node = calendarHelp.setCalendarBookmarkcontext(
  //     node,
  //     folder_index,
  //     month_title,
  //     month_context
  //   );

  //   node = calendarHelp.setCalendarBookmarkcontext(
  //     node,
  //     folder_index,
  //     year_title,
  //     year_context
  //   );

  //   node = calendarHelp.setCalendarBookmarkcontext(
  //     node,
  //     folder_index,
  //     total_title,
  //     total_context
  //   );

  //   localStorage.setItem("bookmarks", JSON.stringify(node));
  // };

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  아직 기타                  @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                                             @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@                  화면 그리기                @@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//

  return (
    <div>
      <div className="top-calendar">
        <div className="top-calendar-left-div">
          <h1>
            <p>
              {currentDate.getFullYear() +
                "년 " +
                String(currentDate.getMonth() + 1).padStart(2, "0") +
                "월"}
            </p>
            <input
              className="top-calendar-input"
              type="month"
              value={
                currentDate.getFullYear() +
                "-" +
                String(currentDate.getMonth() + 1).padStart(2, "0")
              }
              onChange={(e) => {
                if (e.target.value !== "") {
                  let today = new Date();
                  if (
                    today.getFullYear() ===
                      e.target.valueAsDate.getFullYear() &&
                    today.getMonth() === e.target.valueAsDate.getMonth()
                  ) {
                    setCurrentDate(today);
                  } else {
                    setCurrentDate(e.target.valueAsDate);
                  }
                }
              }}
            ></input>
          </h1>

          {/* <button
            className="year-bookmark-button"
            onClick={() => {
              copyBookMark();
            }}
          >
            테스트
          </button> */}
        </div>
        <div className="control-calendar">
          <button
            className="today-month-button"
            onClick={() => {
              goToTodayMonth();
            }}
            onDragOver={(e) => dargOverThings(e)}
          >
            💒
          </button>
          <button
            className="previous-month-button"
            onClick={() => {
              goToPreviousMonth();
            }}
            onDragOver={(e) => dargOverThings(e)}
          >
            ◀
          </button>
          <button
            className="next-month-button"
            onClick={() => {
              goToNextMonth();
            }}
            onDragOver={(e) => dargOverThings(e)}
          >
            ▶
          </button>
        </div>
      </div>
      <table className="cld-table">
        <thead>
          <tr>
            <th className="weekend">일</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th>토</th>
          </tr>
        </thead>
        <tbody
          onMouseMove={(e) => handleMousetbodyMove(e)}
          onMouseDown={(e) => handleMousetbodyDown(e)}
          onMouseUp={(e) => handleMousetbodyUp(e)}
        >
          {[...Array(6)].map((_, weekIndex) => (
            <tr key={weekIndex}>
              {[...Array(7)].map((_, dayIndex) => {
                let day = weekIndex * 7 + dayIndex + 1 - firstDayOfMonth;
                let year, month;
                if (day <= 0) {
                  year = currentYear;
                  month = currentMonth - 1;
                  day = previousMonthDates[previousMonthDates.length + day - 1];

                  if (month === 0) {
                    month = 12;
                    year = year - 1;
                  }
                } else if (day > daysInMonth) {
                  year = currentYear;
                  month = currentMonth + 1;
                  day -= daysInMonth;

                  if (month === 13) {
                    month = 1;
                    year = year + 1;
                  }
                } else {
                  month = currentMonth;
                  year = currentYear;
                }
                const isWeekend = dayIndex === 0; // Saturday (6) and Sunday (0)
                const dayId =
                  year +
                  "" +
                  String(month).padStart(2, 0) +
                  "" +
                  String(day).padStart(2, 0);

                let holiday = "";
                if (calendarHelp.holiday && calendarHelp.holiday[dayId]) {
                  holiday = calendarHelp.holiday[dayId];
                }

                return (
                  <td
                    key={dayIndex}
                    className={`${getDayClassName(
                      year,
                      month,
                      day,
                      isWeekend,
                      dayIndex,
                      weekIndex
                    )} a_${dayId}`}
                  >
                    <div
                      className="cdl-day"
                      onDragOver={(e) => dargOverThings(e, dayId)}
                      onDrop={(e) => dropThings(e, dayId)}
                    >
                      <div
                        className={"cdl-top t_" + dayId}
                        onMouseDown={(e) => handleDayClick(e, "t_" + dayId)}
                        onContextMenu={(e) => handleContextMenu(e, dayId, "t")}
                        style={{
                          backgroundColor: selectedPath.includes("t_" + dayId)
                            ? "#007bff"
                            : "white",
                        }}
                      >
                        <div
                          className="label-day"
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            paddingLeft: "2px",
                          }}
                        >
                          <span>{day}</span>
                          <span
                            style={{
                              fontSize: "small",
                              display: "block",
                              overflow: "hidden",
                              height: "18px",
                            }}
                          >
                            &nbsp; {holiday}
                          </span>
                        </div>
                        <div
                          className="day-top-view"
                          style={{
                            border: dutes.some((obj) => obj.day === dayId)
                              ? "1px solid black"
                              : "0px",
                            borderRadius: "10px",
                          }}
                        >
                          {renderDayTopView(dayId)}
                        </div>
                      </div>
                      <div
                        className={"cdl-body b_" + dayId}
                        onMouseDown={(e) => handleDayClick(e, "b_" + dayId)}
                        onContextMenu={(e) => handleContextMenu(e, dayId, "b")}
                        style={{
                          backgroundColor: selectedPath.includes("b_" + dayId)
                            ? "#007bff"
                            : "transparent",
                        }}
                      >
                        <div className="new-day">{renderDayView(dayId, 0)}</div>
                        <div className="new-day">{renderDayView(dayId, 1)}</div>
                        <div className="new-day">{renderDayView(dayId, 2)}</div>
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {renderContextMenu()}
      <Notepad
        showNotepad={showNotepad}
        setShowNotepad={setShowNotepad}
        setDays={showNotepad.noteType === "days" ? setDays : setDutes}
        days={showNotepad.noteType === "days" ? days : dutes}
      />
    </div>
  );
};

export default Calendar;

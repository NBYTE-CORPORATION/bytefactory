const getCountDay = (days, year, month, day) => {
  let count = 0;

  for (let i = 0; i < days.length; i++) {
    if (days[i].day.includes(year + "" + month + "" + day)) {
      if (days[i].day === year + "" + month + "" + day) {
        count++;
      }
    } else {
      continue;
    }
  }

  return count;
};

// 내일이랑 같은지
const isNextDay = (todayDay, tomorrowDay) => {
  let dateString, year, month, day, tomorrow1, tomorrow2;

  dateString = todayDay;
  year = dateString.slice(0, 4);
  month = dateString.slice(4, 6);
  day = dateString.slice(6, 8);

  tomorrow1 = new Date(year, month - 1, day);
  tomorrow1.setDate(tomorrow1.getDate() + 1);

  dateString = tomorrowDay;
  year = dateString.slice(0, 4);
  month = dateString.slice(4, 6);
  day = dateString.slice(6, 8);
  tomorrow2 = new Date(year, month - 1, day);

  // 다음 날짜가 같은지 확인합니다.
  if (tomorrow1.getTime() === tomorrow2.getTime()) {
    return true;
  } else {
    return false;
  }
};

// 날 찾기
const findId = (days, id) => {
  let firstId = [];

  days.forEach((findDay) => {
    if (Number(findDay.id) === Number(id)) {
      firstId.push(findDay);
    }
  });

  return firstId; // 함수의 반환문으로 값을 반환합니다.
};

// 첫날 찾기
const findFirstId = (days, id, firstDay) => {
  let firstId = null;

  days.forEach((findDay) => {
    if (findDay.id === id && findDay.day === firstDay) {
      firstId = findDay;
    }
  });

  return firstId; // 함수의 반환문으로 값을 반환합니다.
};

// 붙은 날짜끼리 처리.
const createDayArray = (sortedDays) => {
  let nextDays, nextDay;
  nextDays = [];
  nextDay = [];

  sortedDays.forEach((e, i, a) => {
    if (i !== 0) {
      if (calendarHelp.isNextDay(a[i - 1], e)) {
        nextDay.push(e);
      } else {
        nextDays.push(nextDay);
        nextDay = [];
        nextDay.push(e);
      }
    } else {
      nextDay.push(e);
    }

    if (i === a.length - 1) {
      nextDays.push(nextDay);
    }
  });

  return nextDays;
};

// 인덱스 체크
const getIndexCheck = (days, createDays) => {
  let dayIndexArr, dayIndex, returnIndex, dayIds;
  let dayIndexSet = new Set();
  dayIds = days.map((obj) => [obj.day, obj.index]);
  returnIndex = [];

  createDays.forEach((createDay) => {
    dayIndex = 0;
    dayIndexSet.clear();

    for (let i = 0; i < createDay.length; i++) {
      if (days.length !== 0) {
        if (i !== 0) {
          if (!calendarHelp.isNextDay(createDay[i - 1], createDay[i])) {
            break;
          }
        }

        dayIds.forEach(([day, index]) => {
          if (createDay[i] === day) {
            dayIndexSet.add(index);
          }
        });
      }
    }

    dayIndexArr = Array.from(dayIndexSet);
    dayIndexArr = dayIndexArr.sort();
    for (let i = 0; i < dayIndexArr.length; i++) {
      if (dayIndexArr.includes(dayIndex)) {
        dayIndex = dayIndex + 1;
      }
    }

    returnIndex.push(dayIndex);
  });

  return returnIndex;
};

// 자기자신 포함 연결된 카테고리 전부 다 찾기.
const doIndexControl1 = (days, id, frDt, laDt, dayArr = [], con_i = 0) => {
  let dtArr = [];

  for (; frDt <= laDt; frDt++) {
    dtArr.push(String(frDt));
  }

  dtArr.forEach((dte) => {
    for (let i = 0; i < days.length; i++) {
      if (id !== days[i].id) {
        if (!dayArr.some((obj) => obj.id === days[i].id)) {
          dayArr.push(days[i]);
        }
      }
    }
  });

  if (con_i >= dayArr.length) {
    return dayArr;
  } else {
    return doIndexControl1(
      days,
      dayArr[con_i].id,
      dayArr[con_i].firstDay,
      dayArr[con_i].lastDay,
      dayArr,
      con_i + 1
    );
  }
};

// 인덱스 정렬
const doIndexControl2 = (days, arr, removeArr = []) => {
  let targetId;
  let max = -9999;
  let index = 0;
  let dayIndexSet = new Set();
  let dayIndexArr = [];

  // 인덱스 및 가장 큰 거
  for (const e of arr) {
    e.index = null;
    if (max < e.length) {
      targetId = e;
      max = e.length;
    }
  }

  // 인덱스 체크
  for (const e of removeArr) {
    if (targetId.firstDay > e.lastDay || targetId.lastDay < e.firstDay) {
    } else {
      dayIndexSet.add(e.index);
    }
  }

  dayIndexArr = Array.from(dayIndexSet);
  dayIndexArr = dayIndexArr.sort();

  for (let i = 0; i < dayIndexArr.length; i++) {
    if (dayIndexArr.includes(index)) {
      index = index + 1;
    } else {
      break;
    }
  }

  // 인덱스 추가
  for (const e of days) {
    if (targetId.id === e.id) {
      e.index = index;
    }
  }

  // 제거
  removeArr.push(targetId);
  arr = arr.filter((item) => item.id !== targetId.id);

  if (arr.length !== 0) {
    doIndexControl2(days, arr, removeArr);
  }
};

const getCreateDate = (days, type) => {
  let year, month, day;

  if (!!type) {
    year = parseInt(days.substring(0, 4));
    month = String(parseInt(days.substring(4, 6))).padStart(2, "0");
    day = String(parseInt(days.substring(6, 8))).padStart(2, "0");
    return [year, month, day];
  } else {
    const year = parseInt(days.substring(0, 4));
    const month = parseInt(days.substring(4, 6)) - 1;
    const day = parseInt(days.substring(6, 8));
    let date = new Date(year, month, day);
    return date;
  }
};

const setCalendarBookmark = (book_days, date1, date2, context) => {
  if (date1 === date2) {
    context += date1[0] + "/" + date1[1] + "/" + date1[2] + "\n";
  } else {
    context += date1[0] + "/" + date1[1] + "/" + date1[2] + " ~ ";
    context += date2[0] + "/" + date2[1] + "/" + date2[2] + "\n";
  }

  context += book_days.title;
  context += "\n\n";

  return context;
};

const setCalendarBookmarkFolder = (node) => {
  let node_check = -1;
  let bookmark_day;

  node.forEach((e, i) => {
    if (e.name === "일정" && e.type === "folder") {
      node_check = i;
    }
  });

  if (node_check === -1) {
    bookmark_day = {
      id: Date.now(),
      name: "일정",
      type: "folder",
      children: [],
      parentId: null,
    };

    node.push(bookmark_day);
  }

  node.forEach((e, i) => {
    if (e.name === "일정" && e.type === "folder") {
      node_check = i;
    }
  });

  return node_check;
};

const setCalendarBookmarkcontext = (node, folder_index, title, context) => {
  let max =
    Math.max(
      0,
      Number(Date.now()),
      ...node[folder_index].children.map((node) => node.id)
    ) + 1;

  let bookmark_day = {
    id: max,
    name: title + max,
    context: context,
    type: "notepad",
    parentId: node[folder_index].id,
  };

  node[folder_index].children.push(bookmark_day);
  return node;
};

const holiday = {
  20240101: "신정",
  20240209: " ",
  20240210: "설날",
  20240212: "대체 휴일",
  20240301: "삼일전",
  20240410: "제22대 국회의원선거",
  20240501: "근로자의 날",
  20240505: "어린이날",
  20240506: "대체 휴일",
  20240515: "부처님 오신 날",
  20240606: "현충일",
  20240815: "광복절",
  20240916: " ",
  20240917: "추석",
  20240918: " ",
  20241003: "개천절",
  20241009: "한글날",
  20241225: "성탄절",
};

const calendarHelp = {
  findId, // 날 찾기
  getCountDay, // 안 씀.
  isNextDay, // 내일인지 아닌지.
  findFirstId, // 첫번째 날짜 찾기 안 씀.
  doIndexControl1, // 일정 생성 및 삭제시 인덱스 관련
  doIndexControl2, // 일정 생성 및 삭제시 인덱스 관련
  getIndexCheck, // 인덱스 체크인데. 안 씀.
  createDayArray, // 붙은 날짜끼리 처리하는 로직
  getCreateDate, //  날짜 -> YYYY MM DD 또는 날짜 형식으로
  setCalendarBookmark, // 메모 내용 쓰기
  setCalendarBookmarkFolder, // 폴더 만들기
  setCalendarBookmarkcontext, // 북마크 메모 만들기
  holiday,
};

export default calendarHelp;

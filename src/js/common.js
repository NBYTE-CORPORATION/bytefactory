const trace = function (text) {
  console.log(text);
  return text;
};

const isNull = function (value) {
  if (value === "" || value === null || value === undefined) {
    return true;
  }

  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }

  if (value.length === 0) {
    return true;
  }

  return false;
};

const nvl = function (value1, value2) {
  if (isNull(value1)) {
    return value2;
  } else {
    return value1;
  }
};

const replaceAll = function (text, before, after) {
  text = String(text).replace(before, after);

  if (text.indexOf(before) !== -1) {
    return replaceAll(text, before, after);
  } else {
    return text;
  }
};

const common = {
  trace,
  isNull,
  nvl,
  replaceAll,
};

export default common;

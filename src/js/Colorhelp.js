const baseColors = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#ff8000",
  "#ff0080",
  "#80ff00",
  "#80ff80",
  "#0080ff",
  "#8000ff",
  "#ff8080",
  "#80ffff",
];

// 랜덤 색깔 가져오기
const getRandomColor = (color) => {
  if (!color) {
    return baseColors[Math.floor(Math.random() * baseColors.length)];
  } else {
    // 주어진 색상
    var givenColor = color.slice(1); // # 제거
    var r = parseInt(givenColor.substring(0, 2), 16); // 16진수를 10진수로 변환
    var g = parseInt(givenColor.substring(2, 4), 16);
    var b = parseInt(givenColor.substring(4, 6), 16);

    // 보색 계산
    var compR = 255 - r;
    var compG = 255 - g;
    var compB = 255 - b;

    // 16진수로 변환
    var compHex =
      "#" +
      ((1 << 24) + (compR << 16) + (compG << 8) + compB).toString(16).slice(1);
    return compHex;
  }
};

const colorHelp = {
  getRandomColor: getRandomColor,
};

export default colorHelp;

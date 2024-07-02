let sites = [
  {
    name: "공통",
    otherName: "common 공통",
    sites: [
      {
        name: "chatGPT",
        otherName: "chatGPT 챗GPT",
        url: "https://chat.openai.com/",
      },
      {
        name: "codingeverybody",
        otherName: "codingeverybody 코딩에브리바디",
        url: "https://codingeverybody.kr/",
      },
      {
        name: "DevDocs",
        otherName: "DevDocs 데브닥스",
        url: "https://devdocs.io/",
      },
      {
        name: "w3schools",
        otherName: "w3schools 학교",
        url: "https://www.w3schools.com/",
      },
      {
        name: "백준",
        otherName: "baekjoon acmicpc 백준",
        url: "https://www.acmicpc.net/",
      },
      {
        name: "비코",
        otherName: "BIKO 비코",
        url: "https://www.biko.kr/",
      },
      {
        name: "인파",
        otherName: "inpa 인파",
        url: "https://inpa.tistory.com/",
      },
      {
        name: "프로그래머스",
        otherName: "programmers 프로그래머스",
        url: "https://programmers.co.kr/",
      },
    ],
  },
  {
    name: "넥사크로",
    otherName: "NEXACRO 넥사크로",
    sites: [
      {
        name: "PLAY nexacro",
        otherName: "playnexacro 플레이 넥사크로",
        url: "https://www.playnexacro.com/",
      },
      {
        name: "투비소프트 DEMO",
        otherName: "TOBESOFT DEMO 투비소프트DEMO",
        url: "https://demo.tobesoft.com/",
      },
      {
        name: "투비소프트 DOCS",
        otherName: "TOBESOFT DOCS 투비소프트DOCS",
        url: "https://docs.tobesoft.com/index",
      },
      {
        name: "투비소프트 MAIN",
        otherName: "TOBESOFT MAIN 투비소프트MAIN",
        url: "https://www.tobesoft.com/main",
      },
      {
        name: "투비소프트 SUPPORT",
        otherName: "TOBESOFT SUPPORT 투비소프트SUPPORT",
        url: "http://support.tobesoft.co.kr/",
      },
    ],
  },
  {
    name: "오라클",
    otherName: "oracle 오라클",
    sites: [
      {
        name: "오라클Live",
        otherName: "live sql 라이브",
        url: "https://livesql.oracle.com/",
      },
    ],
  },
  {
    name: "자바스크립트",
    otherName: "javaScript 자바스크립트",
    sites: [
      {
        name: "Mdn",
        otherName: "mdn mozilla developer",
        url: "https://developer.mozilla.org/ko/",
      },
      {
        name: "모던 자바스크립트",
        otherName: "javascript 모던자바스크립트",
        url: "https://ko.javascript.info/",
      },
    ],
  },
  {
    name: "쿠버네티스",
    otherName: "Kubernetes 쿠버네티스 K8S",
    sites: [
      {
        name: "쿠버네티스",
        otherName: "Kubernetes 쿠버네티스 K8S",
        url: "https://kubernetes.io/ko/",
      },
    ],
  },
];

const makeSite = () => {
  return (sites = sites.map((e) => {
    e.open = false;
    e.visibility = "visible";
    e.sites.map((e2) => {
      e2.visibility = "hidden";
      return e2;
    });
    return e;
  }));
};

const siteHelp = {
  site: makeSite,
};

export default siteHelp;

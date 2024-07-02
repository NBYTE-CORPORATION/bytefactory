import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Card from "./components/Card";
import Sidebar from "./components/Sidebar";
import Clock from "./components/Clock";
import TextDiffViewer from "./pages/TextDiffViewer";
import ClipboardMonitor from "./pages/ClipboardMonitor";
import BookMark from "./pages/BookMark";
import Calendar from "./pages/Calendar";

//import DarkModeToggle from './components/DarkModeToggle';
import UpdateConfirmModal from "./components/modal/UpdateConfirmModal";
import Modal from "./components/Modal";
import ScrollToTopButton from "./components/ScrollToTopButton";
import "./App.css";
import logo from "./assets/imgs/logo.png";
import SiteCollection from "./pages/SiteCollection";

const App = () => {
  const [showUpdateConfirmModal, setShowUpdateConfirmModal] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [navigateHome, setNavigateHome] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [logoContainerStyle, setLogoContainerStyle] = useState({});
  const [headerTitle, setHeaderTitle] = useState("B Y T E F A C T O R Y");

  const minimize = () => {
    window.electron.windowControls.minimize();
  };

  // 닫기 함수
  const close = () => {
    window.electron.windowControls.close();
  };

  const handleCardClick = (title) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowCards(false);
    setNavigateHome(false);
    // 로고의 가로 길이만큼 영역을 부여합니다.
    setSidebarOpen(true);
    setHeaderTitle(title);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // const handleNotOpenCardClick = () => {
  //   setShowModal(true);
  // };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogoClick = () => {
    if (isAnimating || showCards) return;
    setIsAnimating(true);
    setShowCards(true);
    setNavigateHome(true);
    setLogoContainerStyle({});
    setSidebarOpen(false);
    setHeaderTitle("B Y T E F A C T O R Y");

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const openExternalLink = (url) => {
    if (window && window.electron) {
      window.electron.send("open-link-external", url); // 일렉트론 환경에서 링크 열기
    } else {
      window.open(url, "_blank"); // 웹 환경에서 링크 열기
    }
  };

  useEffect(() => {
    if (window.electron) {
      window.electron.receive("update-downloaded", () => {
        setShowUpdateConfirmModal(true); // 업데이트가 다운로드되면 모달을 보여줌
      });
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header" style={logoContainerStyle}>
          <div className={`center-container`} onClick={handleLogoClick}>
            <img src={logo} alt="ByteFactory" style={{ cursor: "pointer" }} />
            <p
              className={`header-text`}
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              {headerTitle}
            </p>
          </div>
          <div className="right-container">
            {/* <DarkModeToggle /> */}
            <button id="minimize-btn" onClick={minimize}>
              ㅡ
            </button>
            <button id="close-btn" onClick={close}>
              X
            </button>
          </div>
        </header>
        <Sidebar
          isOpen={sidebarOpen}
          setHeaderTitle={setHeaderTitle}
          headerTitle={headerTitle}
        />
        <div className={`content-area ${sidebarOpen ? "content-shifted" : ""}`}>
          {showCards && (
            <div>
              <div className="weatherContainer">
                <Clock size={3} />
                <div
                  onClick={() => openExternalLink("https://weather.naver.com/")}
                  className="weatherEmoji"
                >
                  🌤️
                </div>
              </div>
              <Link
                to="/TextDiffViewer"
                onClick={() => handleCardClick("TextDiffViewer")}
              >
                <Card
                  No="1"
                  title="TextDiffViewer"
                  description="텍스트를 비교하는 프로그램입니다."
                />
              </Link>
              <Link
                to="/ClipboardMonitor"
                onClick={() => handleCardClick("ClipboardMonitor")}
              >
                <Card
                  No="2"
                  title="ClipboardMonitor"
                  description="주어진 텍스트에 대한 클립보드를 모니터링하는 프로그램입니다."
                />
              </Link>
              <Link to="/BookMark" onClick={() => handleCardClick("BookMark")}>
                <Card
                  No="3"
                  title="BookMark"
                  description="북마크 프로그램입니다."
                />
              </Link>
              <Link to="/Calendar" onClick={() => handleCardClick("Calendar")}>
                <Card
                  No="4"
                  title="Calendar"
                  description="스케줄을 관리하는 프로그램입니다."
                />
              </Link>
              <Link
                to="/SiteCollection"
                onClick={() => handleCardClick("SiteCollection")}
              >
                <Card
                  No="5"
                  title="SiteCollection"
                  description="개발 관련 사이트들을 모은 프로그램입니다."
                />
              </Link>
              <Modal show={showModal} onClose={handleCloseModal}>
                <p>서비스 준비 중입니다! &gt;.&lt;</p>
              </Modal>
            </div>
          )}
          {navigateHome ? <Navigate to="/" replace={true} /> : null}
          {!navigateHome && (
            <Routes>
              <Route path="/TextDiffViewer" element={<TextDiffViewer />} />
              <Route path="/ClipboardMonitor" element={<ClipboardMonitor />} />
              <Route path="/BookMark" element={<BookMark />} />
              <Route path="/Calendar" element={<Calendar />} />
              <Route path="/SiteCollection" element={<SiteCollection />} />
            </Routes>
          )}
        </div>
        <ScrollToTopButton />
        {showUpdateConfirmModal && (
          <UpdateConfirmModal
            onClose={() => setShowUpdateConfirmModal(false)}
          />
        )}
      </div>
    </Router>
  );
};

export default App;

import React, { useRef, useState } from "react";
import siteHelp from "../js/Sitehelp";
import "../assets/SiteCollection.css";

function SiteCollection() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [site, setSite] = useState(siteHelp.site);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartX(event.clientX - outerRef.current.offsetLeft);
    setScrollLeft(outerRef.current.scrollLeft);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    const x = event.clientX - outerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 이동 거리를 부드럽게 만들기 위해 2배로 계산
    outerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 링크
  const openExternalLink = (event, url) => {
    event.preventDefault();
    event.stopPropagation();

    if (window && window.electron) {
      window.electron.send("open-link-external", url); // 일렉트론 환경에서 링크 열기
    } else {
      window.open(url, "_blank"); // 웹 환경에서 링크 열기
    }
  };

  // UI 열고 닫기
  const onOpenUi = (e) => {
    e.open = !e.open;

    for (let i = 0; i < e.sites.length; i++) {
      if (e.open) {
        e.sites[i].visibility = "visible";
      } else {
        e.sites[i].visibility = "hidden";
      }
    }

    setSite([...site]);
  };

  // 안에 Li 그리기
  const renderSiteLi = (e) => {
    let siteLi = [];

    for (let i = 0; i < e.sites.length; i++) {
      siteLi.push(
        <ul
          key={e.sites[i].name}
          style={{
            visibility: e.sites[i].visibility,
            height: e.sites[i].visibility === "visible" ? "auto" : "0px",
            margin: e.sites[i].visibility === "visible" ? "8px 0px" : "0px",
          }}
        >
          <li style={{ paddingLeft: "30px" }}>
            <p
              style={{
                width: "fit-content",
                cursor: "pointer",
              }}
              onClick={(event) => openExternalLink(event, e.sites[i].url)}
            >
              {e.sites[i].name}
            </p>
          </li>
        </ul>
      );
    }

    return siteLi;
  };

  // 사이트 검색 및 그리기
  const renderSite = (e) => {
    return (
      <div
        className="rendersite"
        key={e.name}
        onClick={() => onOpenUi(e)}
        style={{
          visibility: e.visibility,
          height: e.visibility === "visible" ? "auto" : "0px",
          margin: e.visibility === "visible" ? "10px" : "0px",
          width: e.visibility === "visible" ? "250px" : "0px",
        }}
      >
        <p
          className="rendersite-p"
          style={{
            padding: e.open ? "15px 0px 10px 25px" : "15px 0px 15px 25px",
            width: e.visibility === "visible" ? "250px" : "0px",
          }}
        >
          {e.name + " (" + numSearch(e) + ")"}
        </p>
        <div
          className="rendersite-ul-div"
          style={{
            visibility: e.open ? "visible" : "hidden",
            height: e.open ? "auto" : "0px",
            marginBottom: e.open ? "20px" : "0px",
          }}
        >
          {renderSiteLi(e)}
        </div>
      </div>
    );
  };

  // 사이트 그리기
  const renderSiteCollection = () => {
    return site.map((e) => {
      return renderSite(e);
    });
  };

  // 값 넣기
  const onInputTextChange = (e) => {
    let updatedSite = [...site];
    let isVisibility;
    let isSiteVisibility;
    let isOpen;
    let isPass;

    if (!!e.target.value) {
      let name = "";

      for (let i = 0; i < updatedSite.length; i++) {
        isVisibility = "hidden";
        isSiteVisibility = "hidden";
        isOpen = false;
        isPass = false;

        name = String(updatedSite[i].otherName).toUpperCase();

        if (name.includes(String(e.target.value).toUpperCase())) {
          isVisibility = "visible";
          isSiteVisibility = "visible";
          isOpen = true;
          isPass = true;
        }

        if (!isPass) {
          for (let j = 0; j < updatedSite[i].sites.length; j++) {
            isSiteVisibility = "hidden";

            name = String(updatedSite[i].sites[j].otherName).toUpperCase();

            if (name.includes(String(e.target.value).toUpperCase())) {
              isVisibility = "visible";
              isSiteVisibility = "visible";
              isOpen = true;
            }

            updatedSite[i].sites[j].visibility = isSiteVisibility;
          }
        }

        updatedSite[i].visibility = isVisibility; // 해당 요소에 대한 open 상태를 설정합니다.
        updatedSite[i].open = isOpen;

        if (isPass) {
          for (let j = 0; j < updatedSite[i].sites.length; j++) {
            updatedSite[i].sites[j].visibility = isSiteVisibility;
          }
        }
      }
    } else {
      updatedSite.forEach((item) => {
        item.visibility = "visible";
        item.open = false;
        item.sites.forEach((item2) => {
          item2.visibility = "hidden";
        });
      });
    }

    setSite(updatedSite); // 변경된 배열을 상태로 설정합니다.
  };

  const numSearch = (e) => {
    let count = 0;

    for (let i = 0; i < e.sites.length; i++) {
      if (e.sites[i].visibility === "visible") {
        count += 1;
      } else {
        if (count === 0 && i === e.sites.length - 1) {
          count = e.sites.length;
        }
      }
    }

    return count;
  };

  return (
    <div>
      <div className="input-div">
        <div>
          <input
            type="text"
            onChange={(e) => onInputTextChange(e)}
            placeholder="스페이스 시 전체 오픈."
          ></input>
        </div>
      </div>
      <div
        ref={outerRef}
        style={{ overflow: "hidden", margin: "0px 50px" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="outter-div" ref={innerRef}>
          {renderSiteCollection()}
        </div>
      </div>
    </div>
  );
}

export default SiteCollection;

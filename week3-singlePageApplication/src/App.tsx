
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import React, { useEffect, useState } from "react";

// 라우트별 컴포넌트 정의
const Home = () => <h1> Home Page</h1>;
const About = () => <h1> About Page</h1>;
const Contact = () => <h1> Contact Page</h1>;
const NotFound = () => <h1>404 Not Found</h1>;

type Route = "/" | "/about" | "/contact";

// 라우터 함수
function getComponent(path: string) {
  switch (path as Route) {
    case "/":
      return <Home />;
    case "/about":
      return <About />;
    case "/contact":
      return <Contact />;
    default:
      return <NotFound />;
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // popstate 이벤트 → 브라우저 뒤로/앞으로 이동 처리
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 네비게이션 함수
  const navigate = (path: Route) => (event: React.MouseEvent) => {
    event.preventDefault();
    window.history.pushState({}, "", path); // URL 변경 (리로드 없음)
    setCurrentPath(path); // 화면 갱신
  };

  return (
    <div>
      <nav>
        <a href="/" onClick={navigate("/")}>Home</a> |{" "}
        <a href="/about" onClick={navigate("/about")}>About</a> |{" "}
        <a href="/contact" onClick={navigate("/contact")}>Contact</a>
      </nav>
      <hr />
      <div>{getComponent(currentPath)}</div>
    </div>
  );
}
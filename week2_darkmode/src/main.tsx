import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";                  // ← Tailwind 적용 필수
import { ThemeProvider } from "./context/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

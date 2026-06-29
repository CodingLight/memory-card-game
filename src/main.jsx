import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// 在根节点挂载 React 应用，并通过 StrictMode 帮助开发阶段暴露潜在副作用问题。
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

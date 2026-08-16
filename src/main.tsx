import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource-variable/outfit";
import "./styles/AppReset.css";
import App from "./App";
import { startPaymentNotifications } from "./lib/paymentNotifications";

const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme === "dark" ? "dark" : "light";
localStorage.setItem("theme", initialTheme);
document.documentElement.dataset.theme = initialTheme;
document.documentElement.style.colorScheme = initialTheme;

startPaymentNotifications();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

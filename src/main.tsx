import { init as initTMA, LaunchParamsRetrieveError } from "@telegram-apps/sdk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import TmaErrorApp from "./TmaErrorApp";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

try {
  initTMA();

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (e) {
  if (e instanceof LaunchParamsRetrieveError) {
    console.warn("Opened outside Telegram Mini App");

    root.render(<TmaErrorApp />);
  } else {
    throw e;
  }
}

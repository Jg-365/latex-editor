import { createRoot } from "react-dom/client";
import { AppUiProvider } from "@canva/app-ui-kit";
import { App } from "./app";
import "./styles/global.css";

const root = createRoot(document.getElementById("root") as HTMLElement);

function render() {
  root.render(
    <AppUiProvider>
      <App />
    </AppUiProvider>,
  );
}

render();

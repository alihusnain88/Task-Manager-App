import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppThemeProvider from "./theme/AppThemeProvider.tsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
        <DndProvider backend={HTML5Backend}>
          <AppThemeProvider>
            <App />
          </AppThemeProvider>
        </DndProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppThemeProvider from "./theme/AppThemeProvider.tsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { store, persistor } from "./store/index.ts";
import { PersistGate } from "redux-persist/integration/react";
import TaskManagerApp from "./TaskManagerApp.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <DndProvider backend={HTML5Backend}>
          <AppThemeProvider>
            <App />
          </AppThemeProvider>
        </DndProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);

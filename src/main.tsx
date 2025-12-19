import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AppThemeProvider from "./theme/AppThemeProvider.tsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import {store, persistor} from "./store/index.ts";
import { BrowserRouter } from "react-router";
import App3 from "./App3.tsx";
import TasksGridView from "./views/TasksGridView.tsx";
import AppRouter from "./routes/AppRouter.tsx";
import { PersistGate } from "redux-persist/integration/react";
// import Test from "./Test.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <DndProvider backend={HTML5Backend}>
          <AppThemeProvider>
            <AppRouter />
          </AppThemeProvider>
        </DndProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);

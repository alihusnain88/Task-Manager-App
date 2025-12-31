import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import boardsReducer from "./slices/boardsSlice";
import tasksReducer from "./slices/tasksSlice";
import gridStateReducer from "./slices/gridStateSlice";
import themeReducer from "./slices/themeSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme", "boards", "tasks", "gridState"],
};

const rootReducer = combineReducers({
  boards: boardsReducer,
  tasks: tasksReducer,
  gridState: gridStateReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

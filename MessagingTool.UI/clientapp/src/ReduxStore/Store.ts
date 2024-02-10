import { combineReducers, configureStore } from "@reduxjs/toolkit";
import messageProgress from "./MessageProgressSlice";

const reducers = combineReducers({
  messageProgress,
});

export const store = configureStore({
  reducer: {
    reducers,
  },
});

export type MessageState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

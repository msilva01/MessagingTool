import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

interface MessageProgressState {
  messageStatus: "idle" | "processing" | "failed";
  value: string;
}

const initialState: MessageProgressState = {
  messageStatus: "idle",
  value: "",
};

const MessageProgressSlice = createSlice({
  name: "messageProgress",
  initialState,
  reducers: {
    processing: (state) => {
      state.messageStatus = "processing";
    },
    finished: (state, action: PayloadAction<string>) => {
      state.messageStatus = "idle";
      state.value = action.payload;
    },
  },
});

export const { processing, finished } = MessageProgressSlice.actions;
export default MessageProgressSlice.reducer;

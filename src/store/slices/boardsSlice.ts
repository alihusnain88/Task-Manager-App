import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { type Board } from "../../types";

interface BoardsState {
  list: Board[];
  activeBoardID: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  list: [],
  activeBoardID: null,
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/task-manager/list.json"
      );
      if (!res.ok) throw new Error("Failed to fetch boards");

      const data = await res.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Could not load boards");
    }
  }
);

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setActiveBoardID: (state, action) => {
      state.activeBoardID = action.payload;
    },

    addBoard: (state, action) => {
      state.list.push(action.payload);
      state.activeBoardID = action.payload.id;
    },
    updateBoardName: (
      state,
      action: PayloadAction<{ boardID: string; name: string }>
    ) => {
      const board = state.list.find((b) => b.id === action.payload.boardID);
      if (board) board.name = action.payload.name;
    },
    deleteBoard: (state, action) => {
      state.list = state.list.filter((curr) => curr.id !== action.payload);
      if (state.activeBoardID === action.payload) {
        state.activeBoardID = state.list[0]?.id ?? null;
      }
    },
    setBoards: (state, action) => {
      state.list = action.payload;
      if (state.activeBoardID === null && action.payload.length > 0) {
        state.activeBoardID = action.payload[0].id;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
  state.loading = false;
  
  // 1. Format the API boards
  const apiBoards = action.payload.map((b: any) => ({ ...b, id: String(b.id) }));

  // 2. Identify boards that are ONLY in your local state (User Created)
  // We assume a board is "User Created" if its ID doesn't exist in the API response
  const userCreatedBoards = state.list.filter(
    (existingBoard) => !apiBoards.find((apiB) => apiB.id === existingBoard.id)
  );

  // 3. Combine them: API boards first, then User boards
  state.list = [...apiBoards, ...userCreatedBoards];

  // 4. Don't lose your persisted activeBoardID
  if (!state.activeBoardID && state.list.length > 0) {
    state.activeBoardID = state.list[0].id;
  }
})
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { setActiveBoardID, addBoard, updateBoardName, deleteBoard, setBoards} =
  boardsSlice.actions;
export default boardsSlice.reducer;

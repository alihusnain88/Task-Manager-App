import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface GridState {
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
}

const initialState: GridState = {
  columnOrder: [],
  columnVisibility: {},
};

const gridStateSlice = createSlice({
  name: "gridState",
  initialState,
  reducers: {
    setColumnOrder(state, action: PayloadAction<string[]>) {
      state.columnOrder = action.payload;
    },
    setColumnVisibility(state, action: PayloadAction<Record<string, boolean>>) {
      state.columnVisibility = action.payload;
    },
  },
});

export const { setColumnOrder, setColumnVisibility } = gridStateSlice.actions;
export default gridStateSlice.reducer;

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type Task, type Board, type TaskStatus } from "../../types";

interface TasksState {
  byBoardID: Record<string, Task[]>;
  isTaskDialogOpen: boolean;
  editingTask?: Task | null;
  loading?: boolean;
  error?: string | null;
}

const initialState: TasksState = {
  byBoardID: {},
  isTaskDialogOpen: false,
  editingTask: null,
  loading: false,
  error: null,
};

export const fetchTasksByBoard = createAsyncThunk<
  { boardId: string; tasks: Task[] },
  Board,
  { rejectValue: string }
>("tasks/fetchTasksByBoard", async (board, thunkAPI) => {
  try {
    if (!board.link) {
      return { boardId: board.id, tasks: [] };
    }

    const res = await fetch(board.link);

    if (!res.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const data = await res.json();

    return {
      boardId: board.id,
      tasks: data.tasks,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue("Could not load tasks");
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasksForBoard: (
      state,
      action: PayloadAction<{ boardID: string; tasks: Task[] }>
    ) => {
      state.byBoardID[action.payload.boardID] = action.payload.tasks;
    },

    addTask: (
      state,
      action: PayloadAction<{
        boardID: string;
        task: Task;
        nearTaskID?: string;
      }>
    ) => {
      const { boardID, task, nearTaskID } = action.payload;
      if (!state.byBoardID[boardID]) {
        state.byBoardID[boardID] = [];
        return;
      }
      const index = state.byBoardID[boardID].findIndex(
        (curr) => curr.id === nearTaskID
      );

      state.byBoardID[boardID].splice(index + 1, 0, task);
    },

    updateTask: (
      state,
      action: PayloadAction<{
        boardID: string;
        task: Task;
      }>
    ) => {
      const { boardID, task } = action.payload;
      const tasks = state.byBoardID[boardID];
      if (!tasks) return;

      const index = tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...task };
      }
    },

    moveTask: (
      state,
      action: PayloadAction<{
        boardID: string;
        taskID: string;
        newStatus: TaskStatus;
      }>
    ) => {
      const { boardID, taskID, newStatus } = action.payload;
      const tasks = state.byBoardID[boardID];
      if (!tasks) return;

      const task = tasks.find((t) => t.id === taskID);
      if (task) {
        task.status = newStatus;
      }
    },

    deleteTasksForBoard: (state, action: PayloadAction<string>) => {
      delete state.byBoardID[action.payload];
    },

    deleteTaskByID: (
      state,
      action: PayloadAction<{ boardID: string; taskID: string }>
    ) => {
      const { boardID, taskID } = action.payload;
      state.byBoardID[boardID] = state.byBoardID[boardID].filter(
        (curr) => curr.id !== action.payload.taskID
      );
    },

    openAddTaskDialog(state) {
      state.isTaskDialogOpen = true;
      state.editingTask = null;
    },

    openEditTaskDialog(state, action: PayloadAction<Task>) {
      state.isTaskDialogOpen = true;
      state.editingTask = action.payload;
    },

    closeTaskDialog(state) {
      state.isTaskDialogOpen = false;
      state.editingTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByBoard.fulfilled, (state, action) => {
        state.loading = false;

        const existingTasks = state.byBoardID[action.payload.boardId] ?? [];
        const fetchedTasks = action.payload.tasks;

        const mergedTasks = [
          ...existingTasks,
          ...fetchedTasks.filter(
            (f) => !existingTasks.some((e) => e.id === f.id)
          ),
        ];

        state.byBoardID[action.payload.boardId] = mergedTasks;
      })

      .addCase(fetchTasksByBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const {
  setTasksForBoard,
  addTask,
  updateTask,
  moveTask,
  deleteTasksForBoard,
  openAddTaskDialog,
  openEditTaskDialog,
  closeTaskDialog,
  deleteTaskByID,
} = tasksSlice.actions;

export default tasksSlice.reducer;

import React, { useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Sidebar from "./components/layout/Sidebar";
import MainPanel from "./components/layout/MainPanel";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "./store";
import {
  fetchBoards,
  setActiveBoardID,
  addBoard,
  deleteBoard,
} from "./store/slices/boardsSlice";
import {
  fetchTasksByBoard,
  addTask,
  moveTask,
} from "./store/slices/tasksSlice";
import { type Task, type Board } from "./types";
import TasksGridView from "./views/TasksGridView";

const App3: React.FC = () => {  
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const boards = useSelector((state: RootState) => state.boards.list);
  const activeBoardID = useSelector(
    (state: RootState) => state.boards.activeBoardID
  );
  const tasks = useSelector((state: RootState) =>
    activeBoardID ? state.tasks.byBoardID[activeBoardID] ?? [] : []
  );

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);
  // --------------------
  useEffect(() => {
  if (boards.length === 0) return;

  boards.forEach((board) => {
    dispatch(fetchTasksByBoard(board));
  });
}, [boards, dispatch]);
// ----------------------

  useEffect(() => {
    if (!activeBoardID || boards.length === 0) return;

    const board = boards.find((b) => b.id === activeBoardID);
    if (!board) return;

    dispatch(fetchTasksByBoard(board));
  }, [activeBoardID, boards, dispatch]);

  const handleAddBoard = (newBoard: Board) => {
    dispatch(addBoard(newBoard));
    dispatch(setActiveBoardID(newBoard.id));
  };

  const handleDeleteBoard = (boardID: string) => {
    dispatch(deleteBoard(boardID));
  };

  const handleAddTask = (newTask: Task, isEdit = false) => {
    if (!activeBoardID) return;
    dispatch(addTask({ boardID: activeBoardID, task: newTask }));
  };



  return (
    <TasksGridView />
  )
}

export default App3
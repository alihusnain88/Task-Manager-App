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

const App: React.FC = () => {  
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
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage:
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROPjjQa19O8Fsew-uX_WYE4MQtngjdqf2gLQ&s')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        sx={{
          mt: 2,
          mb: 2,
          fontWeight: "bold",
          color: theme.palette.text.primary,
        }}
      >
        Task Manager App
      </Typography>

      <Box
        sx={{
          width: "80%",
          height: "83vh",
          maxWidth: "1600px",
          borderRadius: "20px",
          p: "10px",
          background: "linear-gradient(175deg, #1d244e 0%, #5f2c3f 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.37)",
          display: "flex",
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundColor: theme.palette.background.paper,
            border: "8px solid #1c1c1e",
            borderRadius: "15px",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <Sidebar />

          <MainPanel
            tasks={tasks}
            onAddTask={handleAddTask}
            
          />
          {/* <TasksGridView /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default App;

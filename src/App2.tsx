import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "./store";
import { fetchBoards, setActiveBoardID } from "./store/slices/boardsSlice";
import { fetchTasksByBoard, addTask } from "./store/slices/tasksSlice";
import { v4 as uuidv4 } from "uuid";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const boards = useSelector((state: RootState) => state.boards.list);
  const activeBoardID = useSelector((state: RootState) => state.boards.activeBoardID);
  const tasks = useSelector(
    (state: RootState) =>
      activeBoardID ? state.tasks.byBoardID[activeBoardID] ?? [] : []
  );

  // Fetch boards on mount
  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  // Fetch tasks when active board changes
  useEffect(() => {
    const board = boards.find(b => b.id === activeBoardID);
    if (board) {
      dispatch(fetchTasksByBoard(board));
    }
  }, [activeBoardID, boards, dispatch]);

  const handleAddTask = () => {
    if (!activeBoardID) return;
    const newTask = {
      taskID: uuidv4(),
      title: `Task ${tasks.length + 1}`,
      status: "backlog" as const,
      tags: [],
      background: null,
    };
    dispatch(addTask({ boardID: activeBoardID, task: newTask }));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Redux Task Manager Test
      </Typography>

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Boards */}
        <Box>
          <Typography variant="h6">Boards</Typography>
          {boards.map(board => (
            <Button
              key={board.id}
              variant={board.id === activeBoardID ? "contained" : "outlined"}
              onClick={() => dispatch(setActiveBoardID(board.id))}
              sx={{ display: "block", mb: 1 }}
            >
              {board.name}
            </Button>
          ))}
        </Box>

        {/* Tasks */}
        <Box>
          <Typography variant="h6">Tasks for Active Board</Typography>
          {tasks.map(task => (
            <Box
              key={task.id}
              sx={{
                p: 1,
                mb: 1,
                border: "1px solid gray",
                borderRadius: 1,
              }}
            >
              {task.title} — {task.status}
            </Box>
          ))}
          <Button variant="contained" onClick={handleAddTask} sx={{ mt: 2 }}>
            Add Task
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default App;

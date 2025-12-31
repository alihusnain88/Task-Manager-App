import { Box, Button, Typography, useTheme } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";
import MainPanel from "../components/layout/MainPanel";
import type { Board, Task, TaskStatus } from "../types";

interface PanelViewProps {
  boards: Board[];
   activeBoardID: number | null, 
  setActiveBoardID: (id: number) => void,
  onDeleteBoard: (id: number) => void,
  onAddBoard: (board: Board) => void,
  tasksForBoard: Task[],
  onAddTask: (task: Task) => void,
  onMoveTask: (taskID: number, newStatus: TaskStatus, toIndex: number) => void,
  onReorderTask: ({boardID, fromStatus, toStatus, fromIndex, toIndex}:{boardID: number | null, fromStatus: TaskStatus, toStatus: TaskStatus, fromIndex: number, toIndex: number}) => void,
  onToggleView: ()=>void,
  onEditTask: (task: Task) => void,
}
const PanelView = ({
  boards,
  activeBoardID,
  setActiveBoardID,
  onDeleteBoard,
  onAddBoard,
  tasksForBoard,
  onAddTask,
  onMoveTask,
  onReorderTask,
  onToggleView,
  onEditTask,
}: PanelViewProps) => {

  const theme = useTheme();
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
      <Button 
        onClick={onToggleView}
        sx={{
          position: "fixed",
          left: 10,
          top: 15,
          borderRadius: "8px",
          color: "white",
          backgroundColor: "#7b1a1aff",
          "&:hover": { backgroundColor: "#bc2222ff" },
        }}
      >
        Grid View
      </Button>
      <Typography
        variant="h4"
        textAlign="center"
        sx={{
          mt: 4,
          mb: 2,
          fontWeight: "bold",
          color: 'white',
        }}
      >
      Task Manager App
      </Typography>

      <Box
        sx={{
          width: "80%",
          height: "83vh",
          maxWidth: "1600px",
          borderRadius: theme.shape.borderRadius,
          p: "10px",
          background: "linear-gradient(175deg, #1d244e 0%, #5f2c3f 100%)",
          boxShadow: theme.shadows[4],
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
          <Sidebar
            boards={boards}
            activeBoardID={activeBoardID}
            setActiveBoardID={setActiveBoardID}
            onDeleteBoard={onDeleteBoard}
            onAddBoard={onAddBoard}
          />
          <MainPanel
            activeBoardID={activeBoardID}
            tasksForBoard={tasksForBoard}
            totalBoards={boards?.length || 0}
            totalTasksForBoard={tasksForBoard.length}
            onAddTask={onAddTask}
            onMoveTask={onMoveTask}
            onReorderTask={onReorderTask}
            onEditTask={onEditTask}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PanelView;

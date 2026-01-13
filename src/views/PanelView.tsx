import { Box, Button, Typography, useTheme } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";
import MainPanel from "../components/layout/MainPanel";
import type { Board, Task, TaskStatus } from "../types";
import { useNavigate } from "react-router";
import { useMediaQuery, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

interface PanelViewProps {
  boards: Board[];
  activeBoardID: number | null;
  setActiveBoardID: (id: number) => void;
  onDeleteBoard: (id: number | null) => void;
  onAddBoard: (board: Board) => void;
  tasksForBoard: Task[];
  onAddTask: (task: Task) => void;
  onMoveTask: (taskID: number, newStatus: TaskStatus, toIndex: number) => void;
  onEditTask: (task: Task) => void;
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
  onEditTask,
}: PanelViewProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
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
        px: { xs: 2, sm: 1, md: 0 },
      }}
    >
      {isMobile && (
        <IconButton
          onClick={() => setIsSidebarOpen(true)}
          sx={{
            position: "fixed",
            right: 10,
            top: 15,
            color: "white",
            backgroundColor: "#7b1a1aff",
            borderRadius: 5,
            zIndex: 10,
            mb: 1,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Box
        sx={{
          width: { xs: "105vw", sm: "100vw", md: "98vw" },
          mt: 4,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
        disableElevation
        disableRipple
          onClick={() => navigate("/grid-view")}
          sx={{
            height: 40,
            borderRadius: "8px",
            color: "white",
            backgroundColor: "#7b1a1aff",
            fontSize: { xs: "0.75rem", md: "0.9rem" },
            px: { xs: 1.5, md: 2 },
            py: { xs: 0.5, md: 0.75 },
            whiteSpace: "nowrap",
            "&:hover": { backgroundColor: "#bc2222ff" },
          }}
        >
          Grid View
        </Button>

        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            width: "100vw",
            fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
            fontWeight: "bold",
            color: "white",
          }}
        >
          Task Manager App
        </Typography>
      </Box>

      <Box
        sx={{
          width: {
            xs: "100%",
            sm: "95%",
            md: "85%",
          },
          height: {
            xs: "30vh",
            sm: "50vh",
            md: "83vh",
          },
          borderRadius: theme.shape.borderRadius,
          p: { xs: 1, sm: 2, md: 1 },
          mt: { xs: 3, sm: 2, md: 0 },
          background: "linear-gradient(175deg, #1d244e 0%, #5f2c3f 100%)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundColor: theme.palette.background.paper,
            // backgroundColor: 'red',
            border: "8px solid #1c1c1e",
            borderRadius: "15px",
            overflow: "hidden",
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          {isMobile ? (
            <Drawer
              anchor="left"
              open={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              slotProps={{
                paper: {
                  sx: { width: "50%", maxWidth: 300 },
                },
              }}
            >
              <Sidebar
                boards={boards}
                activeBoardID={activeBoardID}
                setActiveBoardID={(id) => {
                  setActiveBoardID(id);
                  setIsSidebarOpen(false);
                }}
                onDeleteBoard={onDeleteBoard}
                onAddBoard={onAddBoard}
              />
            </Drawer>
          ) : (
            <Box
              sx={{
                width: 280,
                height: "100%",
              }}
            >
              <Sidebar
                boards={boards}
                activeBoardID={activeBoardID}
                setActiveBoardID={setActiveBoardID}
                onDeleteBoard={onDeleteBoard}
                onAddBoard={onAddBoard}
              />
            </Box>
          )}
          <Box
            sx={{
              flex: 1,
              overflow: { xs: "auto", md: "hidden" },
            }}
          >
            <MainPanel
              activeBoardID={activeBoardID}
              tasksForBoard={tasksForBoard}
              totalBoards={boards?.length || 0}
              totalTasksForBoard={tasksForBoard.length}
              onAddTask={onAddTask}
              onMoveTask={onMoveTask}
              onEditTask={onEditTask}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PanelView;

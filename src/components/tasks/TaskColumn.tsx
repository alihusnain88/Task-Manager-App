import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import TaskCard from "./TaskCard";
import AddIcon from "@mui/icons-material/Add";
import { STATUS_DOTS } from "../../utils/coloredDotsHelper";
import type { Column, Task, TaskStatus } from "../../types";

interface TaskColumnProps {
  activeBoardID: number;
  column: Column;
  tasks: Task[];
  onOpen: () => void;
  onMoveTask: (taskID: number, newStatus: TaskStatus, toIndex: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const TaskColumn = ({
  activeBoardID,
  column,
  tasks,
  onOpen,
  onMoveTask,
  setIsOpen,
  editingTask,
  setEditingTask,
  isEditing,
  setIsEditing,
}: TaskColumnProps) => {
  
  const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);
  const theme = useTheme()
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 

    const data = JSON.parse(e.dataTransfer.getData("application/json"));

    onMoveTask(data.taskID, column.key, sortedTasks?.length || 0);
  };

  return (
    <Container
      disableGutters
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{ minWidth: "25%", minHeight: "100%" }}
    >
      <Box sx={{ flex: 1, p: 0, minHeight: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            gap: 0.5,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: STATUS_DOTS[column.key],
            }}
          />
          <Typography
            fontWeight={400}
            fontSize={12}
          >{`${column.title} (${tasks?.length})`}</Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {sortedTasks?.map((task, index) => (
            <TaskCard
              key={task.taskID}
              activeBoardID={activeBoardID}
              task={task}
              index={index}
              onMoveTask={onMoveTask}
              setIsOpen={setIsOpen}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          ))}
        </Box>

        {column.key === "backlog" && (
          <Button
            variant="contained"
            disableElevation
            disableRipple
            onClick={onOpen}
            endIcon={<AddIcon />}
            sx={{
              mt: 1,
              px: { xs: 0.7, sm: 2, md: 2 },
              gap: { sm: 0.5, md: 2 }, 
              height: { xs: 30, sm: 40, md: 30 },
              width: "100%",
              borderRadius: { xs: "8px", md: "10px" },
              fontSize: { xs: "0.55rem", sm: "0.9rem", md: "0.7rem" },
              backgroundColor: theme.palette.mode === "dark" ? "rgb(195, 218, 250)" : "rgb(81, 81, 81)",
              color: theme.palette.mode === "dark" ? "rgb(51, 86, 211)" : "rgb(242, 242, 242)",
              "&:hover": { backgroundColor: theme.palette.mode === "dark" ? "rgb(168, 198, 239)" : "rgb(75, 75, 75)"},
            }}
          >
            Add new task card
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default TaskColumn;

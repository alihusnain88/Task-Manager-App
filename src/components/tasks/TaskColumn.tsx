import React from "react";
import { Box, Typography, Button } from "@mui/material";
import TaskCard from "./TaskCard";
import AddIcon from "@mui/icons-material/Add";
import { type Task } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { moveTask } from "../../store/slices/tasksSlice";
import { type RootState, type AppDispatch } from "../../store";

interface Column {
  key: Task["status"];
  title: string;
}

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
}

export const STATUS_DOTS: Record<Task["status"], string> = {
  "backlog": "#c94040ff",
  "in-progress": "#f59e0b",
  "in-review": "#a855f7",
  "completed": "#22c55e",
};

const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  tasks,
  onTaskClick,
  onAddTask,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const activeBoardID = useSelector(
    (state: RootState) => state.boards.activeBoardID
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!activeBoardID) return;

    const taskID = e.dataTransfer.getData("taskID");
    const oldStatus = e.dataTransfer.getData("taskStatus") as Task["status"];

    if (taskID && oldStatus !== column.key) {
      dispatch(
        moveTask({
          boardID: activeBoardID,
          taskID,
          newStatus: column.key,
        })
      );
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ minWidth: "25%" }}
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
          <Typography fontWeight={400} fontSize={12}>
            {`${column.title} (${tasks.length})`}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </Box>

        {column.key === "backlog" && (
          <Button
            variant="contained"
            onClick={onAddTask}
            endIcon={<AddIcon />}
            sx={{
              mt: 1,
              gap: 2,
              height: "30px",
              maxWidth: "100%",
              width: "100%",
              borderRadius: "10px",
              fontSize: "0.7rem",
              backgroundColor: "rgb(195 218 250)",
              color: "rgb(51 86 211)",
              "&:hover": {
                backgroundColor: "gray",
                color: "white",
                transition: "none",
              },
            }}
          >
            Add new task card
          </Button>
        )}
      </Box>
    </div>
  );
};

export default TaskColumn;

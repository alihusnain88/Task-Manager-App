import { useParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import type { Task } from "../types";

const TaskView = ({ allTasks }: { allTasks: Task[] }) => {
  const { taskID } = useParams();
  const task = allTasks.find((task) => task.taskID === Number(taskID));

  if (!task) return <Typography>Task not found</Typography>;

  return (
    <Container sx={{ m: 4}}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Task: {task.title}
      </Typography>
      <Typography variant="h5">
        Status:{" "}
        {task.status
          ?.split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </Typography>
      <Typography variant="h5">Tags: {task.tags?.join(", ")}</Typography>
      {task.background && (
        <Box
          component="img"
          src={task.background}
          alt="task"
          sx={{
            maxWidth: 600,
            marginTop: 6,
            height: 200,
            borderRadius: 2,
            objectFit: "cover",
          }}
        />
      )}
    </Container>
  );
};

export default TaskView;

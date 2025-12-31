import { useParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import type { Task } from "../types";

const TaskView= ({allTasks}: {allTasks: Task[]}) => {
  const { taskID } = useParams();
  const task = allTasks.find((task) => task.taskID===Number(taskID)) 

  if (!task) return <Typography>Task not found</Typography>;

  return (
    <Container sx={{m: 4}}>
      <Typography variant="h4" sx={{marginBottom: 2}}>Task: {task.title}</Typography>
      <Typography variant="h5">Status: {task.status?.split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}</Typography>
      <Typography variant="h5">Tags: {task.tags?.join(", ")}</Typography>
      {/* <Box height='200px' width='400px' sx={{backgroundColor: 'red'}}> */}
      {task.background && <img src={task.background} alt="task" style={{ maxWidth: 600, marginTop: 26}} />}
      {/* </Box> */}
    </Container>
  );
};

export default TaskView;
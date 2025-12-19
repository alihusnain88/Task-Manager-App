import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../store";
import { Container, Typography } from "@mui/material";

const TaskView: React.FC = () => {
  const { taskID } = useParams<{ taskID: string }>();
  const allTasksByBoard = useSelector((state: RootState) => state.tasks.byBoardID);

  const task = Object.values(allTasksByBoard)
    .flat()
    .find((t) => String(t.id) === String(taskID));

  if (!task) return <Typography>Task not found</Typography>;

  return (
    <Container sx={{m: 4}}>
      <Typography variant="h4" sx={{marginBottom: 2}}>Task: {task.title}</Typography>
      <Typography variant="h5">Status: {task.status
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}</Typography>
      <Typography variant="h5">Tags: {task.tags?.join(", ")}</Typography>
      {task.background && <img src={task.background} alt="task" style={{ maxWidth: 600, marginTop: 26}} />}
    </Container>
  );
};

export default TaskView;
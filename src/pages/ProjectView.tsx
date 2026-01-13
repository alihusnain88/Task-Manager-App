import { useParams } from "react-router-dom";
import { Container, List, ListItem, Typography } from "@mui/material";
import type {Board, Task} from '../types'

const ProjectView = ({boards, allTasks}: {boards: Board[], allTasks: Task[]}) => {
    
  const { boardID } = useParams();
  const board = boards.find((board) => board.id===Number(boardID))

  if (!board) return <Typography>Project not found</Typography>;

  return (
    <Container sx={{mt: 4}}>
      <Typography variant="h4" mb={2}>{`${board.logo} ${board.name}`}</Typography>
      <Typography variant="h5" m={2} >Tasks: </Typography>
      <List>
        {allTasks.map((t, index) => (
          t.boardID===board.id && (<ListItem key={t.taskID}>{index}. {t.title} - {t.status}</ListItem>)
        ))}
      </List>
    </Container>
  );
};

export default ProjectView; 
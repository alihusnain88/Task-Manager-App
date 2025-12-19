import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../store";
import { Container, List, ListItem, Typography } from "@mui/material";

const ProjectView = () => {
    
  const { projectID } = useParams<{ projectID: string }>();
  const project = useSelector((state: RootState) =>
    state.boards.list.find((b) => b.id === projectID)
  );

  const tasks = useSelector((state: RootState) =>
    projectID ? state.tasks.byBoardID[projectID] ?? [] : []
  );

  if (!project) return <Typography>Project not found</Typography>;

  return (
    <Container sx={{mt: 4}}>
      <Typography variant="h4" mb={2}>{`${project.emoji} ${project.name}`}</Typography>
      <Typography variant="h5" m={2} >Tasks: </Typography>
      <List>
        {tasks.map((t) => (
          <ListItem key={t.id}>{t.id}. {t.title} - {t.status}</ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ProjectView;
import { Container, Button, useTheme, Box } from "@mui/material";
import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BoardsList from "../boards/BoardsList";
import AddBoardDialog from "../boards/AddBoardDialog";
import ThemeToggleButtons from "../../theme/ThemeToggleButtons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { deleteBoard, setActiveBoardID } from "../../store/slices/boardsSlice";
import { deleteTasksForBoard } from "../../store/slices/tasksSlice";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const boardsList = useSelector((state: RootState) => state.boards.list);
  const activeBoardID = useSelector(
    (state: RootState) => state.boards.activeBoardID
  );

  const handleSelect = (id: string) => {
    dispatch(setActiveBoardID(id));
  };
  const handleDelete = (id: string) => {
    dispatch(deleteBoard(id));
    dispatch(deleteTasksForBoard(id));
  };
  return (
    <Container
      sx={{
        minHeight: "100%",
        overflowY: "auto",
        scrollbarWidth: "none",
        width: "25%",
        pt: 2,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
      disableGutters
    >
      <Box sx={{ flex: 1 }}>
        <BoardsList
          boardsList={boardsList}
          activeBoardID={activeBoardID}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
        <Button
          variant="text"
          startIcon={<AddCircleIcon />}
          onClick={() => setIsOpen(true)}
          sx={{
            m: 1,
            textTransform: "none",
            color: theme.palette.text.primary,
            background: "none",
            fontSize: "0.9rem",
            "&:hover": { backgroundColor: theme.palette.action.selected },
          }}
        > 
          Add new board
        </Button>
      </Box>

      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "center",
          position: "sticky",
          bottom: 0,
          backgroundColor: theme.palette.background.paper,
          zIndex: 10,
        }}
      >
        <ThemeToggleButtons />
      </Box>

      <AddBoardDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </Container>
  );
};

export default Sidebar;

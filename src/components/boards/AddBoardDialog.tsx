import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../store";
import { addBoard } from "../../store/slices/boardsSlice";
import { v4 as uuidv4 } from "uuid";
import { type Board } from "../../types";
import { getLogoBackground } from "../../utils/logoBackgroundHelper";
const BOARD_LOGOS = [
  "🛠️",
  "⚙️",
  "🚀",
  "🔑",
  "⏰",
  "🚨",
  "👀",
  "🎯",
  "✈️",
  "⭐",
  "📚",
  "📌",
  "💡",
  "📁",
];

interface AddBoardDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AddBoardDialog = ({ isOpen, setIsOpen }: AddBoardDialogProps) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState<string>("");
  const [emoji, setEmoji] = useState<string>(BOARD_LOGOS[0]);
  const [error, setError] = useState<string>("");

  const handleSave = () => {
    if (!name.trim()) {
      setError("Board name required");
      return;
    }

    const newBoard: Board = {
      id: uuidv4(),
      name,
      emoji,
      tasks: [
        {
          id: uuidv4(),
          title: "Add your backlogs here",
          status: "backlog",
          tags: [],
          background: "",
        },
      ],
    };

    dispatch(addBoard(newBoard));

    setIsOpen(false);
    setName("");
    setEmoji(BOARD_LOGOS[0]);
    setError("");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "transparent" },
        },
        paper: {
          sx: {
            height: "43vh",
            width: "25vw",
            borderRadius: 1,
            overflow: "hidden",
            position: "fixed",
            top: "0",
            left: "30px",
            display: "flex",
            flexDirection: "column",
            background: `
            linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box,
            linear-gradient(160deg, #1d244e, #5f2c3f) border-box
          `,
            border: "6px solid transparent",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
            color: "#cecacaff",
          }}
        >
          <Typography fontSize="0.9rem">New Board</Typography>
          <IconButton onClick={() => setIsOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            px: 2,
            py: 1,
            overflow: "hidden",
          }}
        >
          <Box>
            <Typography fontSize="0.7rem" color="#9d9d9d" gutterBottom>
              Board Name
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Default Board"
              value={name}
              error={!!error}
              helperText={error}
              size="small"
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              sx={{
                "& .MuiInputBase-root": { height: 25, borderRadius: "10px" },
                "& input": { padding: "0 14px" },
              }}
            />
          </Box>

          <Box>
            <Typography fontSize="0.7rem" color="#9d9d9d" gutterBottom>
              Logo
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              {BOARD_LOGOS.map((em) => (
                <Box
                  key={em}
                  onClick={() => setEmoji(em)}
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: getLogoBackground(),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: 14,
                    border:
                      emoji === em
                        ? `3px solid ${theme.palette.primary.main}`
                        : "",
                  }}
                >
                  {em}
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 1,
            py: 1,
            gap: 1,
            display: "flex",
            justifyContent: "start",
          }}
        >
          <Button
            variant="contained"
            endIcon={<CheckIcon />}
            onClick={handleSave}
            size="small"
            sx={{ fontSize: "0.7rem", textTransform: "none" }}
          >
            Create Board
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsOpen(false)}
            sx={{ background: "none" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddBoardDialog;

import { useState } from "react";
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
import { getLogoBackground } from "../../utils/logoBackgroundHelper";
import type { Board } from "../../types";

interface AddBoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  boards: Board[];
  onAddBoard: (board: Board) => void;
}
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

const AddBoardDialog = ({
  isOpen,
  onClose,
  boards,
  onAddBoard,
}: AddBoardDialogProps) => {
  const theme = useTheme();
  const [name, setName] = useState<string>("");
  const [logo, setlogo] = useState<string>(BOARD_LOGOS[0]);
  const [error, setError] = useState<string>("");

  const handleSave = () => {
    if (!name.trim()) {
      setError("Board name required");
      return;
    }
    if (boards.some((board) => board.name === name)) {
      setError("Duplicate Boards");
      return;
    }

    const newBoard = {
      id: boards[boards?.length - 1]?.id + 1 || 0,
      name,
      logo,
      color: getLogoBackground(),
    };

    onAddBoard(newBoard);

    onClose();
    setName("");
    setlogo(BOARD_LOGOS[0]);
    setError("");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
          backgroundColor: theme.palette.background.paper,
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
          <Typography fontSize="0.9rem" color={theme.palette.text.primary}>
            New Board
          </Typography>
          <IconButton onClick={onClose} size="small">
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
            <Typography fontSize="0.7rem" gutterBottom>
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
                "& .MuiInputBase-root": {
                  height: 25,
                  borderRadius: "10px",
                  border: `1px solid ${theme.palette.text.primary}`,
                },
                "& input": { padding: "0 14px" },
              }}
            />
          </Box>

          <Box>
            <Typography fontSize="0.7rem" gutterBottom>
              Logo
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              {BOARD_LOGOS.map((currLogo) => (
                <Box
                  key={currLogo}
                  onClick={() => setlogo(currLogo)}
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
                      logo === currLogo
                        ? `3px solid ${theme.palette.primary.main}`
                        : "",
                  }}
                >
                  {currLogo}
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
            sx={{
              fontSize: "0.7rem",
              textTransform: "none",
              backgroundColor:
                theme.components?.MuiButton?.styleOverrides?.root?.backgroudColor,
            }}
          >
            Create Board
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={onClose}
            sx={{
              border: "1.5px solid #696969",
              fontSize: "0.7rem",
              background: "none",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddBoardDialog;

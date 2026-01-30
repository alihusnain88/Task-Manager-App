import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { type Task, type TaskStatus } from "../../types";
import { useTheme } from "@mui/material";
import { STATUS_DOTS } from "../../utils/coloredDotsHelper";
import { getTagColor } from "../../utils/tagColorsHelper";

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  totalTasksForBoard: number;
  activeBoardID: number | null;
  onAddTask: (task: Task) => void;
  isEditing: boolean;
  editingTask: Task | null;
  onEditTask: (task: Task) => void;
  setIsEditing: (isEditing: boolean) => void;
  setEditingTask: (task: Task | null) => void;
}

const STATUS_OPTIONS: { key: TaskStatus; label: string }[] = [
  { key: "backlog", label: "Backlog" },
  { key: "in-progress", label: "In Progress" },
  { key: "in-review", label: "In Review" },
  { key: "completed", label: "Completed" },
];

const AddTaskDialog = ({
  isOpen,
  onClose,
  totalTasksForBoard,
  activeBoardID,
  onAddTask,
  isEditing,
  editingTask,
  onEditTask,
  setIsEditing,
  setEditingTask,
}: AddTaskDialogProps) => {
  const theme = useTheme();

  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<TaskStatus>("backlog");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [background, setBackground] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (
      isEditing &&
      editingTask !== null &&
      editingTask.boardID === activeBoardID
    ) {
      setTitle(editingTask.title || "");
      setStatus(editingTask.status || "backlog");
      setTags(editingTask.tags || []);
      setBackground(editingTask.background || null);
    } else {
      setTitle("");
      setStatus("backlog");
      setTags([]);
      setBackground(null);
    }
    setError("");
  }, [isOpen, isEditing, editingTask, activeBoardID]);

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (!newTag || tags.includes(newTag)) return;
    setTags([...tags, newTag]);
    setTagInput("");
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError("Name required");
      return;
    }
    if (activeBoardID === null) return;

    if (editingTask) {
      onEditTask({
        ...editingTask,
        title,
        status,
        tags,
        background,
      });
    } else {
      onAddTask({
        taskID: Date.now(),
        boardID: activeBoardID,
        title,
        status,
        tags,
        background,
        priority: totalTasksForBoard + 1,
      });
    }
    handleCloseDialog();
  };
  const handleCloseDialog = () => {
    setIsEditing(false);
    setEditingTask(null);
    onClose();
  };

  const inputSx = {
    "& .MuiInputBase-root": { height: 22, borderRadius: "6px" },
    "& input": { padding: "0 8px", fontSize: "0.7rem" },
    "& input::placeholder": {
      fontSize: "0.65rem",
      color: "#9d9d9d",
      opacity: 1,
    },
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleCloseDialog}
      maxWidth={false}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "transparent" },
        },
        paper: {
          sx: {
            position: "fixed",
            right: { xs: "auto", sm: 25, md: 30 },
            top: { xs: "25%", sm: "30%", md: "35%" },
            width: {
              xs: "60vw",
              sm: "40vw",
              md: "22vw",
            },
            maxHeight: { xs: "75vh", sm: "65vh", md: "55vh" },
            borderRadius: "20px",
            background: `
            linear-gradient(#121212, #121212) padding-box,
            linear-gradient(160deg, #1d244e, #5f2c3f) border-box
          `,
            border: "6px solid transparent",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
            scrollbarWidth: 'none'
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: theme.palette.background.paper,
        }}
      >
        <DialogTitle
          sx={{
            color: theme.palette.text.primary,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            fontSize: { xs: 20, sm: 18, md: 14 },
            fontWeight: "bold",
            pb: 1,
          }}
        >
          Task Details
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            flex: 1,
            px: 2,
            py: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: 50,
              border: !background
                ? `1px dashed ${theme.palette.text.primary}`
                : "none",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
              backgroundImage: background ? `url(${background})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => document.getElementById("task-image-input")?.click()}
          >
            {!background && (
              <Typography
                sx={{ fontSize: "0.65rem", color: theme.palette.text.primary }}
              >
                Click to upload
              </Typography>
            )}
            {background && (
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bgcolor: "rgba(0,0,0,0.4)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setBackground(null);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <input
            type="file"
            id="task-image-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) =>
                  setBackground(ev.target?.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />

          <Box>
            <Typography
              fontSize={{ xs: "0.9rem", sm: "0.8rem", md: "0.7rem" }}
              gutterBottom
              sx={{ color: theme.palette.text.primary }}
            >
              Task Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={title}
              error={!!error}
              helperText={error}
              sx={inputSx}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
            />
          </Box>

          <Box>
            <Typography
              fontSize={{ xs: "0.9rem", sm: "0.8rem", md: "0.7rem" }}
              gutterBottom
              sx={{ color: theme.palette.text.primary }}
            >
              Status
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              SelectProps={{
                IconComponent: () => null,
                renderValue: (selected) => {
                  const option = STATUS_OPTIONS.find((s) => s.key === selected);
                  const dotColor = STATUS_DOTS[selected as TaskStatus];
                  return (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: dotColor,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {option?.label}
                      </Typography>
                    </Box>
                  );
                },
              }}
              sx={{
                ...inputSx,
                "& .MuiSelect-select": {
                  paddingRight: "8px !important",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem
                  key={s.key}
                  value={s.key}
                  sx={{
                    fontSize: "0.75rem",
                    display: "flex",
                    gap: 1.5,
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: STATUS_DOTS[s.key],
                    }}
                  />
                  {s.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <Typography
              fontSize={{ xs: "0.9rem", sm: "0.8rem", md: "0.7rem" }}
              gutterBottom
              sx={{ color: theme.palette.text.primary }}
            >
              Tags
            </Typography>
            {tags.map((tag) => {
              const style = getTagColor(tag);
              return (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => setTags(tags.filter((curr) => curr !== tag))}
                  sx={{ 
                    bgcolor: style.bg,
                    color: style.text,
                    m: 0.4,
                    py: 1,
                    fontSize: "0.75rem",
                    height: "16px",
                  }}
                />
              );
            })}
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tag"
                value={tagInput}
                sx={inputSx}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 2,
            pb: 2,
            pt: 0,
            display: "flex",
            justifyContent: { xs: "space-evenly", md: "start" },
            gap: 1,
            marginTop: "4px",
          }}
        >
          <Button
            variant="contained"
            disableElevation
            disableRipple
            endIcon={<CheckIcon />}
            onClick={handleSave}
            size="small"
            sx={{
              fontSize: "0.7rem",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgb(195, 218, 250)"
                  : "rgb(81, 81, 81)",
              color:
                theme.palette.mode === "dark"
                  ? "rgb(51, 86, 211)"
                  : "rgb(242, 242, 242)",
              borderRadius: "20px",
              "&: hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgb(195, 218, 250)"
                    : "rgb(81, 81, 81)",
              },
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            disableElevation
            disableRipple
            size="small"
            onClick={handleCloseDialog}
            sx={{
              fontSize: "0.7rem",
              border: "1.5px solid #696969",
              background: "none",
              "&: hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgb(65, 65, 65)"
                    : "rgb(196, 196, 196)",
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddTaskDialog;

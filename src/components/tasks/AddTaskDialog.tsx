import React, { useEffect, useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../../store";
import { addTask, updateTask } from "../../store/slices/tasksSlice";
import { STATUS_DOTS } from "./TaskColumn";
import { Link } from "react-router";

interface AddTaskDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  task?: Task | null;
}

const STATUS_OPTIONS: { key: TaskStatus; label: string }[] = [
  { key: "backlog", label: "Backlog" },
  { key: "in-progress", label: "In Progress" },
  { key: "in-review", label: "In Review" },
  { key: "completed", label: "Completed" },
];

const getTagColor = (tag: string) => {
  const t = tag.toLowerCase();
  if (t.includes("technical") || t.includes("react"))
    return { bg: "#dbeafe", text: "#1e40af" };
  if (t.includes("design") || t.includes("concept"))
    return { bg: "#fce7f3", text: "#9d174d" };
  if (t.includes("front")) return { bg: "#dcfce7", text: "#166534" };
  return { bg: "#e2e8f0", text: "#475569" };
};

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  isOpen,
  setIsOpen,
  task,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const activeBoardID = useSelector(
    (state: RootState) => state.boards.activeBoardID
  );

  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<TaskStatus>("backlog");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [background, setBackground] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title ?? "");
        setStatus(task.status ?? "backlog");
        setTags(task.tags ?? []);
        setBackground(task.background ?? null);
      } else {
        setTitle("");
        setStatus("backlog");
        setTags([]);
        setBackground(null);
      }
      setTagInput("");
      setError("");
    }
  }, [task, isOpen]);

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
    if (!activeBoardID) return;

    const newTask: Task = {
      id: task?.id ?? uuidv4(),
      title,
      status,
      tags,
      background,
    };

    if (task) {
      dispatch(updateTask({ boardID: activeBoardID, task: newTask }));
    } else {
      dispatch(addTask({ boardID: activeBoardID, task: newTask }));
    }

    setTitle("");
    setStatus("backlog");
    setTags([]);
    setTagInput("");
    setBackground(null);
    setError("");
    setIsOpen(false);
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
      onClose={() => setIsOpen(false)}
      maxWidth={false}
      BackdropProps={{ sx: { backgroundColor: "transparent" } }}
      PaperProps={{
        sx: {
          position: "fixed",
          right: 30,
          top: "35%",
          width: "20vw",
          maxHeight: "60vh",
          borderRadius: "20px",
          background: `
            linear-gradient(#121212, #121212) padding-box,
            linear-gradient(160deg, #1d244e, #5f2c3f) border-box
          `,
          border: "6px solid transparent",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: theme.palette.background.default,
        }}
      >
        

        <DialogTitle
          sx={{
            color: "#cecaca",
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            fontSize: "0.8rem",
            fontWeight: "bold",
            pb: 1,
          }}
        >
          Task Details
          <Link to={`tasks/${task?.id}`}>
          <Typography
            sx={{ textAlign: "center", color: '#fff', textDecoration: 'underline'}}
          >Open</Typography>
        </Link>
          <IconButton onClick={() => setIsOpen(false)} size="small">
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
              border: !background ? "1px dashed #9d9d9d" : "none",
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
              <Typography sx={{ fontSize: "0.65rem", color: "#9d9d9d" }}>
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
              fontSize="0.5rem"
              gutterBottom
              sx={{ color: "#9d9d9d" }}
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
              fontSize="0.5rem"
              gutterBottom
              sx={{ color: "#9d9d9d" }}
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
                          color: "#fff",
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
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2d2d2d",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#404040",
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
              fontSize="0.5rem"
              gutterBottom
              sx={{ color: "#9d9d9d" }}
            >
              Tags
            </Typography>
            {tags.map((tag) => {
              const style = getTagColor(tag);
              return (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() =>
                    setTags(tags.filter((existing) => existing !== tag))
                  }
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
            justifyContent: "start",
            marginTop: "4px",
          }}
        >
          <Button
            variant="contained"
            endIcon={<CheckIcon />}
            onClick={handleSave}
            size="small"
            sx={{ fontSize: "0.7rem", color: "#ebe9e9", borderRadius: "20px" }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsOpen(false)}
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

export default AddTaskDialog;

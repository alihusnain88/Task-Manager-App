import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Autocomplete,
  TextField,
  useTheme,
  styled,
  MenuItem,
} from "@mui/material";
import {
  DataGridPremium,
  type GridColDef,
  GridDeleteIcon,
  type GridRenderCellParams,
  type GridValidRowModel,
} from "@mui/x-data-grid-premium";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getTagColor } from "../utils/tagColorsHelper";
import type { Board, Task, TaskGridRow, TaskStatus } from "../types";
import { ToastContainer, toast } from "react-toastify";
import AddImageDialog from "../components/dialoges/AddImageDialog";
import DeleteConfirmDialog from "../components/dialoges/DeleteConfirmationDialog";
import { STATUS_DOTS } from "../utils/coloredDotsHelper";

const StyledDataGrid = styled(DataGridPremium)(({ theme }) => ({
  "& .MuiDataGrid-cell": {
    color: theme.palette.text.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: { xs: 1, sm: 1.5, md: 2 },
  },

  "& .MuiDataGrid-columnHeader": {
    backgroundColor: theme.palette.background.default,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 600,
  },
}));

interface GridViewProps {
  boards: Board[] | [];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  allTasks: Task[];
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onDeleteTask: (id: number | null) => void;
}
const GridView = ({
  boards,
  setBoards,
  allTasks,
  setAllTasks,
  onDeleteTask,
}: GridViewProps) => {
  const theme = useTheme();
  const rows = allTasks.map((task, index) => {
    return {
      id: index + 1,
      boardID: task?.boardID,
      taskID: task?.taskID,
      boardName:
        boards.find((board) => board.id === task.boardID)?.name ||
        "Project Not Found",
      taskTitle: task.title,
      status: task.status,
      tags: task.tags,
      background: task.background,
    };
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [selectedRowID, setSelectedRowID] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [taskToDeleteID, setTaskToDeleteID] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleRowClick = (rowID: number) => {
    setSelectedRowID(rowID);
  };

  const handleProcessRowUpdate = (
    newRow: GridValidRowModel,
    oldRow: GridValidRowModel,
  ): GridValidRowModel => {
    const typedNewRow = newRow as TaskGridRow;
    const typedOldRow = oldRow as TaskGridRow;

    if (typedNewRow === typedOldRow) return typedOldRow;

    setAllTasks((prev: Task[]) =>
      prev.map((task) =>
        task.taskID === typedNewRow.taskID
          ? {
              ...task,
              boardID: typedNewRow.boardID,
              title: typedNewRow.taskTitle,
              status: typedNewRow.status,
              tags: typedNewRow.tags || [],
              background: typedNewRow.background || null,
            }
          : task
      )
    );
    if (typedNewRow.boardName !== typedOldRow.boardName) {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === typedNewRow.boardID
            ? { ...board, name: typedNewRow.boardName }
            : board
        )
      );
    }

    return typedNewRow;
  };

  const handleImageClick = (img: string) => {
    setSelectedImage(img);
    setIsOpen(true);
  };

  const handleRemoveImage = () => {
    if (selectedRowID === null) return;

    const targetRow = rows.find((r) => r.id === selectedRowID);

    if (targetRow) {
      setAllTasks((prev) =>
        prev.map((task) =>
          task.taskID === targetRow.taskID
            ? { ...task, background: null }
            : task
        )
      );
      setSelectedImage(null);
      setIsOpen(false);
    }
    toast.success("Image Removed", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme.palette.mode,
    });
  };

  const openFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedRowID !== null) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newImageUrl = ev.target?.result as string;

        const targetRow = rows.find((r) => r.id === selectedRowID);
        if (targetRow) {
          setAllTasks((prev) =>
            prev.map((task) =>
              task.taskID === targetRow.taskID
                ? { ...task, background: newImageUrl }
                : task
            )
          );
          setSelectedImage(newImageUrl);
        }
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    }
    toast.success("Image Uploaded", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme.palette.mode,
    });
  };

  const handleCopyRow = (rowID: number) => {
    const rowToCopy = rows.find((row) => row.id === rowID);

    const originalTask = allTasks.find((t) => t.taskID === rowToCopy?.taskID);
    const copiedTask = {
      ...originalTask,
      taskID: Date.now(),
    } as Task;

    setAllTasks((prev) => {
      const index = prev.findIndex((task) => task.taskID === rowToCopy?.taskID);
      const newTasks = [...prev];
      newTasks.splice(index + 1, 0, copiedTask);
      return newTasks;
    });

    toast.success("Row Copied", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme.palette.mode,
    });
  };

  const columns: GridColDef[] = [
    {
      field: "boardName",
      headerName: "Board",
      flex: 1,
      minWidth: 200,
      editable: true,
      hideable: false,
      valueGetter: (_, row) => row.boardName || "Unknown Project",
      renderCell: (params: GridRenderCellParams<TaskGridRow>) => (
        <Typography
          onClick={() => navigate(`/boards/${params.row.boardID}`)}
          sx={{
            cursor: "pointer",
            fontWeight: 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "100%",
            alignContent: "center",
            justifyItems: "self-start",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          {params.value}      
        </Typography>
      ),
      renderEditCell: (params) => (
        <TextField
          size="small"
          defaultValue={params.value}
          sx={{ width: "90%", mx: "auto" }}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
        />
      ),
    },
    {
      field: "taskTitle",
      headerName: "Task",
      flex: 1,
      minWidth: 220,
      editable: true,
      hideable: false,
      valueParser: (value: string) => value?.trim(),
      valueSetter: (value, row) => ({ ...row, taskTitle: value }),
      renderCell: (params: GridRenderCellParams<TaskGridRow>) => (
        <Typography
          sx={{
            cursor: "pointer",
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "100%",
            alignContent: "center",
            justifyItems: "self-start",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={() => navigate(`/tasks/${params.row.taskID}`)}
        >
          {params.value}       
        </Typography>
      ),
      renderEditCell: (params) => (
        <TextField
          size="small"
          defaultValue={params.value}
          sx={{ width: "90%", mx: "auto" }}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 180,
      editable: true,
      type: "singleSelect",
      valueOptions: ["backlog", "in-progress", "in-review", "completed"],
      renderCell: (params: GridRenderCellParams<TaskGridRow>) => {
        const statusValue = params.value as TaskStatus;
        const displayText = statusValue
          ? statusValue
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          : "";

        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1.5,
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: STATUS_DOTS[statusValue] || "grey",
              }}
            />
            <Typography>{displayText}</Typography>
          </Box>
        );
      },
      renderEditCell: (params) => {
        const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
          { value: "backlog", label: "Backlog" },
          { value: "in-progress", label: "In Progress" },
          { value: "in-review", label: "In Review" },
          { value: "completed", label: "Completed" },
        ];

        return (
          <TextField
            select
            size="small"
            value={params.value}
            onChange={(e) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              })
            }
            sx={{ width: "90%", mx: "auto" }}
            SelectProps={{
              renderValue: (selected) => {
                const statusValue = selected as TaskStatus;
                const option = STATUS_OPTIONS.find(
                  (o) => o.value === statusValue
                );
                const label = option ? option.label : statusValue;

                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: STATUS_DOTS[statusValue] || "grey",
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" noWrap>
                      {label}
                    </Typography>
                  </Box>
                );
              },
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: STATUS_DOTS[option.value] || "grey",
                  }}
                />
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      },
    },

    {
      field: "tags",
      headerName: "Tags",
      flex: 0.8,
      minWidth: 240,
      editable: true,
      renderCell: (params: GridRenderCellParams<TaskGridRow>) => (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", py: 1 }}>
          {params.value?.length > 0 ? (
            params.value?.map((tag: string) => {
              const { text, bg } = getTagColor(tag);
              return (
                <Typography
                  key={tag}
                  onClick={() => {
                    setAllTasks((prev) =>
                      prev.map((task) =>
                        task.taskID === params.row.taskID
                          ? {
                              ...task,
                              tags: task.tags.filter((t) => t !== tag),
                            }
                          : task
                      )
                    );
                  }}
                  sx={{
                    px: 0.5,
                    py: 0.2,
                    bgcolor: bg,
                    color: text,
                    border: `1px solid ${text}`,
                    borderRadius: "800px",
                    fontSize: { xs: 7, sm: 8, md: 9 },
                    fontWeight: 600,
                    textTransform: "capitalize",
                    letterSpacing: 0.5,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.85,
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {tag}
                  {/* <IconButton
                    sx={{
                      color: "black",
                      height: 0,
                      width: 0,
                      border: "1px solid black",
                      padding: 0,
                    }}
                  >
                    <GridCloseIcon fontSize="small" />
                  </IconButton> */}
                </Typography>
              );
            })
          ) : (
            <Typography sx={{ color: "#971616ff" }}>No Tags</Typography>
          )}
        </Box>
      ),
      renderEditCell: (params) => {
        const TAG_OPTIONS = [
          "technical",
          "concept",
          "front-end",
          "design",
          "important",
          "crucial",
        ];
        return (
          <Autocomplete
            multiple
            freeSolo
            disableClearable
            options={TAG_OPTIONS}
            value={params.row.tags || []}
            onChange={(e: React.SyntheticEvent, newValue: string[]) => {
              params.api.setEditCellValue(
                {
                  id: params.id,
                  field: params.field,
                  value: newValue,
                },
                e
              );
            }}
            renderTags={() => null}
            renderInput={(params) => (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 3,
                }}
              >
                <TextField {...params} placeholder="Select or type tags" />
              </Box>
            )}
            size="small"
            sx={{ width: "100%" }}
          />
        );
      },
    },
    {
      field: "background",
      headerName: "Image",
      flex: 0.5,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<TaskGridRow>) => {
        if (!params.value) {
          return (
            <Button
              size="small"
              sx={{
                fontSize: "0.7rem",
                textTransform: "none",
                color: "text.secondary",
              }}
              onClick={() => {
                setSelectedRowID(params.row.id);
                openFileSelect();
              }}
            >
              Add Image
            </Button>
          );
        }
        return (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Box
              component="img"
              src={params.value}
              alt="task-thumb"
              onClick={() => handleImageClick(params.value)}
              sx={{
                width: { xs: 28, sm: 36 },
                height: { xs: 28, sm: 36 },
                color: "black",
                borderRadius: 1,
                cursor: "pointer",
                objectFit: "cover",
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          </Box>
        );
      },
    },
    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   disableExport: true,
    //   flex: 0.5,
    //   minWidth: 140,
    //   renderCell: (params) => (
    //     <IconButton
    //       disableRipple
    //       sx={{
    //         margin: 0,
    //         padding: 0,
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         height: "100%",
    //         color: theme.palette.text.primary,
    //       }}
    //       onClick={() => {
    //         setTaskToDeleteID(params.row.taskID);
    //         setIsDeleteDialogOpen(true);
    //       }}
    //     >
    //       <GridDeleteIcon />
    //     </IconButton>
    //   ),
    // },
    // {
    //   field: "copy-row",
    //   headerName: "Copy",
    //   disableExport: true,
    //   flex: 0.5,
    //   minWidth: 140,
    //   renderCell: (params) => (
    //     <IconButton
    //       disableRipple
    //       sx={{
    //         height: "100%",
    //         margin: 0,
    //         padding: 0,
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         color: theme.palette.text.primary,
    //       }}
    //       onClick={() => handleCopyRow(params.row.id)}
    //     >
    //       <ContentCopyIcon fontSize="small" />
    //     </IconButton>
    //   ),
    // },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 140,
      disableExport: true,
      renderCell: (params: GridRenderCellParams<TaskGridRow>) => (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <IconButton
            disableRipple
            sx={{
              padding: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: theme.palette.text.primary,
            }}
            onClick={() => {
              setTaskToDeleteID(params.row.taskID);
              setIsDeleteDialogOpen(true);
            }}
          >
            <GridDeleteIcon />
          </IconButton>

          <IconButton
            disableRipple
            sx={{
              padding: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: theme.palette.text.primary,
            }}
            onClick={() => handleCopyRow(params.row.id)}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#c5cdd4",
        pt: 1,
        pb: 1,
      }}
    >
           
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={handleUpdateImage}
      />
      <Box
        sx={{
          width: "100%",
          px: 1,
          mb: 1,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          position: "relative"
        }}
      >
        <Button
          disableElevation
          disableRipple
          onClick={() => navigate("/")}
          sx={{
            height: 40,
            borderRadius: "8px",
            color: "white",
            backgroundColor: "#7b1a1aff",
            fontSize: { xs: "0.75rem", md: "0.9rem" },
            px: { xs: 1.9, md: 2 },
            py: { xs: 0.7, md: 0.75 },
            ml: 1,
            mt: -2.5,
            whiteSpace: "nowrap",
            "&:hover": { backgroundColor: "#bc2222ff" },
          }}
        >
          Panel View
        </Button> 
           
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            width: "100vw",
            textAlign: "center",
            fontSize: { xs: "1.5rem", sm: "1.7rem", md: "2rem" },
            fontWeight: "bold",
            mt: {xs: 10, sm: 6, md: 4},
            position: "absolute",
            color: "text.primary",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap"
          }}
        >
          Boards & Tasks Grid    
        </Typography>
      </Box>
         
      <Box
        sx={{
          width: "90%",
          overflowX: "auto",
          mt: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <StyledDataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          processRowUpdate={handleProcessRowUpdate}
          showToolbar
          onRowClick={(params) => handleRowClick(params.row.id)}
          sx={{
            margin: "auto",
            maxWidth: 1300,
            minHeight: { xs: "60vh", sm: "70vh", md: "80vh" },
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontSize: { xs: 25, sm: 23, md: 20 },
          }}
         />
        <AddImageDialog
          open={isOpen}
          image={selectedImage}
          onClose={() => setIsOpen(false)}
          onRemoveImage={handleRemoveImage}
          onChangeImage={openFileSelect}
        />
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setTaskToDeleteID(null);
          }}
          onConfirm={() => {
            onDeleteTask(taskToDeleteID);
            setIsDeleteDialogOpen(false);
            setTaskToDeleteID(null);

            toast.success("Row Deleted", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              theme: theme.palette.mode,
            });
          }}
        />
           
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.palette.mode}
      />
    </Box>
  );
};

export default GridView;

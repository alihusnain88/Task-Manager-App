import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  Link,
  IconButton,
} from "@mui/material";
import {
  DataGridPremium,
  type GridColDef,
  useGridApiRef,
  GridDeleteIcon,
} from "@mui/x-data-grid-premium";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { v4 as uuidv4 } from "uuid";

import type { AppDispatch, RootState } from "../store";
import { selectAllTasksForGrid } from "../store/selectors/tasksGridSelectors";
import type { TaskGridRow, Task } from "../types";
import { fetchBoards, updateBoardName } from "../store/slices/boardsSlice";
import {
  addTask,
  deleteTaskByID,
  fetchTasksByBoard,
  updateTask,
} from "../store/slices/tasksSlice";
import {
  setColumnOrder,
  setColumnVisibility,
} from "../store/slices/gridStateSlice";
import { getTagColor } from "../utils/tagColorsHelper";

const TasksGridView = () => {
  const apiRef = useGridApiRef();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const prevOrderRef = useRef<string[]>([]);
  const [selectedRowID, setSelectedRowID] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const rows = useSelector(selectAllTasksForGrid);
  const boards = useSelector((state: RootState) => state.boards.list);
  const columnOrder = useSelector(
    (state: RootState) => state.gridState.columnOrder
  );
  const columnVisibility = useSelector(
    (state: RootState) => state.gridState.columnVisibility
  );

  const savedColumnState = JSON.parse(
    localStorage.getItem("columnOrder") || "{}"
  );
  const savedColumnVisibility = JSON.parse(
    localStorage.getItem("columnVisibility") || "{}"
  );

  const memoizedColumnOrder = useMemo(() => {
    if (
      Array.isArray(columnOrder) &&
      columnOrder.length > 0 &&
      typeof columnOrder[0] === "string"
    ) {
      return columnOrder;
    }
    return undefined;
  }, [columnOrder]);

  useEffect(() => {
    dispatch(fetchBoards());
  }, []);

  useEffect(() => {
    if (boards.length > 0) {
      boards.forEach((board) => dispatch(fetchTasksByBoard(board)));
    }
  }, [boards]);

  useEffect(() => {
    if (!memoizedColumnOrder?.length || !apiRef.current) return;

    const currentOrder = apiRef.current.getAllColumns().map((col) => col.field);

    const isSame =
      currentOrder.length === memoizedColumnOrder.length &&
      currentOrder.every((field, i) => field === memoizedColumnOrder[i]);

    if (!isSame) {
      apiRef.current.setState((state) => ({
        ...state,
        columns: {
          ...state.columns,
          orderedFields: memoizedColumnOrder,
        },
      }));
    }
  }, [memoizedColumnOrder]);

  const handleRowClick = (rowID: number) => {
    setSelectedRowID(rowID);
  };

  const handleProcessRowUpdate = useCallback(
    (newRow: TaskGridRow, oldRow: TaskGridRow) => {
      if (newRow === oldRow) return oldRow;

      const updatedTask: Task = {
        id: newRow.taskID,
        title: newRow.taskTitle,
        status: newRow.status,
        tags: newRow.tags || [],
        background: newRow.background || null,  
      };

      dispatch(updateTask({ boardID: newRow.projectID, task: updatedTask }));

      if (newRow.projectName !== oldRow.projectName) {
        dispatch(
          updateBoardName({
            boardID: newRow.projectID,
            name: newRow.projectName,
          })
        );
      }

      return newRow;
    },
    []
  );

  const handleImageClick = (img: string) => {
    setSelectedImage(img);
    setIsOpen(true);
  };

  const columns: GridColDef<TaskGridRow>[] = [
    {
      field: "projectName",
      headerName: "Project",
      flex: 1,
      editable: true,
      hideable: false,
      valueGetter: (value, row) => row.projectName || "Unknown Project",
      renderCell: (params) => (
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/projects/${params.row.projectID}`)}
          sx={{ textAlign: "left", fontWeight: "medium" }}
        >
          {params.value}
        </Link>
      ),
      renderEditCell: (params) => (
        <input
          type="text"
          defaultValue={params.value}
          style={{ width: "100%" }}
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
      editable: true,
      hideable: false,
      valueParser: (value: string) => value?.trim(),
      valueSetter: (value, row) => ({ ...row, taskTitle: value }),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            cursor: "pointer",
            color: "primary.main",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => navigate(`/tasks/${params.row.taskID}`)}
        >
          {params.value}
        </Typography>
      ),
      renderEditCell: (params) => (
        <input
          type="text"
          defaultValue={params.value}
          style={{ width: "100%" }}
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
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: ["backlog", "in-progress", "in-review", "completed"],
      valueFormatter: (value: string) =>
        value
          ? value
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          : "",
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
      editable: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", py: 1 }}>
          {params.value?.map((tag: string) => {
            const { text, bg } = getTagColor(tag);
            return (
              <Typography
                key={tag}
                sx={{
                  px: 1,
                  py: 0.5,
                  bgcolor: bg,
                  color: text,
                  border: `2px solid ${text}`,
                  borderRadius: "200px",
                  fontSize: 7,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  letterSpacing: 0.5,
                }}
              >
                {tag}
              </Typography>
            );
          })}
        </Box>
      ),
      renderEditCell: (params) => (
        <input
          type="text"
          defaultValue={params.value?.join(", ")}
          style={{ width: "100%" }}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value.split(",").map((t) => t.trim()),
            })
          }
        />
      ),
    },
    {
      field: "background",
      headerName: "Image",
      width: 100,
      renderCell: (params) => {
        if (!params.value) return null;
        return (
          <Box>
            <Box
              component="img"
              src={params.value}
              alt="task-thumb"
              onClick={() => handleImageClick(params.value)}
              sx={{
                width: 36,
                height: 36,
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
    {
      field: "delete",
      headerName: "Delete Row",
      flex: 0.5,
      renderCell: (params) => (
        <GridDeleteIcon
          style={{ cursor: "pointer" }}
          onClick={() =>
            dispatch(
              deleteTaskByID({
                boardID: params.row.projectID,
                taskID: params.row.taskID,
              })
            )
          }
        />
      ),
    },
    {
      field: "copy-row",
      headerName: "Copy Row",
      flex: 0.5,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            const copiedTask: Task = {
              id: uuidv4(),
              title: params.row.taskTitle,
              status: params.row.status,
              tags: [...params.row.tags],
              background: params.row.background,
            };
            dispatch(
              addTask({
                boardID: params.row.projectID,
                task: copiedTask,
                nearTaskID: params.row.taskID,
              })
            );
          }}
        >
          <ContentCopyIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ height: "90vh", width: "100%", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Projects & Tasks Grid
      </Typography>

      <DataGridPremium
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        processRowUpdate={handleProcessRowUpdate}
        showToolbar
        columnVisibilityModel={savedColumnVisibility || columnVisibility}
        initialState={{ columns: savedColumnState }}
        onStateChange={(state) => {
          const newOrder = state.columns?.orderedFields;
          if (!newOrder || newOrder.length === 0) return;

          const prevOrder = prevOrderRef.current;
          const hasChanged =
            prevOrder.length !== newOrder.length ||
            prevOrder.some((f, i) => f !== newOrder[i]);

          if (hasChanged) {
            prevOrderRef.current = [...newOrder];
            dispatch(setColumnOrder(newOrder));
            localStorage.setItem(
              "columnOrder",
              JSON.stringify({ orderedFields: newOrder })
            );
          }
        }}
        onColumnVisibilityModelChange={(newModel) => {
          const lockedModel = {
            ...newModel,
            projectName: true,
            taskTitle: true,
          };
          dispatch(setColumnVisibility(lockedModel));
          localStorage.setItem("columnVisibility", JSON.stringify(lockedModel));
        }}
        onRowClick={(params) => handleRowClick(Number(params.id))}
        getRowClassName={(params) =>
          selectedRowID === params.id ? "selected-row" : ""
        }
        sx={{
          backgroundColor: "background.paper",
          boxShadow: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          "& .selected-row": {
            backgroundColor: "#e3f2fd !important",
            color: "black !important",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "white",
            color: "black",
          },
          "& .MuiDataGrid-cell:focus-within": { outline: "none" },
        }}
      />

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent
          sx={{
            p: 0,
            textAlign: "center",
            backgroundColor: "white",
            height: "55vh",
            overflow: "hidden",
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Task Preview"
              style={{ maxWidth: "100%", height: "100%" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TasksGridView;

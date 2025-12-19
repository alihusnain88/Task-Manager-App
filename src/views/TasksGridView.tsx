import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  Chip,
  Stack,
  Link,
} from "@mui/material";
import {
  DataGridPremium,
  type GridColDef,
  useGridApiRef,
} from "@mui/x-data-grid-premium";

// Redux Imports
import type { AppDispatch, RootState } from "../store";
import { selectAllTasksForGrid } from "../store/selectors/tasksGridSelectors";
import type { TaskGridRow } from "../types";
import {
  fetchBoards,
  setBoards,
  updateBoardName,
} from "../store/slices/boardsSlice";
import { fetchTasksByBoard, updateTask } from "../store/slices/tasksSlice";
import {
  setColumnOrder,
  setColumnVisibility,
} from "../store/slices/gridStateSlice";
import { type Task } from "../types";
// import CustomToolbar from "./CustomToolbar";
import { getTagColor } from "../components/tasks/TaskCard";

const TasksGridView = () => {
  const apiRef = useGridApiRef();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const prevOrderRef = React.useRef<string[]>([]);
  const [selectedRowID, setSelectedRowID] = useState<number | null>(null);

  // State for Image Dialog
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Redux Selectors
  const rows = useSelector(selectAllTasksForGrid);
  const boards = useSelector((state: RootState) => state.boards.list);

  // Requirement: Persistence Selectors
  const columnOrder = useSelector(
    (state: RootState) => state.gridState.columnOrder
  );
  const columnVisibility = useSelector(
    (state: RootState) => state.gridState.columnVisibility
  );

  // Requirement: Guard against invalid data objects in Redux (Solves the "Nothing shown" bug)
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

  // Initial Data Fetching
  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  useEffect(() => {
    if (boards.length > 0) {
      boards.forEach((board) => dispatch(fetchTasksByBoard(board)));
    }
  }, [boards, dispatch]);
  useEffect(() => {
    if (!memoizedColumnOrder?.length) return;
    if (!apiRef.current) return;

    const current = apiRef.current.getAllColumns().map((c) => c.field);

    const isSame =
      current.length === memoizedColumnOrder.length &&
      current.every((f, i) => f === memoizedColumnOrder[i]);

    if (!isSame) {
      apiRef.current.setColumnOrder(memoizedColumnOrder);
    }
  }, [memoizedColumnOrder]);
  const handleRowClick = (rowID: number) => {
    setSelectedRowID(rowID);
  };

  const savedColumnState = JSON.parse(localStorage.getItem("columnOrder"));
  const handleOrderChange = () => {
    const currentState = apiRef?.current?.exportState();
    const columnState = currentState?.columns;
    dispatch(setColumnOrder(columnState?.orderedFields)) 
    localStorage.setItem("columnOrder", JSON.stringify(columnState));
    console.log(columnState);
  }; 

  const handleProcessRowUpdate = useCallback(
    (newRow: TaskGridRow, oldRow: TaskGridRow) => {
      if (JSON.stringify(newRow) === JSON.stringify(oldRow)) return oldRow;

      const updatedTask: Task = {
        id: newRow.taskID,
        title: newRow.taskTitle,
        status: newRow.status as Task["status"],
        tags: newRow.tags || [],
        background: newRow.background || null,
      };

      // Update task in tasksSlice
      dispatch(updateTask({ boardID: newRow.projectID, task: updatedTask }));

      // Update board name in boardsSlice if changed

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
    [dispatch, rows]
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
      flex: 1.5,
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
      valueFormatter: (value: string) => {
        if (!value) return "";
        return value
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      },
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
                  border: `2px solid${text}`,
                  borderRadius: "200px",
                  fontSize: 7,
                  fontWeight: 700,
                  textTransform: "uppercase",
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
          <Box
            component="img"
            src={params.value}
            alt="task-thumb"
            onClick={() => handleImageClick(params.value as string)}
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
        );
      },
    },
  ];
  // const savedOrder = JSON.parse(localStorage.getItem("columnOrder"))
  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
        width: "100%",
        p: 3,
      }}
    >
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
        columnVisibilityModel={columnVisibility}
        onColumnOrderChange={handleOrderChange}
        initialState={{
          columns: savedColumnState,
        }}
        onColumnVisibilityModelChange={(newModel) => {
          const lockedModel = {
            ...newModel,
            projectName: true,
            taskTitle: true,
          };
          dispatch(setColumnVisibility(lockedModel));
        }}
        onStateChange={(state) => {
          const newOrder = state.columns?.orderedFields;
          if (!newOrder || newOrder.length === 0) return;

          const prevOrder = prevOrderRef.current;

          const hasChanged =
            prevOrder.length !== newOrder.length ||
            prevOrder.some((f, i) => f !== newOrder[i]);

          if (hasChanged) {
            prevOrderRef.current = newOrder;
            dispatch(setColumnOrder(newOrder));
          }
        }}
        onRowClick={(params) => handleRowClick(params.id as number)}
        onCellClick={(params, event) => {
          event.defaultMuiPrevented = true;
          // alert(event.type);
        }}
        getRowClassName={(params) =>
          selectedRowID === params.id ? "selected-row" : ""
        }
        // onColumnOrderChange={(newOrder)=>handleColumnOrderChange(newOrder)}
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
            backgroundColor: "grey.50",
            color: "black",
          },
          "& .MuiDataGrid-cell:focus-within": { outline: "none" },
        }}
      />

      {/* Requirement: Image Preview Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth>
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
              style={{
                maxWidth: "100%",
                height: "100%",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TasksGridView;

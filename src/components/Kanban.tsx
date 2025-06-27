import React, { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { ColumnType, Task } from "../type/types";
import Column from "./Column";
import { initialColumns } from "../intialData";

import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  Tooltip,
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";

import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StackIcon from "@mui/icons-material/StackedLineChart"; // alternative icon for "most tasks"
import FlagIcon from "@mui/icons-material/Flag";
import CloseIcon from "@mui/icons-material/Close";

function getRandomBrightColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 30);
  const lightness = 50 + Math.floor(Math.random() * 20);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const KanbanBoard = () => {
  const addColorToColumns = (cols: ColumnType[]) =>
    cols.map((col) => ({
      ...col,
      color: col.color || getRandomBrightColor(),
    }));

  const [columns, setColumns] = useState<ColumnType[]>(
    addColorToColumns(initialColumns)
  );
  const [visibleColumns, setVisibleColumns] = useState<ColumnType[]>([]);
  const [loadingCols, setLoadingCols] = useState(false);
  const [showAddColumnInput, setShowAddColumnInput] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const COLUMN_BATCH_SIZE = 5;
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleColumns(columns.slice(0, COLUMN_BATCH_SIZE));
  }, [columns]);

  useEffect(() => {
    const handleScroll = () => {
      if (!boardRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = boardRef.current;
      const atRight = scrollLeft + clientWidth >= scrollWidth - 10;

      if (atRight && !loadingCols && visibleColumns.length < columns.length) {
        setLoadingCols(true);

        setTimeout(() => {
          const nextBatch = columns.slice(
            visibleColumns.length,
            visibleColumns.length + COLUMN_BATCH_SIZE
          );
          setVisibleColumns((prev) => [...prev, ...nextBatch]);
          setLoadingCols(false);
        }, 700);
      }
    };

    const scrollContainer = boardRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [visibleColumns, columns, loadingCols]);

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;

    const newColumn: ColumnType = {
      id: uuid(),
      title: newColumnTitle.trim(),
      tasks: [],
    };
    setColumns([newColumn, ...columns]); // Add to the start
    setNewColumnTitle("");
    setShowAddColumnInput(false);
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter((col) => col.id !== id));
  };

  const addTask = (columnId: string, title: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tasks: [{ id: uuid(), title }, ...col.tasks] }
          : col
      )
    );
  };

  const onDragStart = (
    e: React.DragEvent,
    fromColumnId: string,
    task: Task
  ) => {
    e.dataTransfer.setData("task", JSON.stringify({ task, fromColumnId }));
  };

  const onDrop = (e: React.DragEvent, toColumnId: string) => {
    const data = JSON.parse(e.dataTransfer.getData("task"));
    const { task, fromColumnId } = data;

    if (fromColumnId === toColumnId) return;

    setColumns((prevCols) => {
      return prevCols.map((col) => {
        if (col.id === fromColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== task.id),
          };
        } else if (col.id === toColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, task],
          };
        }
        return col;
      });
    });
  };

  const deleteTask = (columnId: string, taskId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      )
    );
  };

  // Calculate total tasks count
  const totalTasksCount = columns.reduce(
    (sum, col) => sum + col.tasks.length,
    0
  );
  const totalColumnsCount = columns.length;

  // Column with the most tasks
  const columnMostTasks = columns.reduce(
    (prev, current) =>
      current.tasks.length > (prev?.tasks.length || 0) ? current : prev,
    null as ColumnType | null
  );

  // Column with the least tasks (lead task)
  const columnLeadTasks = columns.reduce(
    (prev, current) =>
      prev === null || current.tasks.length < prev.tasks.length
        ? current
        : prev,
    null as ColumnType | null
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f5f7",
        padding: "1rem 2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Left side: Title + Add Column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            minWidth: 200,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, userSelect: "none", color: "#333",marginBottom:2,marginTop:2 }}
          >
            Kanban Board
          </Typography>

          {showAddColumnInput ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                size="small"
                autoFocus
                placeholder="Enter column title"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addColumn();
                  if (e.key === "Escape") {
                    setShowAddColumnInput(false);
                    setNewColumnTitle("");
                  }
                }}
              />
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={addColumn}
              >
                Add
              </Button>
              <IconButton
                size="small"
                onClick={() => {
                  setShowAddColumnInput(false);
                  setNewColumnTitle("");
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Tooltip title="Add a new column" arrow>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setShowAddColumnInput(true)}
                sx={{
                  fontWeight: "700",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
                }}
              >
                Add Column
              </Button>
            </Tooltip>
          )}
        </Box>

        {/* Right side: 4 Cards */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "flex-end",
            flexGrow: 1,
            marginLeft: 10,
          }}
        >
          {/* Card 1: Total Columns */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              minWidth: 80,
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", // purple-blue gradient
              color: "white",
            }}
          >
            <ViewColumnIcon fontSize="large" />
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                Total Columns
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {totalColumnsCount}
              </Typography>
            </Box>
          </Paper>

          {/* Card 2: Total Tasks */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              minWidth: 80,
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)", // pink gradient
              color: "white",
            }}
          >
            <ListAltIcon fontSize="large" />
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                Total Tasks
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {totalTasksCount}
              </Typography>
            </Box>
          </Paper>

          {/* Card 3: Column with Most Tasks */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              minWidth: 80,
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)", // teal-blue gradient
              color: "white",
            }}
          >
            <StackIcon fontSize="large" />
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                Most Tasks
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyItems: "center",
                }}
              >
                <Typography variant="body1" fontWeight={700} noWrap>
                  {columnMostTasks ? columnMostTasks.title : "N/A"}
                </Typography>
                <Typography sx={{ opacity: 0.8 }}>
                  ({columnMostTasks?.tasks.length || 0})
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Card 4: Column with Least Tasks */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              minWidth: 80,
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)", // orange-yellow gradient
              color: "white",
            }}
          >
            <FlagIcon fontSize="large" />
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                Least Tasks
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyItems: "center",
                }}
              >
                <Typography variant="body1" fontWeight={700} noWrap>
                  {columnLeadTasks ? columnLeadTasks.title : "N/A"}
                </Typography>
                <Typography sx={{ opacity: 0.8 }}>
                  ({columnLeadTasks?.tasks.length || 0})
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Columns Container */}
      <div
        ref={boardRef}
        style={{
          display: "flex",
          gap: "1.25rem",
          overflowX: "auto",
          paddingBottom: "1rem",
          paddingLeft: "0.25rem",
          scrollbarWidth: "thin",
          scrollbarColor: "#888 transparent",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {visibleColumns.map((col) => (
          <Column
            key={col.id}
            column={col}
            onRemove={() => removeColumn(col.id)}
            onAddTask={addTask}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onDeleteTask={deleteTask}
          />
        ))}

        {loadingCols &&
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={`skeleton-col-${i}`}
              style={{
                width: "260px",
                height: "420px",
                borderRadius: "12px",
                backgroundColor: "#ddd",
                animation: "pulse 1.2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default KanbanBoard;

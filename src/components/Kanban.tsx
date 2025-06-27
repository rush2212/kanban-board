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
  Typography,
  TextField,
  IconButton,
} from "@mui/material";

import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StackIcon from "@mui/icons-material/StackedLineChart"; 
import FlagIcon from "@mui/icons-material/Flag";
import CloseIcon from "@mui/icons-material/Close";
import StatsCard from "./StatsCard";


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

  const [columns, setColumns] = useState<ColumnType[]>(addColorToColumns(initialColumns));
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
    setColumns([newColumn, ...columns]);
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

    setColumns((prevCols) =>
      prevCols.map((col) => {
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
      })
    );
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

  const totalTasksCount = columns.reduce((sum, col) => sum + col.tasks.length, 0);
  const totalColumnsCount = columns.length;

  const columnMostTasks = columns.reduce(
    (prev, current) =>
      current.tasks.length > (prev?.tasks.length || 0) ? current : prev,
    null as ColumnType | null
  );

  const columnLeadTasks = columns.reduce(
    (prev, current) =>
      prev === null || current.tasks.length < prev.tasks.length ? current : prev,
    null as ColumnType | null
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f5f7",
        p: 3,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Left side: Title + Add Column */}
        <Box sx={{ minWidth: 220, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, userSelect: "none", color: "#333" }}
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
              <Button variant="contained" color="success" size="small" onClick={addColumn}>
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
                sx={{ fontWeight: 700, boxShadow: "0 3px 6px rgba(0,0,0,0.2)" }}
              >
                Add Column
              </Button>
            </Tooltip>
          )}
        </Box>

        {/* Right side: Stats Cards */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "flex-end",
            flexGrow: 1,
            ml: 4,
          }}
        >
          <StatsCard
            icon={<ViewColumnIcon fontSize="large" />}
            title="Total Columns"
            value={totalColumnsCount}
            gradient="linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"
          />
          <StatsCard
            icon={<ListAltIcon fontSize="large" />}
            title="Total Tasks"
            value={totalTasksCount}
            gradient="linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)"
          />
          <StatsCard
            icon={<StackIcon fontSize="large" />}
            title="Most Tasks"
            value={
              <>
                {columnMostTasks ? columnMostTasks.title : "N/A"} (
                {columnMostTasks?.tasks.length || 0})
              </>
            }
            gradient="linear-gradient(135deg, #43cea2 0%, #185a9d 100%)"
          />
          <StatsCard
            icon={<FlagIcon fontSize="large" />}
            title="Least Tasks"
            value={
              <>
                {columnLeadTasks ? columnLeadTasks.title : "N/A"} (
                {columnLeadTasks?.tasks.length || 0})
              </>
            }
            gradient="linear-gradient(135deg, #f7971e 0%, #ffd200 100%)"
          />
        </Box>
      </Box>

      {/* Columns Container */}
      <Box
        ref={boardRef}
        sx={{
          display: "flex",
          gap: 1.5,
          overflowX: "auto",
          pb: 2,
          pl: 0.5,
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
            <Box
              key={`skeleton-col-${i}`}
              sx={{
                width: 260,
                height: 420,
                borderRadius: 2,
                backgroundColor: "#ddd",
                animation: "pulse 1.2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
          ))}
      </Box>
    </Box>
  );
};

export default KanbanBoard;

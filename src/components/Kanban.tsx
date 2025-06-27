import React, { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { ColumnType, Task } from "../type/types";
import Column from "./Column";
import { initialColumns } from "../intialData";

import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";

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
  const totalTasksCount = columns.reduce((sum, col) => sum + col.tasks.length, 0);

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
      {/* Header */}
      <div style={{ textAlign: "left", marginBottom: "1rem" }}>
        <h1
          style={{
            marginBottom: "0.3rem",
            fontWeight: "700",
            fontSize: "2.2rem",
            color: "#333",
            userSelect: "none",
          }}
        >
          Kanban Board
        </h1>
        <div
          style={{
            color: "#666",
            fontWeight: "600",
            fontSize: "1.1rem",
            userSelect: "none",
          }}
        >
          Columns: <strong>{columns.length}</strong> &nbsp;|&nbsp; Tasks: <strong>{totalTasksCount}</strong>
        </div>
      </div>

      {/* Add Column Button */}
      <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
        <Tooltip title="Add a new column" arrow>
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<AddIcon />}
          onClick={addColumn}
          sx={{
            fontWeight: "700",
            boxShadow: "0 3px 6px rgba(0,0,0,0.2)"
          }}
        >
          Add Column
        </Button>
        </Tooltip>
      </div>

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

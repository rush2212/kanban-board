import React, { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { ColumnType, Task } from "../type/types";
import Column from "./Column";
import { initialColumns } from "../intialData";

import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
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
    setColumns([newColumn, ...columns]); // Add at the start
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
      <div style={{ marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#222" }}>
          Kanban Board
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#666" }}>
          Columns: <strong>{columns.length}</strong> &nbsp;|&nbsp; Tasks:{" "}
          <strong>{totalTasksCount}</strong>
        </p>
      </div>

      {/* Add Column Input */}
      <div style={{ marginBottom: "1rem", textAlign: "right" }}>
        {!showAddColumnInput ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowAddColumnInput(true)}
          >
            Add Column
          </Button>
        ) : (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <input
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="Enter column name"
              onKeyDown={(e) => {
                if (e.key === "Enter") addColumn();
                if (e.key === "Escape") {
                  setShowAddColumnInput(false);
                  setNewColumnTitle("");
                }
              }}
              autoFocus
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                minWidth: "200px",
              }}
            />
            <Button variant="contained" onClick={addColumn}>
              Add
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                setShowAddColumnInput(false);
                setNewColumnTitle("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Columns */}
      <div
        ref={boardRef}
        style={{
          display: "flex",
          gap: "1.25rem",
          overflowX: "auto",
          paddingBottom: "1rem",
          paddingTop: "0.5rem",
          scrollbarWidth: "thin",
          scrollbarColor: "#aaa transparent",
        }}
      >
        {visibleColumns.map((col) => (
          <Column
            key={col.id}
            column={{ ...col, color: "#1976d2" }} // consistent color
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
              key={`skeleton-${i}`}
              style={{
                width: "260px",
                height: "420px",
                borderRadius: "10px",
                backgroundColor: "#ddd",
                flexShrink: 0,
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default KanbanBoard;

import React, { useEffect, useState } from "react";
import { ColumnType, Task } from "../type/types";
import TaskCard from "./TaskCard";

import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  column: ColumnType;
  onRemove: () => void;
  onAddTask: (columnId: string, title: string) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragStart: (e: React.DragEvent, columnId: string, task: Task) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
};

const Column = ({
  column,
  onRemove,
  onAddTask,
  onDrop,
  onDragStart,
  onDeleteTask,
}: Props) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [visibleTasks, setVisibleTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const TASK_BATCH_SIZE = 15;

  useEffect(() => {
    setVisibleTasks(column.tasks.slice(0, TASK_BATCH_SIZE));
  }, [column.tasks]);

  useEffect(() => {
    const handleWindowScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      const atBottom = scrollTop + windowHeight >= fullHeight - 50;

      if (atBottom && !loading && visibleTasks.length < column.tasks.length) {
        setLoading(true);
        setTimeout(() => {
          const nextBatch = column.tasks.slice(
            visibleTasks.length,
            visibleTasks.length + TASK_BATCH_SIZE
          );
          setVisibleTasks((prev) => [...prev, ...nextBatch]);
          setLoading(false);
        }, 700);
      }
    };

    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [visibleTasks, column.tasks, loading]);

  const handleAdd = () => {
    if (!taskTitle.trim()) return;
    onAddTask(column.id, taskTitle.trim());
    setTaskTitle("");
    setAddingTask(false);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, column.id)}
      style={{
        backgroundColor: "#f9f9f9",
        padding: "1rem",
        borderRadius: "12px",
        minWidth: "260px",
        flexShrink: 0,
        border: "1px solid #ddd",
        boxShadow:
          "0 4px 6px rgba(0,0,0,0.05), 0 8px 20px rgba(0,0,0,0.07)",
      }}
    >
      {/* Column Header */}
      <div
        style={{
          background:"blue",
          borderRadius: "8px",
          padding: "0.6rem 0.8rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          color: "#fff",
          fontSize: "1.05rem",
          marginBottom: "0.5rem",
        }}
      >
        <span>
          {column.title} ({column.tasks.length})
        </span>

        <div style={{ display: "flex", gap: "0.3rem" }}>
          <IconButton
            size="small"
            sx={{ color: "#fff" }}
            onClick={() => setAddingTask((prev) => !prev)}
            aria-label="Add task"
          >
            <AddIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            sx={{ color: "#fff" }}
            onClick={onRemove}
            aria-label="Delete column"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/* Add Task Input */}
      {addingTask && (
        <div style={{ marginBottom: "1rem" }}>
          <input
            autoFocus
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task name"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") {
                setAddingTask(false);
                setTaskTitle("");
              }
            }}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "0.4rem",
              fontSize: "0.95rem",
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleAdd}
              style={{
                flexGrow: 1,
                backgroundColor: "#000",
                color: "white",
                padding: "0.5rem",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Add
            </button>
            <button
              onClick={() => {
                setAddingTask(false);
                setTaskTitle("");
              }}
              style={{
                flexGrow: 1,
                backgroundColor: "#999",
                color: "white",
                padding: "0.5rem",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div style={{ paddingRight: "4px" }}>
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={(e) => onDragStart(e, column.id, task)}
            onDelete={() => onDeleteTask(column.id, task.id)}
          />
        ))}

        {/* Skeleton loader */}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: "40px",
                borderRadius: "6px",
                background: "#ddd",
                marginBottom: "0.5rem",
                animation: "pulse 1s infinite",
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default Column;

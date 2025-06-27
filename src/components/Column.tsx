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
        backgroundColor: "#ebecf0",
        padding: "1rem",
        borderRadius: "10px",
        minWidth: "260px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        flexShrink: 0,
      }}
    >
      {/* Column Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong style={{ fontSize: "1.1rem" }}>{column.title}</strong>

        <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          <IconButton
            size="small"
            color="success"
            onClick={() => setAddingTask((prev) => !prev)}
            aria-label="Add task"
          >
            <AddIcon />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            onClick={onRemove}
            aria-label="Delete column"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </div>

      {/* Add Task Input */}
      {addingTask && (
        <div style={{ marginTop: "0.75rem" }}>
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
              marginBottom: "0.5rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "0.95rem",
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleAdd}
              style={{
                flexGrow: 1,
                backgroundColor: "#5aac44",
                color: "white",
                padding: "0.5rem",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.95rem",
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
                fontSize: "0.95rem",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div style={{ marginTop: "1rem", paddingRight: "4px" }}>
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

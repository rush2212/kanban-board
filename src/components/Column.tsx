import React, { useEffect, useState } from "react";
import { ColumnType, Task } from "../type/types";
import TaskCard from "./TaskCard";

import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip, Box, TextField, Button, Stack } from "@mui/material";

type Props = {
  column: ColumnType;
  onRemove: () => void;
  onAddTask: (columnId: string, title: string) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragStart: (e: React.DragEvent, columnId: string, task: Task) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
};

const TASK_BATCH_SIZE = 15;

const AddTaskInput = ({
  value,
  onChange,
  onAdd,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}) => (
  <Box mb={2}>
    <TextField
      autoFocus
      fullWidth
      size="small"
      placeholder="Task name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onAdd();
        if (e.key === "Escape") onCancel();
      }}
      sx={{ mb: 1 }}
    />
    <Stack direction="row" spacing={1}>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onAdd}
        sx={{ fontWeight: "bold" }}
      >
        Add
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        fullWidth
        onClick={onCancel}
        sx={{ fontWeight: "bold" }}
      >
        Cancel
      </Button>
    </Stack>
  </Box>
);

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

  const handleCancel = () => {
    setAddingTask(false);
    setTaskTitle("");
  };

  return (
    <Box
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, column.id)}
      sx={{
        backgroundColor: "#f9f9f9",
        p: 2,
        borderRadius: 2,
        minWidth: 260,
        flexShrink: 0,
        border: "1px solid #ddd",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05), 0 8px 20px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          borderRadius: 1,
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          color: "primary.contrastText",
          fontSize: "1.05rem",
          mb: 1,
          userSelect: "none",
        }}
      >
        <Box>
          {column.title} ({column.tasks.length})
        </Box>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Add a new Task" arrow>
            <IconButton
              size="small"
              sx={{ color: "primary.contrastText" }}
              onClick={() => setAddingTask((prev) => !prev)}
              aria-label="Add task"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete whole column" arrow>
            <IconButton
              size="small"
              sx={{ color: "primary.contrastText" }}
              onClick={onRemove}
              aria-label="Delete column"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Add Task Input */}
      {addingTask && (
        <AddTaskInput
          value={taskTitle}
          onChange={setTaskTitle}
          onAdd={handleAdd}
          onCancel={handleCancel}
        />
      )}

      {/* Task List */}
      <Box sx={{ pr: 0.5 }}>
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
            <Box
              key={i}
              sx={{
                height: 40,
                borderRadius: 1,
                backgroundColor: "#ddd",
                mb: 0.5,
                animation: "pulse 1s infinite",
              }}
            />
          ))}
      </Box>
    </Box>
  );
};

export default Column;

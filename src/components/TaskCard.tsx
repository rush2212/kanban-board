import React, { useState } from "react";
import { Task } from "../type/types";

import { Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  task: Task;
  onDragStart: (e: React.DragEvent) => void;
  onDelete: () => void;
};

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <Tooltip title="Delete Task" arrow>
    <IconButton
      aria-label="delete task"
      onClick={onClick}
      size="small"
      sx={{
        position: "absolute",
        right: 4,
        top: 4,
        color: "#c0392b",
      }}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Tooltip>
);

const TaskCard = ({ task, onDragStart, onDelete }: Props) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: "relative",
        padding: "0.75rem 2.5rem 0.75rem 0.75rem",
        mb: "0.6rem",
        backgroundColor: "#fff",
        borderRadius: "6px",
        boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
        cursor: "grab",
        userSelect: "none",
        transition: "transform 0.15s",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      {task.title}
      {hovered && <DeleteButton onClick={onDelete} />}
    </Box>
  );
};

export default TaskCard;

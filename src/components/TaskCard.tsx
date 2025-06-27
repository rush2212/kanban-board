import React, { useState } from "react";
import { Task } from "../type/types";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  task: Task;
  onDragStart: (e: React.DragEvent) => void;
  onDelete: () => void;
};

const TaskCard = ({ task, onDragStart, onDelete }: Props) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "0.75rem 2.5rem 0.75rem 0.75rem",
        marginBottom: "0.6rem",
        backgroundColor: "#fff",
        borderRadius: "6px",
        boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
        cursor: "grab",
        transition: "transform 0.1s",
        userSelect: "none",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
    >
      {task.title}

      {hovered && (
        <IconButton
          aria-label="delete task"
          onClick={onDelete}
          size="small"
          style={{
            position: "absolute",
            right: 4,
            top: 4,
            color: "#c0392b",
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};

export default TaskCard;

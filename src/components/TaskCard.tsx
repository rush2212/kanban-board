import React, { useState } from "react";
import { Task } from "../type/types";

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
        padding: "0.75rem",
        marginBottom: "0.6rem",
        backgroundColor: "#fff",
        borderRadius: "6px",
        boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
        cursor: "grab",
        transition: "transform 0.1s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
    >
      {task.title}
      {hovered && (
        <button
          onClick={onDelete}
          style={{
            position: "absolute",
            right: "8px",
            top: "8px",
            border: "none",
            background: "transparent",
            color: "#c0392b",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          title="Delete task"
        >
          🗑️
        </button>
      )}
    </div>
  );
};

export default TaskCard;

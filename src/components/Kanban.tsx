import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { ColumnType, Task } from "../type/types";
import Column from "./Column";
import { initialColumns } from "../intialData";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);

  const addColumn = () => {
    const newColumn: ColumnType = {
      id: uuid(),
      title: `Column ${columns.length + 1}`,
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter((col) => col.id !== id));
  };

  const addTask = (columnId: string, title: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: [...col.tasks, { id: uuid(), title }],
            }
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

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={addColumn}
          style={{
            backgroundColor: "#0079bf",
            color: "white",
            padding: "0.6rem 1.2rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ➕ Add Column
        </button>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          paddingBottom: "1rem",
          justifyContent: "flex-start",
        }}
      >
        {columns.map((col) => (
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
      </div>
    </div>
  );
};

export default KanbanBoard;

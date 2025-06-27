import React, { useState } from 'react';
import { ColumnType, Task } from '../type/types';
import TaskCard from './TaskCard';

type Props = {
  column: ColumnType;
  onRemove: () => void;
  onAddTask: (columnId: string, title: string) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragStart: (e: React.DragEvent, columnId: string, task: Task) => void;
};

const Column = ({ column, onRemove, onAddTask, onDrop, onDragStart }: Props) => {
  const [taskTitle, setTaskTitle] = useState('');

  const handleAdd = () => {
    if (!taskTitle.trim()) return;
    onAddTask(column.id, taskTitle.trim());
    setTaskTitle('');
  };

  return (
<div
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => onDrop(e, column.id)}
  style={{
    backgroundColor: '#ebecf0',
    padding: '1rem',
    borderRadius: '10px',
    minWidth: '260px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    flexShrink: 0,
  }}
>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <strong style={{ fontSize: '1.1rem' }}>{column.title}</strong>
    <button
      onClick={onRemove}
      style={{
        border: 'none',
        background: 'transparent',
        color: '#c0392b',
        fontSize: '1.1rem',
        cursor: 'pointer',
      }}
      title="Remove column"
    >
      ✖
    </button>
  </div>

  <div style={{ marginTop: '1rem' }}>
    {column.tasks.map((task) => (
      <TaskCard
        key={task.id}
        task={task}
        onDragStart={(e) => onDragStart(e, column.id, task)}
      />
    ))}
  </div>

  <div style={{ marginTop: '1rem' }}>
    <input
      value={taskTitle}
      onChange={(e) => setTaskTitle(e.target.value)}
      placeholder="Task name"
      style={{
        width: '100%',
        padding: '0.5rem',
        marginBottom: '0.5rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
        outline: 'none',
      }}
    />
    <button
      onClick={handleAdd}
      style={{
        width: '100%',
        backgroundColor: '#5aac44',
        color: 'white',
        padding: '0.5rem',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    >
      Add Task
    </button>
  </div>
</div>
  );
};

export default Column;

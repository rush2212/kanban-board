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
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        borderRadius: '8px',
        minWidth: '220px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{column.title}</strong>
        <button onClick={onRemove}>X</button>
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
          placeholder="Add Task"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
};

export default Column;

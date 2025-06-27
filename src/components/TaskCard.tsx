import React from 'react';
import { Task } from '../type/types';

type Props = {
  task: Task;
  onDragStart: (e: React.DragEvent) => void;
};

const TaskCard = ({ task, onDragStart }: Props) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        padding: '0.5rem',
        marginBottom: '0.5rem',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'grab',
      }}
    >
      {task.title}
    </div>
  );
};

export default TaskCard;

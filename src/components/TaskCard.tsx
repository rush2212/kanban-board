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
    padding: '0.75rem',
    marginBottom: '0.6rem',
    backgroundColor: '#fff',
    borderRadius: '6px',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
    cursor: 'grab',
    transition: 'transform 0.1s',
  }}
  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
>
  {task.title}
</div>
  );
};

export default TaskCard;

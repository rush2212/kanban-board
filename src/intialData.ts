import { ColumnType } from './type/types';

export const initialColumns: ColumnType[] = [
  {
    id: 'column-1',
    title: 'To Do',
    tasks: [
      { id: 'task-1', title: 'Create project repo' },
      { id: 'task-2', title: 'Setup TypeScript' },
    ],
  },
  {
    id: 'column-2',
    title: 'In Progress',
    tasks: [
      { id: 'task-3', title: 'Build Kanban layout' },
    ],
  },
  {
    id: 'column-3',
    title: 'Done',
    tasks: [
      { id: 'task-4', title: 'Learn React basics' },
    ],
  },
];

import { ColumnType } from "./type/types";

export const initialColumns: ColumnType[] = [
  {
    id: 'column-1',
    title: 'To Do',
    tasks: Array.from({ length: 20 }, (_, i) => ({
      id: `task-${i + 1}`,
      title: `To Do Task ${i + 1}`,
    })),
  },
  {
    id: 'column-2',
    title: 'In Progress',
    tasks: [
      { id: 'task-21', title: 'Build Kanban layout' },
      { id: 'task-22', title: 'Implement drag-and-drop' },
    ],
  },
  {
    id: 'column-3',
    title: 'Done',
    tasks: [
      { id: 'task-23', title: 'Learn React basics' },
      { id: 'task-24', title: 'Setup project structure' },
    ],
  },
];

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
    tasks: Array.from({ length: 10 }, (_, i) => ({
      id: `task-20${i + 1}`,
      title: `In Progress Task ${i + 1}`,
    })),
  },
  {
    id: 'column-3',
    title: 'Done',
    tasks: Array.from({ length: 8 }, (_, i) => ({
      id: `task-30${i + 1}`,
      title: `Done Task ${i + 1}`,
    })),
  },
  {
    id: 'column-4',
    title: 'Review',
    tasks: Array.from({ length: 5 }, (_, i) => ({
      id: `task-40${i + 1}`,
      title: `Review Task ${i + 1}`,
    })),
  },
  {
    id: 'column-5',
    title: 'Backlog',
    tasks: Array.from({ length: 12 }, (_, i) => ({
      id: `task-50${i + 1}`,
      title: `Backlog Task ${i + 1}`,
    })),
  },
  {
    id: 'column-6',
    title: 'QA',
    tasks: Array.from({ length: 6 }, (_, i) => ({
      id: `task-60${i + 1}`,
      title: `QA Task ${i + 1}`,
    })),
  },
  {
    id: 'column-7',
    title: 'Staging',
    tasks: Array.from({ length: 4 }, (_, i) => ({
      id: `task-70${i + 1}`,
      title: `Staging Task ${i + 1}`,
    })),
  },
  {
    id: 'column-8',
    title: 'Deployed',
    tasks: Array.from({ length: 7 }, (_, i) => ({
      id: `task-80${i + 1}`,
      title: `Deployed Task ${i + 1}`,
    })),
  },
  {
    id: 'column-9',
    title: 'Blocked',
    tasks: Array.from({ length: 3 }, (_, i) => ({
      id: `task-90${i + 1}`,
      title: `Blocked Task ${i + 1}`,
    })),
  },
  {
    id: 'column-10',
    title: 'Archived',
    tasks: Array.from({ length: 2 }, (_, i) => ({
      id: `task-100${i + 1}`,
      title: `Archived Task ${i + 1}`,
    })),
  },
];

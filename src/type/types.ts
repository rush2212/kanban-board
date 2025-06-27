export type Task = {
  id: string;
  title: string;
};

export type ColumnType = {
  id: string;
  title: string;
  tasks: Task[];
};

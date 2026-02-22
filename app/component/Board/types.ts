export interface Task {
  id: string;
  content: string;
  isDone?: boolean;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
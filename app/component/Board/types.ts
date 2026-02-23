export interface TaskMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  previewUrl?: string;
  fileType: string;
}

export interface Task {
  id: string;
  content: string;
  isDone?: boolean;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  members?: TaskMember[];
  attachments?: TaskAttachment[];
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
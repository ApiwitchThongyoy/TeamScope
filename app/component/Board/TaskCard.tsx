import type { Task } from './types';

interface Props {
  task: Task;
  onDelete: () => void;
  onDragStart: () => void;
  onClick: () => void;
}

export default function TaskCard({ task, onDelete, onDragStart, onClick }: Props) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition cursor-pointer group relative"
    >
      <p className="pr-6">{task.content}</p>
      <button
        onClick={(e) => {
          e.stopPropagation(); // ไม่ให้ click ลบ trigger modal
          onDelete();
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 p-1 rounded transition"
      >
        <i className="fi fi-rr-cross-small text-red-500 text-sm"></i>
      </button>
    </div>
  );
}
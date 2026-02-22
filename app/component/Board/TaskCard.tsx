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
      <div className="flex items-start gap-2 pr-6">
        {/* แสดงวงกลมสีเขียวเมื่อ isDone */}
        {task.isDone && (
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
            <i className="fi fi-rr-check text-white" style={{ fontSize: '8px' }}></i>
          </div>
        )}
        <p className={task.isDone ? 'text-gray-400' : ''}>{task.content}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 p-1 rounded transition"
      >
        <i className="fi fi-rr-cross-small text-red-500 text-sm"></i>
      </button>
    </div>
  );
}
import type { Task } from './types';

interface Props {
  task: Task;
  onDelete: () => void;
  onDragStart: () => void;
  onClick: () => void;
  onToggleDone: (taskId: string, isDone: boolean) => void;
}

export default function TaskCard({ task, onDelete, onDragStart, onClick, onToggleDone }: Props) {
  const hasDate = task.startDate || task.endDate;
  const hasMembers = task.members && task.members.length > 0;
  const hasAttachments = task.attachments && task.attachments.length > 0;
  const showMeta = hasDate || hasMembers || hasAttachments;

  const formatShortDate = (date?: string, time?: string) => {
    if (!date) return '';
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    return time ? `${dateStr} ${time}` : dateStr;
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition cursor-pointer group relative"
    >
      {/* Cover image ถ้ามีรูปแนบ */}
      {task.attachments?.find(a => a.previewUrl) && (
        <div className="w-full h-24 rounded-lg overflow-hidden mb-2 -mt-1">
          <img
            src={task.attachments.find(a => a.previewUrl)!.previewUrl}
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-2 pr-6">
        {/* วงกลม toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone(task.id, !task.isDone);
          }}
          className="shrink-0 cursor-pointer transition"
        >
          {task.isDone ? (
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-md">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 transition" />
          )}
        </button>

        <p className={`text-sm ${task.isDone ? 'text-gray-400' : 'text-gray-700'}`}>
          {task.content}
        </p>
      </div>

      {/* Meta row — วันที่, ไฟล์แนบ, สมาชิก */}
      {showMeta && (
        <div className="flex items-center gap-2 mt-2 ml-7 flex-wrap">

          {/* วันที่ */}
          {hasDate && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${task.isDone ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M4 1v2M8 1v2M1 5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span>
                {formatShortDate(task.startDate, task.startTime)}
                {task.endDate ? ` → ${formatShortDate(task.endDate, task.endTime)}` : ''}
              </span>
            </div>
          )}

          {/* จำนวนไฟล์แนบ */}
          {hasAttachments && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-600">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M10 5.5L5.5 10a3 3 0 01-4.24-4.24L6.5 1.5a2 2 0 012.83 2.83L4.08 9.58a1 1 0 01-1.41-1.41L7.5 3.34" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span>{task.attachments!.length}</span>
            </div>
          )}

          {/* สมาชิก */}
          {hasMembers && (
            <div className="flex items-center -space-x-1 ml-auto">
              {task.members!.slice(0, 3).map(m => (
                <div
                  key={m.id}
                  className={`w-5 h-5 rounded-full ${m.color} flex items-center justify-center text-white font-bold border border-white`}
                  style={{ fontSize: '8px' }}
                  title={m.name}
                >
                  {m.avatar}
                </div>
              ))}
              {task.members!.length > 3 && (
                <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold border border-white" style={{ fontSize: '8px' }}>
                  +{task.members!.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
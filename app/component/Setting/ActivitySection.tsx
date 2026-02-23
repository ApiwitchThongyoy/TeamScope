import { useEffect, useState } from 'react';

export interface ActivityLog {
  id: string;
  type: 'create_board' | 'create_card' | 'attach_file' | 'done_card' | 'delete_board' | 'other';
  message: string;
  timestamp: string;
}

const typeIcon: Record<ActivityLog['type'], string> = {
  create_board: 'fi-rr-add-document',
  create_card:  'fi-rr-memo-pad',
  attach_file:  'fi-rr-clip',
  done_card:    'fi-rr-check-circle',
  delete_board: 'fi-rr-trash',
  other:        'fi-rr-info',
};

const typeBg: Record<ActivityLog['type'], string> = {
  create_board: 'bg-indigo-100 text-indigo-600',
  create_card:  'bg-blue-100 text-blue-600',
  attach_file:  'bg-amber-100 text-amber-600',
  done_card:    'bg-green-100 text-green-600',
  delete_board: 'bg-red-100 text-red-500',
  other:        'bg-slate-100 text-slate-500',
};

function timeAgo(timestamp: string) {
  const diff = (Date.now() - new Date(timestamp).getTime()) / 1000;
  if (diff < 60) return 'เมื่อกี้';
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
  return `${Math.floor(diff / 86400)} วันที่แล้ว`;
}

export default function ActivitySection() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    setLogs(saved.reverse());
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-3">Activity</h3>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <i className="fi fi-rr-clock text-4xl mb-3 opacity-40" />
          <p className="text-sm">ยังไม่มีกิจกรรม</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${typeBg[log.type]}`}>
                <i className={`fi ${typeIcon[log.type]} text-sm leading-none`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">{log.message}</p>
                <p className="text-xs text-slate-400 mt-0.5">{timeAgo(log.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function เพื่อ log activity จากที่อื่น
export function logActivity(type: ActivityLog['type'], message: string) {
  const logs: ActivityLog[] = JSON.parse(localStorage.getItem('activityLogs') || '[]');
  logs.push({ id: Date.now().toString(), type, message, timestamp: new Date().toISOString() });
  localStorage.setItem('activityLogs', JSON.stringify(logs));
}
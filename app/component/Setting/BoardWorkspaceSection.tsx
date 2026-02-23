import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

interface Board {
  id: number;
  name: string;
  description: string;
  privacy: string;
}

export default function BoardWorkspaceSection() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('boards') || '[]');
    setBoards(saved);
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-3">Boards</h3>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <i className="fi fi-rr-dashboard text-4xl mb-3 opacity-40" />
          <p className="text-sm">ยังไม่มี Board</p>
        </div>
      ) : (
        <div className="space-y-2">
          {boards.map((board) => (
            <div key={board.id}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {board.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{board.name}</p>
                  <p className="text-xs text-slate-400">{board.privacy}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/board/${encodeURIComponent(board.name)}`)}
                className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
              >
                เปิด Board
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';

interface Board {
  id: string;
  name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentBoardName: string;
}

const BOARD_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-500',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-600',
  'from-fuchsia-500 to-violet-600',
  'from-lime-500 to-green-600',
];

function getBoardColor(name: string, idx: number) {
  return BOARD_COLORS[idx % BOARD_COLORS.length];
}

export default function SwitchBoardPanel({ isOpen, onClose, currentBoardName }: Props) {
  const [mounted, setMounted] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      // โหลด boards จาก localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('boards') || '[]');
        setBoards(saved);
      } catch {
        setBoards([]);
      }
      setTimeout(() => setMounted(true), 10);
    } else {
      setMounted(false);
      setSearch('');
    }
  }, [isOpen]);

  const filtered = boards.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSwitch = (board: Board) => {
    if (board.name === currentBoardName) {
      onClose();
      return;
    }
    onClose();
    // ใช้ window.location เพื่อ force reload state ใหม่ทั้งหมด
    window.location.href = `/board/${encodeURIComponent(board.name)}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-70 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Panel — slide up from bottom */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-71 flex flex-col transition-transform duration-300 ease-out ${mounted ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '75vh' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">สลับบอร์ด</h2>
            <p className="text-xs text-gray-400 mt-0.5">กำลังอยู่ที่: <span className="font-semibold text-gray-600">{currentBoardName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
            <i className="fi fi-rr-cross text-gray-500"></i>
          </button>
        </div>

        {/* Search */}
        {boards.length > 4 && (
          <div className="px-6 pb-3 shrink-0">
            <div className="relative">
              <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ค้นหาบอร์ด..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Board grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <i className="fi fi-rr-apps text-gray-300 text-2xl"></i>
              </div>
              <p className="text-sm text-gray-500">
                {search ? `ไม่พบบอร์ด "${search}"` : 'ยังไม่มีบอร์ด'}
              </p>
              {!search && (
                <p className="text-xs text-gray-400 mt-1">สร้างบอร์ดใหม่จากหน้า Home</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filtered.map((board, idx) => {
                const isCurrent = board.name === currentBoardName;
                return (
                  <button
                    key={board.id}
                    onClick={() => handleSwitch(board)}
                    className={`relative rounded-2xl p-4 text-left transition cursor-pointer group ${
                      isCurrent
                        ? 'ring-2 ring-blue-500 ring-offset-2'
                        : 'hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${getBoardColor(board.name, idx)} opacity-90`} />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Initial circle */}
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg mb-3">
                        {board.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-white font-semibold text-sm leading-tight wrap-break-words line-clamp-2">
                        {board.name}
                      </p>
                    </div>

                    {/* Current badge */}
                    {isCurrent && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ปุ่มไป Home */}
          <button
            onClick={() => { onClose(); window.location.href = '/home'; }}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fi fi-rr-plus text-sm"></i>
            <span>จัดการบอร์ดทั้งหมดที่หน้า Home</span>
          </button>
        </div>
      </div>
    </>
  );
}
import { useState, useEffect, useRef } from 'react';
import { auth } from '../../lib/firebase';

type Privacy = 'private' | 'public';

interface Props {
  boardName: string;
  isEditing: boolean;
  initialBoardName: string;
  privacy: Privacy;
  onChange: (name: string) => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onOpenPrivacy: () => void;
  onOpenShare: () => void;
}

export default function BoardHeader({
  boardName, isEditing, initialBoardName, privacy,
  onChange, onStartEdit, onSave, onCancel, onOpenPrivacy, onOpenShare,
}: Props) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const firebaseUser = auth.currentUser;

    setDisplayName(
      profile.name ||
      firebaseUser?.displayName ||
      firebaseUser?.email?.split('@')[0] ||
      'User'
    );
    setEmail(firebaseUser?.email || '');
  }, []);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-gray-300 p-6 rounded-b-3xl">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        {/* Board Name */}
        <div className="flex items-center gap-4">
          {isEditing ? (
            <input
              type="text"
              value={boardName}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSave();
                if (e.key === 'Escape') onCancel();
              }}
              className="text-3xl font-bold italic bg-white px-3 py-1 rounded border-2 border-blue-500 focus:outline-none"
              autoFocus
            />
          ) : (
            <h1
              onClick={onStartEdit}
              className="text-3xl font-bold italic cursor-pointer hover:bg-white/30 px-3 py-1 rounded transition"
            >
              {boardName}
            </h1>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">

          {/* Avatar + Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
              title={displayName}
            >
              {initial}
            </button>

            {open && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="px-4 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
                    {email && <p className="text-xs text-slate-400 truncate">{email}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ปุ่ม Privacy */}
          <button
            onClick={onOpenPrivacy}
            className="bg-white px-6 py-3 rounded-full hover:bg-gray-100 transition flex items-center gap-2 cursor-pointer relative"
            title={privacy === 'private' ? 'Private — เฉพาะทีม' : 'Public — ทุกคนเห็นได้'}
          >
            <i className={`fi ${privacy === 'private' ? 'fi-rr-lock' : 'fi-rr-globe'} text-xl`}></i>
            <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${privacy === 'private' ? 'bg-gray-400' : 'bg-green-500'}`} />
          </button>

          {/* ปุ่ม share */}
          <button
            onClick={onOpenShare}
            className="bg-white px-8 py-3 rounded-full hover:bg-gray-100 transition flex items-center gap-2 font-semibold cursor-pointer"
          >
            <i className="fi fi-rr-user-add text-xl"></i>
            <span className="text-lg">share</span>
          </button>
        </div>
      </div>
    </header>
  );
}
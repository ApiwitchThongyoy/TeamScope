import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function UserMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ดึงชื่อจาก localStorage profile ก่อน ถ้าไม่มีใช้จาก Firebase
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const firebaseUser = auth.currentUser;

    setDisplayName(
      profile.name ||
      firebaseUser?.displayName ||
      firebaseUser?.email?.split('@')[0] ||
      'User'
    );
    setEmail(firebaseUser?.email || '');
  }, [open]); // re-check ทุกครั้งที่เปิด menu

  // ปิด menu เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleSetting = () => {
    setOpen(false);
    navigate('/setting');
  };

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
        title={displayName}
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in">
          {/* User Info */}
          <div className="px-4 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
                {email && <p className="text-xs text-slate-400 truncate">{email}</p>}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleSetting}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <i className="fi fi-ss-settings text-base leading-none text-slate-500 w-5 text-center" />
              Setting
            </button>

            <div className="mx-3 my-1 border-t border-slate-100" />

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <i className="fi fi-rr-sign-out-alt text-base leading-none w-5 text-center" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
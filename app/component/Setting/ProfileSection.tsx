import { useState, useEffect } from 'react';

export default function ProfileSection() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setName(profile.name || '');
    setBio(profile.bio || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify({ name, bio }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-3">Profile</h3>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
          {name ? name.charAt(0).toUpperCase() : '?'}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">{name || 'ยังไม่ได้ตั้งชื่อ'}</p>
          <p className="text-xs text-slate-400 mt-0.5">Avatar จะใช้ตัวอักษรแรกของชื่อ</p>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-600">Display Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="กรอกชื่อที่ต้องการแสดง"
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-600">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="เขียนแนะนำตัวสั้นๆ..."
          rows={4}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
        />
        <p className="text-xs text-slate-400 text-right">{bio.length} / 200</p>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
          ${saved
            ? 'bg-green-500 text-white'
            : 'bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg active:scale-95'
          }`}
      >
        {saved ? '✓ บันทึกแล้ว' : 'บันทึกการเปลี่ยนแปลง'}
      </button>
    </div>
  );
}
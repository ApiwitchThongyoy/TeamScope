import { useState, useEffect } from 'react';

interface Member {
  id: string;
  email: string;
  boardName: string;
  role: 'owner' | 'member';
}

interface MemberModalProps {
  member: Member;
  onClose: () => void;
}

function MemberModal({ member, onClose }: MemberModalProps) {
  const boards = JSON.parse(localStorage.getItem('boards') || '[]');
  const sharedBoards = boards.filter((b: any) => b.name === member.boardName);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">View Boards</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors">
            <i className="fi fi-rr-cross text-sm text-slate-500" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold">
            {member.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">{member.email}</p>
            <p className="text-xs text-slate-400 capitalize">{member.role}</p>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Boards ที่ทำงานร่วมกัน</p>
        {sharedBoards.length > 0 ? (
          <div className="space-y-2">
            {sharedBoards.map((b: any) => (
              <div key={b.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                  {b.name.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm text-slate-700 font-medium">{b.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-4">ไม่มี board ที่ร่วมกัน</p>
        )}
      </div>
    </div>
  );
}

export default function MembersSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('teamMembers') || '[]');
    setMembers(saved);
  }, []);

  const saveMembers = (updated: Member[]) => {
    setMembers(updated);
    localStorage.setItem('teamMembers', JSON.stringify(updated));
  };

  const handleInvite = () => {
    if (!newEmail.trim() || !newEmail.includes('@')) return;
    const boards = JSON.parse(localStorage.getItem('boards') || '[]');
    const newMember: Member = {
      id: Date.now().toString(),
      email: newEmail.trim(),
      boardName: boards[0]?.name || '',
      role: 'member',
    };
    saveMembers([...members, newMember]);
    setNewEmail('');
  };

  const handleRemove = (id: string) => {
    if (window.confirm('ต้องการลบสมาชิกคนนี้ออกหรือไม่?')) {
      saveMembers(members.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-3">Members</h3>

      {/* Invite */}
      <div className="flex gap-2">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
          placeholder="กรอกอีเมลเพื่อเชิญสมาชิก"
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        <button
          onClick={handleInvite}
          className="px-4 py-2.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all cursor-pointer shadow-md active:scale-95"
        >
          เชิญ
        </button>
      </div>

      {/* Members list */}
      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <i className="fi fi-rr-users text-4xl mb-3 opacity-40" />
          <p className="text-sm">ยังไม่มีสมาชิกในทีม</p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                  {member.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{member.email}</p>
                  <p className="text-xs text-slate-400 capitalize">{member.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMember(member)}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                >
                  View Boards
                </button>
                <button
                  onClick={() => handleRemove(member.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMember && (
        <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  );
}
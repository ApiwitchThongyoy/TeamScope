import { useEffect, useState } from 'react';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  role: 'owner' | 'editor' | 'viewer';
  isYou?: boolean;
}

interface JoinRequest {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  requestedAt: Date;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MEMBERS: Member[] = [
  { id: '0', name: 'คุณ (Del Kung)', email: 'delkung@example.com', avatar: 'D', color: 'bg-purple-500', role: 'owner', isYou: true },
];

const MOCK_REQUESTS: JoinRequest[] = [
  { id: 'r1', name: 'Somchai Thai', email: 'somchai@example.com', avatar: 'S', color: 'bg-blue-500', requestedAt: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 'r2', name: 'Malee Jaidee', email: 'malee@example.com', avatar: 'M', color: 'bg-green-500', requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
];

const ROLE_LABELS: Record<string, string> = {
  owner: 'เจ้าของ',
  editor: 'แก้ไขได้',
  viewer: 'ดูได้',
};

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-purple-100 text-purple-700',
  editor: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-600',
};

type Tab = 'members' | 'requests';

export default function SharePanel({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const [searchValue, setSearchValue] = useState('');
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [requests, setRequests] = useState<JoinRequest[]>(MOCK_REQUESTS);
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [inviteSent, setInviteSent] = useState<string | null>(null);
  const [showRoleMenu, setShowRoleMenu] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => setMounted(true), 10);
    else { setMounted(false); setInviteSent(null); setSearchValue(''); }
  }, [isOpen]);

  const handleInvite = () => {
    if (!searchValue.trim()) return;
    const newMember: Member = {
      id: Date.now().toString(),
      name: searchValue.includes('@') ? searchValue.split('@')[0] : searchValue,
      email: searchValue.includes('@') ? searchValue : `${searchValue}@example.com`,
      avatar: searchValue[0].toUpperCase(),
      color: ['bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500'][Math.floor(Math.random() * 4)],
      role: inviteRole,
    };
    setMembers(prev => [...prev, newMember]);
    setInviteSent(searchValue);
    setSearchValue('');
    setTimeout(() => setInviteSent(null), 3000);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleChangeRole = (id: string, role: 'editor' | 'viewer') => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
    setShowRoleMenu(null);
  };

  const handleAcceptRequest = (req: JoinRequest) => {
    const newMember: Member = {
      id: req.id,
      name: req.name,
      email: req.email,
      avatar: req.avatar,
      color: req.color,
      role: 'editor',
    };
    setMembers(prev => [...prev, newMember]);
    setRequests(prev => prev.filter(r => r.id !== req.id));
  };

  const handleRejectRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
    return `${Math.floor(diff / 86400)} วันที่แล้ว`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-70 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-71 flex flex-col transition-transform duration-300 ease-out ${mounted ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '380px' }}
        onClick={() => setShowRoleMenu(null)}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">แชร์และสมาชิก</h2>
            <p className="text-xs text-gray-400 mt-0.5">จัดการสมาชิกใน board นี้</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
            <i className="fi fi-rr-cross text-gray-500"></i>
          </button>
        </div>

        {/* Invite input */}
        <div className="px-6 py-4 border-b border-gray-100 shrink-0">
          <p className="text-sm font-semibold text-gray-700 mb-2">เชิญสมาชิก</p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleInvite()}
                placeholder="ชื่อหรืออีเมล..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-gray-50"
              />
            </div>
            {/* Role selector */}
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value as 'editor' | 'viewer')}
              className="border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-blue-400 bg-gray-50 cursor-pointer"
            >
              <option value="editor">แก้ไขได้</option>
              <option value="viewer">ดูได้</option>
            </select>
            <button
              onClick={handleInvite}
              disabled={!searchValue.trim()}
              className="px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              เชิญ
            </button>
          </div>

          {/* Success message */}
          {inviteSent && (
            <div className="mt-2 flex items-center gap-2 text-green-600 text-xs">
              <i className="fi fi-rr-check-circle"></i>
              <span>ส่งคำเชิญถึง <strong>{inviteSent}</strong> แล้ว</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 shrink-0 px-2">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-3 text-sm font-medium transition flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'members' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <i className="fi fi-rr-users text-sm"></i>
            <span>สมาชิก</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{members.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-3 text-sm font-medium transition flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'requests' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <i className="fi fi-rr-user-time text-sm"></i>
            <span>คำขอเข้าทีม</span>
            {requests.length > 0 && (
              <span className="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">{requests.length}</span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* ===== MEMBERS TAB ===== */}
          {activeTab === 'members' && (
            <div className="space-y-2">
              {members.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition group">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center text-white font-bold shrink-0`}>
                    {member.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-700 truncate">{member.name}</p>
                      {member.isYou && <span className="text-xs text-gray-400">(คุณ)</span>}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{member.email}</p>
                  </div>

                  {/* Role badge / dropdown */}
                  <div className="relative shrink-0" onClick={e => e.stopPropagation()}>
                    {member.role === 'owner' ? (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_COLORS['owner']}`}>
                        {ROLE_LABELS['owner']}
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowRoleMenu(showRoleMenu === member.id ? null : member.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition cursor-pointer ${ROLE_COLORS[member.role]}`}
                      >
                        {ROLE_LABELS[member.role]}
                        <i className="fi fi-rr-angle-small-down" style={{ fontSize: '10px' }}></i>
                      </button>
                    )}

                    {showRoleMenu === member.id && (
                      <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-10 w-36 py-1 overflow-hidden">
                        <button onClick={() => handleChangeRole(member.id, 'editor')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between">
                          <span>แก้ไขได้</span>
                          {member.role === 'editor' && <i className="fi fi-rr-check text-blue-500 text-xs"></i>}
                        </button>
                        <button onClick={() => handleChangeRole(member.id, 'viewer')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between">
                          <span>ดูได้</span>
                          {member.role === 'viewer' && <i className="fi fi-rr-check text-blue-500 text-xs"></i>}
                        </button>
                        <hr className="my-1 border-gray-100" />
                        <button onClick={() => handleRemoveMember(member.id)}
                          className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                          นำออกจากทีม
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== REQUESTS TAB ===== */}
          {activeTab === 'requests' && (
            <>
              {requests.length === 0 ? (
                <div className="text-center py-14">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <i className="fi fi-rr-user-time text-gray-300 text-2xl"></i>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">ไม่มีคำขอเข้าทีม</p>
                  <p className="text-xs text-gray-400 mt-1">คำขอจะแสดงที่นี่เมื่อมีคนต้องการเข้าร่วม</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map(req => (
                    <div key={req.id} className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full ${req.color} flex items-center justify-center text-white font-bold shrink-0`}>
                          {req.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-700">{req.name}</p>
                          <p className="text-xs text-gray-400 truncate">{req.email}</p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{formatTimeAgo(req.requestedAt)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="flex-1 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition cursor-pointer"
                        >
                          ยอมรับ
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition cursor-pointer"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
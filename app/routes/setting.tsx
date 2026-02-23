import { useState } from 'react';
import { useNavigate } from 'react-router';
import ProfileSection from '../component/Setting/ProfileSection';
import ActivitySection from '../component/Setting/ActivitySection';
import CardSection from '../component/Setting/CardSection';
import BoardWorkspaceSection from '../component/Setting/BoardWorkspaceSection';
import MembersSection from '../component/Setting/MembersSection';

type Tab = 'profile' | 'activity' | 'cards' | 'boards' | 'members';

interface NavItem {
  id: Tab;
  label: string;
  icon: string;
  group: 'personal' | 'workspace';
}

const navItems: NavItem[] = [
  { id: 'profile',  label: 'Profile',   icon: 'fi-rr-user',      group: 'personal' },
  { id: 'activity', label: 'Activity',  icon: 'fi-rr-clock',     group: 'personal' },
  { id: 'cards',    label: 'Cards',     icon: 'fi-rr-memo-pad',  group: 'personal' },
  { id: 'boards',   label: 'Boards',    icon: 'fi-rr-dashboard', group: 'workspace' },
  { id: 'members',  label: 'Members',   icon: 'fi-rr-users',     group: 'workspace' },
];

export default function SettingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const personalItems = navItems.filter((n) => n.group === 'personal');
  const workspaceItems = navItems.filter((n) => n.group === 'workspace');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':  return <ProfileSection />;
      case 'activity': return <ActivitySection />;
      case 'cards':    return <CardSection />;
      case 'boards':   return <BoardWorkspaceSection />;
      case 'members':  return <MembersSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center border-b border-gray-300 p-4 px-6 bg-white">
        <div className="flex items-center gap-3">
          <img src="/icon.svg" alt="TEAMSCOPE Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold">TEAMSCOPE</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <i className="fi fi-rr-arrow-left text-sm leading-none" />
            กลับหน้าหลัก
          </button>     
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="w-60 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-6 sticky top-8">
            {/* Personal Settings */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Personal Settings
              </p>
              <div className="space-y-1">
                {personalItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                      ${activeTab === item.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                  >
                    <i className={`fi ${item.icon} text-base leading-none w-5 text-center`} />
                    {item.label}
                    {activeTab === item.id && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Workspace */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Workspace
              </p>
              <div className="space-y-1">
                {workspaceItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                      ${activeTab === item.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                  >
                    <i className={`fi ${item.icon} text-base leading-none w-5 text-center`} />
                    {item.label}
                    {activeTab === item.id && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-white rounded-2xl shadow-sm p-8 min-h-150">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
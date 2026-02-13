import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface Task {
  id: string;
  content: string;
}

export default function Dashboard() {
  const params = useParams();
  const navigate = useNavigate();
  const boardName = decodeURIComponent(params.boardName || '');
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', title: 'To do', tasks: [] },
    { id: '2', title: 'Doing', tasks: [] },
    { id: '3', title: 'Done', tasks: [] },
  ]);

  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleSearch = () => {
    console.log('ค้นหา:', searchTerm);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      setColumns([
        ...columns,
        { id: Date.now().toString(), title: newColumnTitle, tasks: [] },
      ]);
      setNewColumnTitle('');
      setShowAddColumn(false);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-100">
  
      <nav className="flex justify-between items-center border-b border-gray-300 p-4 px-6 bg-white fixed top-0 left-0 right-0 z-50">
        <div className="w-1/4 flex items-center gap-3">
          <button onClick={handleBack} className="hover:opacity-70 transition">
            <img 
              src="/icon.svg" 
              alt="TEAMSCOPE Logo" 
              className="w-10 h-10 object-contain"
            />
          </button>
          <span className="text-xl font-bold">TEAMSCOPE</span>
        </div>
        
        <div className="flex-1 flex justify-center max-w-2xl">
          <div className="search-container w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="ค้นหา..."
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="w-1/4 flex justify-end items-center gap-4">
          <button onClick={handleBack} className="p-3 hover:bg-gray-100 rounded-full transition cursor-pointer">
            <i className="fi fi-sr-home text-2xl md:text-3xl"></i>
          </button>
          <button className="p-3 hover:bg-gray-100 rounded-full transition cursor-pointer">
            <i className="fi fi-ss-bell text-2xl md:text-3xl"></i>
          </button>
          <button className="p-3 hover:bg-gray-100 rounded-full transition cursor-pointer">
            <i className="fi fi-rr-user text-2xl md:text-3xl"></i>
          </button>
        </div>
      </nav>

      <div className="pt-20">
        <header className="bg-gray-300 p-6 rounded-b-3xl">
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold italic">{boardName}</h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="bg-white px-6 py-3 rounded-full hover:bg-gray-100 transition flex items-center gap-2">
                <i className="fi fi-rr-bug text-xl"></i>
              </button>
              <button className="bg-white px-6 py-3 rounded-full hover:bg-gray-100 transition flex items-center gap-2">
                <i className="fi fi-rr-users text-xl"></i>
              </button>
              <button className="bg-white px-8 py-3 rounded-full hover:bg-gray-100 transition flex items-center gap-2 font-semibold">
                <i className="fi fi-rr-user-add text-xl"></i>
                <span className="text-lg">share</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className="bg-white rounded-2xl p-4 min-w-70 max-w-70 shrink-0"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold italic flex items-center gap-2">
                      {column.title}
                      <button className="text-sm">
                        <i className="fi fi-rr-check text-lg"></i>
                      </button>
                    </h3>
                    <button className="hover:bg-gray-100 p-2 rounded transition">
                      <i className="fi fi-br-menu-dots text-xl"></i>
                    </button>
                  </div>

                  <div className="space-y-2 min-h-100">
                    {column.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                      >
                        {task.content}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {showAddColumn ? (
                <div className="bg-white rounded-2xl p-4 min-w-70 max-w-70 shrink-0">
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddColumn();
                      if (e.key === 'Escape') setShowAddColumn(false);
                    }}
                    placeholder="ชื่อคอลัมน์..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddColumn}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      เพิ่ม
                    </button>
                    <button
                      onClick={() => setShowAddColumn(false)}
                      className="px-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddColumn(true)}
                  className="bg-white rounded-2xl p-4 min-w-70 max-w-70 shrink-0 hover:bg-gray-100 transition flex items-center justify-center text-2xl font-bold italic text-gray-500"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-8 py-4 shadow-lg flex items-center gap-8 z-50">
        <button className="text-lg hover:text-blue-500 transition">บอร์ด</button>
        <button className="text-lg hover:text-blue-500 transition">ส่วนร่วม</button>
        <button className="text-lg hover:text-blue-500 transition">สลับบอร์ด</button>
      </div>
    </div>
  );
}
import { useState } from 'react';
import CreateBoard from '../Create/create';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [boards, setBoards] = useState<any[]>([]);

  const handleSearch = () => {
    console.log('ค้นหา:', searchTerm);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSaveBoard = (boardData: { name: string; description: string; privacy: string }) => {
    console.log('บันทึกบอร์ด:', boardData);
    setBoards([...boards, { ...boardData, id: Date.now() }]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex justify-between items-center border-b border-gray-300 p-4 px-6 bg-white">
        <div className="w-1/4 flex items-center gap-3">
          <img 
            src="/app/component/Home/icon.svg" 
            alt="TEAMSCOPE Logo" 
            className="w-10 h-10 object-contain"
          />
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
          <button className="p-3 hover:bg-gray-100 rounded-full transition cursor-pointer">
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

      <div className="pt-10">
        <div className="flex relative">
          <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] bg-gray-200 p-4 flex flex-col items-center gap-8 rounded-tr-3xl z-40 transition-all duration-300 ease-in-out w-20 hover:w-64 group overflow-hidden">
            <button className="p-4 hover:bg-gray-300 rounded-lg transition w-full flex items-center gap-4 cursor-pointer">
              <i className="fi fi-sr-document text-3xl md:text-4xl shrink-0"></i>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                DashBoard
              </span>
            </button>
            
            <button className="p-4 hover:bg-gray-300 rounded-lg transition w-full flex items-center gap-4 cursor-pointer">
              <i className="fi fi-sr-bookmark text-3xl md:text-4xl shrink-0"></i>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Favorite
              </span>
            </button>
            
            <button className="p-4 hover:bg-gray-300 rounded-lg transition w-full flex items-center gap-4 cursor-pointer">
              <i className="fi fi-ss-settings text-3xl md:text-4xl shrink-0"></i>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Setting
              </span>
            </button>
          </aside>

          <main className="flex-1 p-6 md:p-8 ml-20">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-white rounded-3xl h-16 shadow-sm flex items-center px-6">
                <h2 className="text-3xl font-semibold">ล่าสุด</h2>
              </div>

              <div className="flex gap-6">
                <div className="bg-white rounded-3xl w-64 h-64 shadow-sm flex items-center justify-center">
                  <button 
                    onClick={() => setShowCreateBoard(true)}
                    className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition cursor-pointer"
                  >
                    <span className="text-3xl text-gray-600">+</span>
                  </button>
                </div>


                {boards.map((board) => (
                  <div key={board.id} className="bg-white rounded-3xl w-64 h-64 shadow-sm p-6">
                    <h3 className="text-xl font-bold mb-2">{board.name}</h3>
                    <p className="text-gray-600 text-sm">{board.description}</p>
                    <span className="text-xs text-gray-500 mt-2 inline-block">
                      {board.privacy}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-3xl h-16 shadow-sm flex items-center px-6">
                <h2 className="text-3xl font-semibold">ชื่นชอบ</h2>
              </div>

              <div className="bg-white rounded-3xl h-16 shadow-sm flex items-center px-6">
                <h2 className="text-3xl font-semibold">บอร์ดของคุณ</h2>
              </div>
            </div>
          </main>
        </div>
      </div>

      {showCreateBoard && (
        <CreateBoard
          onClose={() => setShowCreateBoard(false)}
          onSave={handleSaveBoard}
        />
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import CreateBoard from '../component/Create/create';

interface Board {
  id: number;
  name: string;
  description: string;
  privacy: string;
  isFavorite: boolean;
}

type SectionOrder = 'default' | 'favorite';

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [sectionOrder, setSectionOrder] = useState<SectionOrder>('default');

  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem('boards') || '[]');
    const normalized = savedBoards.map((b: any) => ({ isFavorite: false, ...b }));
    setBoards(normalized);
  }, []);

  const saveBoards = (updated: Board[]) => {
    setBoards(updated);
    localStorage.setItem('boards', JSON.stringify(updated));
  };

  const handleSaveBoard = (boardData: { name: string; description: string; privacy: string }) => {
    const newBoard: Board = { ...boardData, id: Date.now(), isFavorite: false };
    saveBoards([...boards, newBoard]);
  };

  const handleBoardClick = (boardName: string) => {
    navigate(`/board/${encodeURIComponent(boardName)}`);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('ต้องการลบบอร์ดนี้หรือไม่?')) {
      saveBoards(boards.filter((b) => b.id !== id));
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    saveBoards(boards.map((b) => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
  };

  const favoriteBoards = boards.filter((b) => b.isFavorite);

  const BoardCard = ({ board }: { board: Board }) => (
    <div
      onClick={() => handleBoardClick(board.name)}
      className="relative bg-white rounded-2xl w-56 h-36 shadow-sm p-4 cursor-pointer hover:shadow-lg transition group flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-base font-bold text-slate-800 truncate pr-2">{board.name}</h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={(e) => handleToggleFavorite(e, board.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer hover:bg-gray-100"
            title={board.isFavorite ? 'ยกเลิก Bookmark' : 'เพิ่ม Bookmark'}
          >
            <i className={`fi fi-sr-bookmark text-base leading-none ${board.isFavorite ? 'text-yellow-400' : 'text-gray-300 group-hover:text-gray-400'}`} />
          </button>
          <button
            onClick={(e) => handleDelete(e, board.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer hover:bg-red-50 text-gray-300 hover:text-red-400 group-hover:text-gray-400"
            title="ลบบอร์ด"
          >
            <i className="fi fi-rr-trash text-base leading-none" />
          </button>
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-xs line-clamp-2">{board.description}</p>
        <span className="text-xs text-gray-400 mt-1 inline-block">{board.privacy}</span>
      </div>
    </div>
  );

  const EmptyMessage = ({ text }: { text: string }) => (
    <div className="bg-white rounded-3xl h-16 shadow-sm flex items-center px-6">
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );

  // Section components
  const RecentSection = () => (
    <>
      <div className="bg-white rounded-3xl h-16 shadow-sm flex items-center px-6">
        <h2 className="text-3xl font-semibold">ล่าสุด</h2>
      </div>
      <div className="flex gap-4 flex-wrap">
        <div className="bg-white rounded-2xl w-56 h-36 shadow-sm flex items-center justify-center">
          <button
            onClick={() => setShowCreateBoard(true)}
            className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition cursor-pointer"
          >
            <span className="text-2xl text-gray-600">+</span>
          </button>
        </div>
        {boards.map((board) => <BoardCard key={board.id} board={board} />)}
      </div>
    </>
  );

  const FavoriteSection = () => (
    <>
      <div className="bg-white rounded-3xl h-16 shadow-sm flex items-center px-6">
        <h2 className="text-3xl font-semibold">ชื่นชอบ</h2>
      </div>
      {favoriteBoards.length > 0
        ? <div className="flex gap-4 flex-wrap">{favoriteBoards.map((board) => <BoardCard key={board.id} board={board} />)}</div>
        : <EmptyMessage text="ยังไม่มีบอร์ดที่ bookmark ไว้" />
      }
    </>
  );

  const MyBoardSection = () => (
    <>
      <div className="bg-white rounded-3xl h-16 shadow-sm flex items-center px-6">
        <h2 className="text-3xl font-semibold">บอร์ดของคุณ</h2>
      </div>
      {boards.length > 0
        ? <div className="flex gap-4 flex-wrap">{boards.map((board) => <BoardCard key={board.id} board={board} />)}</div>
        : <EmptyMessage text="ยังไม่มีบอร์ด กด + เพื่อสร้างบอร์ดแรก" />
      }
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center border-b border-gray-300 p-4 px-6 bg-white">
        <div className="w-1/4 flex items-center gap-3">
          <img src="/icon.svg" alt="TEAMSCOPE Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold">TEAMSCOPE</span>
        </div>
        <div className="flex-1 flex justify-center max-w-2xl">
          <input
            type="text" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && console.log('ค้นหา:', searchTerm)}
            placeholder="ค้นหา..."
            className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
          />
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
          {/* Sidebar */}
          <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] bg-gray-200 p-4 flex flex-col items-center gap-8 rounded-tr-3xl z-40 transition-all duration-300 ease-in-out w-20 hover:w-64 group/sidebar overflow-hidden">
            <button
              onClick={() => setSectionOrder('default')}
              className={`p-4 rounded-lg transition w-full flex items-center gap-4 cursor-pointer ${sectionOrder === 'default' ? 'bg-gray-300' : 'hover:bg-gray-300'}`}
            >
              <i className="fi fi-sr-document text-3xl md:text-4xl shrink-0"></i>
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">DashBoard</span>
            </button>

            <button
              onClick={() => setSectionOrder('favorite')}
              className={`p-4 rounded-lg transition w-full flex items-center gap-4 cursor-pointer ${sectionOrder === 'favorite' ? 'bg-gray-300' : 'hover:bg-gray-300'}`}
            >
              <i className="fi fi-sr-bookmark text-3xl md:text-4xl shrink-0"></i>
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">Favorite</span>
            </button>

            <button
              onClick={() => setSectionOrder('default')}
              className="p-4 hover:bg-gray-300 rounded-lg transition w-full flex items-center gap-4 cursor-pointer"
            >
              <i className="fi fi-ss-settings text-3xl md:text-4xl shrink-0"></i>
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">Setting</span>
            </button>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6 md:p-8 ml-20">
            <div className="max-w-6xl mx-auto space-y-6">
              {sectionOrder === 'default' ? (
                <>
                  <RecentSection />
                  <FavoriteSection />
                  <MyBoardSection />
                </>
              ) : (
                <>
                  <FavoriteSection />
                  <RecentSection />
                  <MyBoardSection />
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {showCreateBoard && (
        <CreateBoard onClose={() => setShowCreateBoard(false)} onSave={handleSaveBoard} />
      )}
    </div>
  );
}
import { useState } from 'react';
import NotificationPanel from '../Notification/NotificationPanel';

interface BoardNavbarProps {
  onBack: () => void;
}

export default function BoardNavbar({ onBack }: BoardNavbarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = () => {
    console.log('ค้นหา:', searchTerm);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center border-b border-gray-300 p-4 px-6 bg-white fixed top-0 left-0 right-0 z-50">
        <div className="w-1/4 flex items-center gap-3">
          <button onClick={onBack} className="hover:opacity-70 transition cursor-pointer">
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
          <button onClick={onBack} className="p-3 hover:bg-gray-100 rounded-full transition cursor-pointer">
            <i className="fi fi-sr-home text-2xl md:text-3xl"></i>
          </button>
          
          {/* Notification Button */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 hover:bg-gray-100 rounded-full transition cursor-pointer relative"
          >
            <i className="fi fi-ss-bell text-2xl md:text-3xl"></i>
            {/* Badge - แสดงจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-3 hover:bg-gray-100 rounded-full transition cursor-pointer">
            <i className="fi fi-rr-user text-2xl md:text-3xl"></i>
          </button>
        </div>
      </nav>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
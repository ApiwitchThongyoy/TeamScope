import { useState } from 'react';

interface Props {
  onBack: () => void;
}

export default function BoardNavbar({ onBack }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('ค้นหา:', searchTerm);
  };

  return (
    <nav className="flex justify-between items-center border-b border-gray-300 p-4 px-6 bg-white fixed top-0 left-0 right-0 z-50">
      {/* Logo */}
      <div className="w-1/4 flex items-center gap-3">
        <button onClick={onBack} className="hover:opacity-70 transition cursor-pointer">
          <img src="/icon.svg" alt="TEAMSCOPE Logo" className="w-10 h-10 object-contain" />
        </button>
        <span className="text-xl font-bold">TEAMSCOPE</span>
      </div>

      {/* Search */}
      <div className="flex-1 flex justify-center max-w-2xl">
        <div className="w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="ค้นหา..."
            className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Icons */}
      <div className="w-1/4 flex justify-end items-center gap-4">
        <button onClick={onBack} className="p-3 hover:bg-gray-100 rounded-full transition cursor-pointer">
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
  );
}
import { useState } from 'react';

interface Props {
  onAdd: (title: string) => void;
}

export default function AddColumnButton({ onAdd }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title);
      setTitle('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className="bg-white rounded-2xl p-4 min-w-70 max-w-70 shrink-0">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
            if (e.key === 'Escape') setIsAdding(false);
          }}
          placeholder="ชื่อคอลัมน์..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            เพิ่ม
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="px-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="bg-white rounded-2xl p-4 min-w-70 max-w-70 shrink-0 hover:bg-gray-100 transition flex items-center justify-center text-2xl font-bold italic text-gray-500 cursor-pointer"
    >
      Add
    </button>
  );
}
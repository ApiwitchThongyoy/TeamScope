'use client';

import { useState } from 'react';

interface CreateBoardProps {
  onClose: () => void;
  onSave: (boardData: { name: string; description: string; privacy: string }) => void;
}

export default function CreateBoard({ onClose, onSave }: CreateBoardProps) {
  const [boardName, setBoardName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');

  const handleSave = () => {
    if (boardName.trim()) {
      onSave({ name: boardName, description, privacy });
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0  flex items-center justify-center z-9999"
      onClick={onClose}
    >
      <div 
        className="bg-gray-200 rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl p-8">
   
          <div className="flex items-center gap-4 mb-6">
            <label className="text-2xl font-semibold whitespace-nowrap">
              Board Name :
            </label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="flex-1 bg-gray-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อบอร์ด"
            />
          </div>

     
          <div className="flex items-start gap-4 mb-6">
            <label className="text-2xl font-semibold whitespace-nowrap pt-3">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 bg-gray-200 rounded-3xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-30 resize-none"
              placeholder="กรอกรายละเอียด"
            />
          </div>

          <div className="mb-8">
            <label className="text-2xl font-semibold">privacy</label>
            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={privacy === 'public'}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="text-lg">Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={privacy === 'private'}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="text-lg">Private</span>
              </label>
            </div>
          </div>

 
          <div className="flex justify-end gap-4">
            <button
              onClick={handleSave}
              className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition cursor-pointer"
            >
              <i className="fi fi-br-check text-3xl"></i>
            </button>
            <button
              onClick={onClose}
              className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition cursor-pointer"
            >
              <i className="fi fi-br-cross text-3xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import type { Column, Task } from '../Board/types';
import TaskCard from './TaskCard';
import ColumnMenu from './ColumnMenu';

interface Props {
  column: Column;
  allColumns: Column[];
  isDragging: boolean;
  onAddCard: (columnId: string, content: string) => void;
  onDeleteCard: (columnId: string, taskId: string) => void;
  onSaveTitle: (columnId: string, newTitle: string) => void;
  onDelete: (columnId: string) => void;
  onCopy: (columnId: string) => void;
  onMove: (columnId: string, direction: 'before' | 'after', targetId: string) => void;
  onTaskDragStart: (task: Task, columnId: string) => void;
  onColumnDragStart: (columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (columnId: string) => void;
}

export default function ColumnCard({
  column,
  allColumns,
  isDragging,
  onAddCard,
  onDeleteCard,
  onSaveTitle,
  onDelete,
  onCopy,
  onMove,
  onTaskDragStart,
  onColumnDragStart,
  onDragOver,
  onDrop,
}: Props) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardContent, setNewCardContent] = useState('');
  const [openMenu, setOpenMenu] = useState(false);

  const handleStartEdit = () => {
    setEditingTitle(column.title);
    setIsEditingTitle(true);
    setOpenMenu(false);
  };

  const handleSaveTitle = () => {
    onSaveTitle(column.id, editingTitle);
    setIsEditingTitle(false);
    setEditingTitle('');
  };

  const handleAddCard = () => {
    onAddCard(column.id, newCardContent);
    setNewCardContent('');
    setIsAddingCard(false);
  };

  return (
    <>
      {/* Overlay to close menu */}
      {openMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(false)} />
      )}

      <div
        draggable
        onDragStart={() => onColumnDragStart(column.id)}
        onDragOver={onDragOver}
        onDrop={() => onDrop(column.id)}
        className={`bg-white rounded-2xl p-4 min-w-70 max-w-70 shrink-0 ${isDragging ? 'opacity-50' : ''}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          {isEditingTitle ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') { setIsEditingTitle(false); setEditingTitle(''); }
              }}
              className="text-xl font-bold italic bg-gray-100 px-2 py-1 rounded border-2 border-blue-500 focus:outline-none flex-1"
              autoFocus
            />
          ) : (
            <h3
              onClick={handleStartEdit}
              className="text-xl font-bold italic cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition"
            >
              {column.title}
            </h3>
          )}

          <div className="relative">
            <button
              onClick={() => setOpenMenu(prev => !prev)}
              className="hover:bg-gray-100 p-2 rounded transition cursor-pointer"
            >
              <i className="fi fi-br-menu-dots text-xl"></i>
            </button>

            {openMenu && (
              <ColumnMenu
                column={column}
                allColumns={allColumns}
                onEdit={handleStartEdit}
                onCopy={() => { onCopy(column.id); setOpenMenu(false); }}
                onDelete={() => { onDelete(column.id); setOpenMenu(false); }}
                onMove={(dir, targetId) => onMove(column.id, dir, targetId)}
                onClose={() => setOpenMenu(false)}
              />
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-2 min-h-70">
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => onDeleteCard(column.id, task.id)}
              onDragStart={() => onTaskDragStart(task, column.id)}
            />
          ))}
        </div>

        {/* Add Card */}
        {isAddingCard ? (
          <div className="mt-2">
            <textarea
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard(); }
                if (e.key === 'Escape') { setIsAddingCard(false); setNewCardContent(''); }
              }}
              placeholder="ใส่เนื้อหาการ์ด..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAddCard}
                className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition text-sm"
              >
                เพิ่ม
              </button>
              <button
                onClick={() => { setIsAddingCard(false); setNewCardContent(''); }}
                className="px-3 bg-gray-200 rounded hover:bg-gray-300 transition text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full mt-2 p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition text-left flex items-center gap-2"
          >
            <i className="fi fi-rr-plus text-sm"></i>
            <span className="text-sm">เพิ่มการ์ด</span>
          </button>
        )}
      </div>
    </>
  );
}
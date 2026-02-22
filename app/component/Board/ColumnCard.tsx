import { useState } from 'react';
import type { Column, Task } from '../Board/types';
import TaskCard from './TaskCard';
import ColumnMenu from './ColumnMenu';
import CardModal from './Cardmodal';

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
  onDrop: (columnId: string, toIndex?: number) => void;
  onColumnDrop: (columnId: string) => void;
  onUpdateCardContent: (taskId: string, newContent: string) => void;
  onToggleTaskDone: (taskId: string, isDone: boolean) => void;
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
  onColumnDrop,
  onUpdateCardContent,
  onToggleTaskDone,
}: Props) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardContent, setNewCardContent] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const handleTaskDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const newIndex = e.clientY < midY ? index : index + 1;
    setDragOverIndex(prev => prev !== newIndex ? newIndex : prev);
  };

  const handleDrop = () => {
    onDrop(column.id, dragOverIndex ?? column.tasks.length);
    setDragOverIndex(null);
  };

  return (
    <>
      {openMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(false)} />
      )}

      {selectedTask && (
        <CardModal
          task={selectedTask}
          columnTitle={column.title}
          onClose={() => setSelectedTask(null)}
          onUpdateContent={(taskId, newContent) => {
            onUpdateCardContent(taskId, newContent);
            setSelectedTask(prev => prev ? { ...prev, content: newContent } : null);
          }}
          onToggleDone={(taskId, isDone) => {
            onToggleTaskDone(taskId, isDone);
            setSelectedTask(prev => prev ? { ...prev, isDone } : null);
          }}
        />
      )}

      <div
        draggable
        onDragStart={() => onColumnDragStart(column.id)}
        onDragOver={onDragOver}
        onDrop={() => onColumnDrop(column.id)}
        className={`bg-white rounded-2xl p-4 min-w-70 max-w-70 shrink-0 h-fit flex flex-col ${isDragging ? 'border-2 border-blue-300' : ''}`}
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
        <div
          className="space-y-2 min-h-10"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (column.tasks.length === 0) setDragOverIndex(0);
          }}
          onDrop={(e) => {
            e.stopPropagation();
            handleDrop();
          }}
          onDragLeave={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < rect.left ||
              e.clientX > rect.right ||
              e.clientY < rect.top ||
              e.clientY > rect.bottom
            ) {
              setDragOverIndex(null);
            }
          }}
        >
          {dragOverIndex === 0 && (
            <div className="h-0.5 bg-blue-400 rounded mx-1" />
          )}

          {column.tasks.map((task, index) => (
            <div
              key={task.id}
              onDragOver={(e) => handleTaskDragOver(e, index)}
            >
              <TaskCard
                task={task}
                onDelete={() => onDeleteCard(column.id, task.id)}
                onDragStart={() => onTaskDragStart(task, column.id)}
                onClick={() => setSelectedTask(task)}
              />

              {dragOverIndex === index + 1 && (
                <div className="h-0.5 bg-blue-400 rounded mx-1 mt-2" />
              )}
            </div>
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
                className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition text-sm cursor-pointer"
              >
                เพิ่ม
              </button>
              <button
                onClick={() => { setIsAddingCard(false); setNewCardContent(''); }}
                className="px-3 bg-gray-200 rounded hover:bg-gray-300 transition text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full mt-2 p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition text-left flex items-center gap-2 cursor-pointer"
          >
            <i className="fi fi-rr-plus text-sm"></i>
            <span className="text-sm">เพิ่มการ์ด</span>
          </button>
        )}
      </div>
    </>
  );
}
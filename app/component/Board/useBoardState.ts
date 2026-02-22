import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { Column, Task } from '../Board/types';

export function useBoardState(initialBoardName: string) {
  const navigate = useNavigate();

  const [boardName, setBoardName] = useState(initialBoardName);
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [columns, setColumns] = useState<Column[]>([]);
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromColumnId: string } | null>(null);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);

  const handleSaveBoardName = () => {
    if (boardName.trim()) {
      const savedBoards = JSON.parse(localStorage.getItem('boards') || '[]');
      const updatedBoards = savedBoards.map((board: any) =>
        board.name === initialBoardName ? { ...board, name: boardName } : board
      );
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
    }
    setIsEditingBoardName(false);
  };

  const handleAddColumn = (title: string) => {
    if (title.trim()) {
      setColumns(prev => [...prev, { id: Date.now().toString(), title, tasks: [] }]);
    }
  };

  const handleSaveColumnTitle = (columnId: string, newTitle: string) => {
    if (newTitle.trim()) {
      setColumns(prev =>
        prev.map(col => (col.id === columnId ? { ...col, title: newTitle } : col))
      );
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (window.confirm('ต้องการลบคอลัมน์นี้หรือไม่?')) {
      setColumns(prev => prev.filter(col => col.id !== columnId));
    }
  };

  const handleCopyColumn = (columnId: string) => {
    const columnToCopy = columns.find(col => col.id === columnId);
    if (columnToCopy) {
      const newColumn: Column = {
        ...columnToCopy,
        id: Date.now().toString(),
        title: `${columnToCopy.title} (Copy)`,
        tasks: columnToCopy.tasks.map(task => ({
          ...task,
          id: Date.now().toString() + Math.random(),
        })),
      };
      setColumns(prev => [...prev, newColumn]);
    }
  };

  const handleMoveColumn = (columnId: string, direction: 'before' | 'after', targetColumnId: string) => {
    const currentIndex = columns.findIndex(col => col.id === columnId);
    const targetIndex = columns.findIndex(col => col.id === targetColumnId);
    if (currentIndex === -1 || targetIndex === -1) return;

    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(currentIndex, 1);
    const insertIndex = direction === 'before' ? targetIndex : targetIndex + 1;
    const adjustedIndex = currentIndex < targetIndex ? insertIndex - 1 : insertIndex;
    newColumns.splice(adjustedIndex, 0, movedColumn);
    setColumns(newColumns);
  };

  const handleAddCard = (columnId: string, content: string) => {
    if (content.trim()) {
      setColumns(prev =>
        prev.map(col =>
          col.id === columnId
            ? { ...col, tasks: [...col.tasks, { id: Date.now().toString(), content }] }
            : col
        )
      );
    }
  };

  const handleDeleteCard = (columnId: string, taskId: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
          : col
      )
    );
  };

  // อัปเดตเนื้อหาการ์ดจาก modal
  const handleUpdateCardContent = (taskId: string, newContent: string) => {
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        tasks: col.tasks.map(task =>
          task.id === taskId ? { ...task, content: newContent } : task
        ),
      }))
    );
  };

  const handleTaskDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, fromColumnId: columnId });
  };

  const handleTaskDrop = (toColumnId: string, toIndex?: number) => {
    if (!draggedTask) return;
    const { task, fromColumnId } = draggedTask;

    setColumns(prev => {
      const withoutTask = prev.map(col =>
        col.id === fromColumnId
          ? { ...col, tasks: col.tasks.filter(t => t.id !== task.id) }
          : col
      );
      return withoutTask.map(col => {
        if (col.id !== toColumnId) return col;
        const newTasks = [...col.tasks];
        const insertAt = toIndex !== undefined ? toIndex : newTasks.length;
        newTasks.splice(insertAt, 0, task);
        return { ...col, tasks: newTasks };
      });
    });

    setDraggedTask(null);
  };

  const handleColumnDragStart = (columnId: string) => setDraggedColumnId(columnId);

  const handleColumnDrop = (targetColumnId: string) => {
    if (!draggedColumnId || draggedColumnId === targetColumnId) {
      setDraggedColumnId(null);
      return;
    }
    const draggedIndex = columns.findIndex(col => col.id === draggedColumnId);
    const targetIndex = columns.findIndex(col => col.id === targetColumnId);
    const newColumns = [...columns];
    const [draggedColumn] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);
    setColumns(newColumns);
    setDraggedColumnId(null);
  };

  const handleBack = () => navigate('/home');

  return {
    boardName,
    setBoardName,
    isEditingBoardName,
    setIsEditingBoardName,
    columns,
    draggedTask,
    draggedColumnId,
    handleSaveBoardName,
    handleAddColumn,
    handleSaveColumnTitle,
    handleDeleteColumn,
    handleCopyColumn,
    handleMoveColumn,
    handleAddCard,
    handleDeleteCard,
    handleUpdateCardContent,
    handleTaskDragStart,
    handleTaskDrop,
    handleColumnDragStart,
    handleColumnDrop,
    handleBack,
  };
}
import { useState } from 'react';
import { useParams } from 'react-router';
import { useBoardState } from '~/component/Board/useBoardState';
import BoardNavbar from '~/component/Board/BoardNavbar';
import BoardHeader from '~/component/Board/BoardHeader';
import ColumnCard from '~/component/Board/ColumnCard';
import AddColumnButton from '~/component/Board/AddColumnButton';
import BottomNav from '~/component/Board/BottomNav';
import ContributionPanel from '~/component/Board/ContributionPanel';

export default function Dashboard() {
  const params = useParams();
  const initialBoardName = decodeURIComponent(params.boardName || '');
  const [showContribution, setShowContribution] = useState(false);

  const {
    boardName,
    setBoardName,
    isEditingBoardName,
    setIsEditingBoardName,
    columns,
    draggedColumnId,
    handleSaveBoardName,
    handleAddColumn,
    handleSaveColumnTitle,
    handleDeleteColumn,
    handleCopyColumn,
    handleMoveColumn,
    handleAddCard,
    handleDeleteCard,
    handleUpdateTask,
    handleToggleTaskDone,
    handleTaskDragStart,
    handleTaskDrop,
    handleColumnDragStart,
    handleColumnDrop,
    handleBack,
  } = useBoardState(initialBoardName);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleTaskDropOnly = (columnId: string, toIndex?: number) => {
    handleTaskDrop(columnId, toIndex);
  };

  const handleColumnDropOnly = (columnId: string) => {
    handleColumnDrop(columnId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <BoardNavbar onBack={handleBack} />

      <div className="pt-20">
        <BoardHeader
          boardName={boardName}
          isEditing={isEditingBoardName}
          initialBoardName={initialBoardName}
          onChange={setBoardName}
          onStartEdit={() => setIsEditingBoardName(true)}
          onSave={handleSaveBoardName}
          onCancel={() => {
            setBoardName(initialBoardName);
            setIsEditingBoardName(false);
          }}
        />

        <div className="p-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex gap-4 overflow-x-auto pb-4 items-start">
              {columns.map((column) => (
                <ColumnCard
                  key={column.id}
                  column={column}
                  allColumns={columns}
                  isDragging={draggedColumnId === column.id}
                  onAddCard={handleAddCard}
                  onDeleteCard={handleDeleteCard}
                  onSaveTitle={handleSaveColumnTitle}
                  onDelete={handleDeleteColumn}
                  onCopy={handleCopyColumn}
                  onMove={handleMoveColumn}
                  onTaskDragStart={handleTaskDragStart}
                  onColumnDragStart={handleColumnDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleTaskDropOnly}
                  onColumnDrop={handleColumnDropOnly}
                  onUpdateTask={handleUpdateTask}
                  onToggleTaskDone={handleToggleTaskDone}
                />
              ))}

              <AddColumnButton onAdd={handleAddColumn} />
            </div>
          </div>
        </div>
      </div>

      <BottomNav onContribution={() => setShowContribution(true)} />

      <ContributionPanel
        isOpen={showContribution}
        onClose={() => setShowContribution(false)}
        columns={columns}
      />
    </div>
  );
}
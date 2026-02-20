import { useParams } from 'react-router';
import { useBoardState } from '~/component/Board/useBoardState';
import BoardNavbar from '~/component/Board/BoardNavbar';
import BoardHeader from '~/component/Board/BoardHeader';
import ColumnCard from '~/component/Board/ColumnCard';
import AddColumnButton from '~/component/Board/AddColumnButton';
import BottomNav from '~/component/Board/BottomNav';

export default function Dashboard() {
  const params = useParams();
  const initialBoardName = decodeURIComponent(params.boardName || '');

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
    handleTaskDragStart,
    handleTaskDrop,
    handleColumnDragStart,
    handleColumnDrop,
    handleBack,
  } = useBoardState(initialBoardName);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleCombinedDrop = (columnId: string) => {
    handleColumnDrop(columnId);
    handleTaskDrop(columnId);
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
            <div className="flex gap-4 overflow-x-auto pb-4">
              {columns.map((Column) => (
                <ColumnCard
                  key={Column.id}
                  column={Column}
                  allColumns={columns}
                  isDragging={draggedColumnId === Column.id}
                  onAddCard={handleAddCard}
                  onDeleteCard={handleDeleteCard}
                  onSaveTitle={handleSaveColumnTitle}
                  onDelete={handleDeleteColumn}
                  onCopy={handleCopyColumn}
                  onMove={handleMoveColumn}
                  onTaskDragStart={handleTaskDragStart}
                  onColumnDragStart={handleColumnDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleCombinedDrop}
                />
              ))}

              <AddColumnButton onAdd={handleAddColumn} />
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
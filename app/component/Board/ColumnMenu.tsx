import type { Column } from '../Board/types';

interface Props {
  column: Column;
  allColumns: Column[];
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onMove: (direction: 'before' | 'after', targetId: string) => void;
  onClose: () => void;
}

export default function ColumnMenu({
  column,
  allColumns,
  onEdit,
  onCopy,
  onDelete,
  onMove,
  onClose,
}: Props) {
  const otherColumns = allColumns.filter(col => col.id !== column.id);

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50">
      <button
        onClick={onEdit}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg flex items-center gap-2"
      >
        <i className="fi fi-rr-edit text-sm"></i>
        <span>แก้ไขชื่อ</span>
      </button>

      <button
        onClick={onCopy}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
      >
        <i className="fi fi-rr-copy text-sm"></i>
        <span>คัดลอก/ทำซ้ำ</span>
      </button>

      <hr className="my-1" />

      <div className="px-2 py-1 text-xs text-gray-500 font-semibold">ย้ายคอลัมน์</div>

      {otherColumns.map((targetCol) => (
        <div key={targetCol.id} className="px-2">
          <button
            onClick={() => { onMove('before', targetCol.id); onClose(); }}
            className="w-full text-left px-4 py-1 hover:bg-gray-100 text-sm rounded flex items-center gap-2"
          >
            <i className="fi fi-rr-arrow-small-left text-xs"></i>
            <span>ไปก่อน "{targetCol.title}"</span>
          </button>
          <button
            onClick={() => { onMove('after', targetCol.id); onClose(); }}
            className="w-full text-left px-4 py-1 hover:bg-gray-100 text-sm rounded flex items-center gap-2"
          >
            <i className="fi fi-rr-arrow-small-right text-xs"></i>
            <span>ไปหลัง "{targetCol.title}"</span>
          </button>
        </div>
      ))}

      <hr className="my-1" />

      <button
        onClick={onDelete}
        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-lg flex items-center gap-2"
      >
        <i className="fi fi-rr-trash text-sm"></i>
        <span>ลบคอลัมน์</span>
      </button>
    </div>
  );
}
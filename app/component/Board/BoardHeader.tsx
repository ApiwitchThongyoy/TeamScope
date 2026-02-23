type Privacy = 'private' | 'public';

interface Props {
  boardName: string;
  isEditing: boolean;
  initialBoardName: string;
  privacy: Privacy;
  onChange: (name: string) => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onOpenPrivacy: () => void;
  onOpenShare: () => void;
}

export default function BoardHeader({
  boardName, isEditing, initialBoardName, privacy,
  onChange, onStartEdit, onSave, onCancel, onOpenPrivacy, onOpenShare,
}: Props) {
  return (
    <header className="bg-gray-300 p-6 rounded-b-3xl">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        {/* Board Name */}
        <div className="flex items-center gap-4">
          {isEditing ? (
            <input
              type="text"
              value={boardName}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSave();
                if (e.key === 'Escape') onCancel();
              }}
              className="text-3xl font-bold italic bg-white px-3 py-1 rounded border-2 border-blue-500 focus:outline-none"
              autoFocus
            />
          ) : (
            <h1
              onClick={onStartEdit}
              className="text-3xl font-bold italic cursor-pointer hover:bg-white/30 px-3 py-1 rounded transition"
            >
              {boardName}
            </h1>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* ปุ่ม user */}
          <button className="bg-white px-6 py-3 rounded-full hover:bg-gray-100 transition flex items-center gap-2 cursor-pointer">
            <i className="fi fi-rr-user text-xl"></i>
          </button>

          {/* ปุ่ม Privacy — แสดง lock หรือ globe ตามสถานะ */}
          <button
            onClick={onOpenPrivacy}
            className="bg-white px-6 py-3 rounded-full hover:bg-gray-100 transition flex items-center gap-2 cursor-pointer relative"
            title={privacy === 'private' ? 'Private — เฉพาะทีม' : 'Public — ทุกคนเห็นได้'}
          >
            <i className={`fi ${privacy === 'private' ? 'fi-rr-lock' : 'fi-rr-globe'} text-xl`}></i>
            {/* badge สีเล็กๆ บอกสถานะ */}
            <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${privacy === 'private' ? 'bg-gray-400' : 'bg-green-500'}`} />
          </button>

          {/* ปุ่ม share */}
          <button
            onClick={onOpenShare}
            className="bg-white px-8 py-3 rounded-full hover:bg-gray-100 transition flex items-center gap-2 font-semibold cursor-pointer">
            <i className="fi fi-rr-user-add text-xl"></i>
            <span className="text-lg">share</span>
          </button>
        </div>
      </div>
    </header>
  );
}
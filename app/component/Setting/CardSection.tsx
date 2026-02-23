import { useState, useEffect } from 'react';

interface AssignedCard {
  id: string;
  cardName: string;
  columnName: string;
  boardName: string;
  dueDate?: string;
  isDone: boolean;
}

export default function CardSection() {
  const [cards, setCards] = useState<AssignedCard[]>([]);

  useEffect(() => {
    // ดึงจาก localStorage boards ทั้งหมด
    const boards = JSON.parse(localStorage.getItem('boards') || '[]');
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const userName = profile.name || '';
    const result: AssignedCard[] = [];

    boards.forEach((board: any) => {
      const boardColumns = JSON.parse(localStorage.getItem(`columns_${board.name}`) || '[]');
      boardColumns.forEach((col: any) => {
        col.tasks?.forEach((task: any) => {
          if (!task.assignee || task.assignee === userName || userName === '') {
            result.push({
              id: task.id,
              cardName: task.content,
              columnName: col.title,
              boardName: board.name,
              dueDate: task.dueDate,
              isDone: task.isDone || false,
            });
          }
        });
      });
    });

    setCards(result);
  }, []);

  const toggleDone = (id: string) => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, isDone: !c.isDone } : c));
  };

  const pending = cards.filter((c) => !c.isDone);
  const done = cards.filter((c) => c.isDone);

  const CardRow = ({ card }: { card: AssignedCard }) => (
    <div className={`flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group ${card.isDone ? 'opacity-50' : ''}`}>
      <button
        onClick={() => toggleDone(card.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer
          ${card.isDone
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-slate-300 hover:border-indigo-400'}`}
      >
        {card.isDone && <i className="fi fi-rr-check text-xs leading-none" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-slate-700 truncate ${card.isDone ? 'line-through' : ''}`}>
          {card.cardName}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-slate-400">{card.columnName}</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-indigo-500 font-medium">{card.boardName}</span>
          {card.dueDate && (
            <>
              <span className="text-slate-300">·</span>
              <span className={`text-xs ${new Date(card.dueDate) < new Date() && !card.isDone ? 'text-red-500' : 'text-slate-400'}`}>
                <i className="fi fi-rr-calendar text-xs mr-1" />
                {new Date(card.dueDate).toLocaleDateString('th-TH')}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-3">
        Cards ที่ได้รับมอบหมาย
      </h3>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <i className="fi fi-rr-memo-pad text-4xl mb-3 opacity-40" />
          <p className="text-sm">ยังไม่มี card ที่ได้รับมอบหมาย</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                กำลังดำเนินการ ({pending.length})
              </p>
              <div className="space-y-1">
                {pending.map((c) => <CardRow key={c.id} card={c} />)}
              </div>
            </div>
          )}
          {done.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                เสร็จแล้ว ({done.length})
              </p>
              <div className="space-y-1">
                {done.map((c) => <CardRow key={c.id} card={c} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
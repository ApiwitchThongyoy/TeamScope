import { useEffect, useState } from 'react';
import type { Column, Task } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
}

interface MemberStat {
  id: string;
  name: string;
  avatar: string;
  color: string;
  bgColor: string;
  total: number;
  done: number;
  late: number;    // ส่งล่าช้า (isDone=true แต่เกิน deadline)
  missing: number; // ไม่ได้ส่ง (isDone=false และ deadline ผ่านแล้ว)
}

const CHART_COLORS = [
  { fill: '#8b5cf6' }, { fill: '#3b82f6' }, { fill: '#10b981' },
  { fill: '#f97316' }, { fill: '#ef4444' }, { fill: '#ec4899' },
];

// คำนวณว่า task นี้ deadline ผ่านแล้วหรือยัง
function isOverdue(task: Task): boolean {
  const dateStr = task.endDate || task.startDate;
  if (!dateStr) return false;
  const timeStr = task.endDate ? (task.endTime || '23:59') : (task.startTime || '23:59');
  const deadline = new Date(`${dateStr}T${timeStr}`);
  return deadline < new Date();
}

// สถานะของ task แต่ละอัน
function getTaskStatus(task: Task): 'done' | 'late' | 'missing' | 'ongoing' {
  const overdue = isOverdue(task);
  if (task.isDone && overdue) return 'late';
  if (task.isDone) return 'done';
  if (!task.isDone && overdue) return 'missing';
  return 'ongoing';
}

function PieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return (
    <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
      <p className="text-sm text-gray-400">ยังไม่มีข้อมูล</p>
    </div>
  );

  let cumulative = 0;
  const slices = data.map(d => {
    const start = cumulative;
    const pct = d.value / total;
    cumulative += pct;
    return { ...d, start, pct };
  });

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;
  const innerR = 48;

  const toXY = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(angle - Math.PI / 2),
    y: cy + radius * Math.sin(angle - Math.PI / 2),
  });

  const pathSlice = (start: number, end: number) => {
    const sa = start * 2 * Math.PI;
    const ea = end * 2 * Math.PI;
    const large = end - start > 0.5 ? 1 : 0;
    const s1 = toXY(sa, r); const e1 = toXY(ea, r);
    const s2 = toXY(ea, innerR); const e2 = toXY(sa, innerR);
    return `M ${s1.x} ${s1.y} A ${r} ${r} 0 ${large} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y} Z`;
  };

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {slices.map((slice, i) => (
          <path key={i} d={pathSlice(slice.start, slice.start + slice.pct)} fill={slice.color} className="hover:opacity-80 transition-opacity" />
        ))}
        <circle cx={cx} cy={cy} r={innerR - 2} fill="white" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-gray-700">{total}</p>
        <p className="text-xs text-gray-400">งานทั้งหมด</p>
      </div>
    </div>
  );
}

// แท็บ
type Tab = 'overview' | 'late' | 'missing';

export default function ContributionPanel({ isOpen, onClose, columns }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    if (isOpen) setTimeout(() => setMounted(true), 10);
    else { setMounted(false); setActiveTab('overview'); }
  }, [isOpen]);

  // รวม tasks ทั้งหมด
  const allTasks = columns.flatMap(col => col.tasks);
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t => getTaskStatus(t) === 'done').length;
  const lateTasks = allTasks.filter(t => getTaskStatus(t) === 'late');
  const missingTasks = allTasks.filter(t => getTaskStatus(t) === 'missing');

  // สถิติสมาชิก
  const memberMap = new Map<string, MemberStat>();
  allTasks.forEach(task => {
    const status = getTaskStatus(task);
    (task.members ?? []).forEach(m => {
      if (!memberMap.has(m.id)) {
        const colorIdx = parseInt(m.id) % CHART_COLORS.length;
        memberMap.set(m.id, {
          id: m.id, name: m.name, avatar: m.avatar,
          color: CHART_COLORS[colorIdx].fill, bgColor: m.color,
          total: 0, done: 0, late: 0, missing: 0,
        });
      }
      const stat = memberMap.get(m.id)!;
      stat.total += 1;
      if (status === 'done') stat.done += 1;
      if (status === 'late') stat.late += 1;
      if (status === 'missing') stat.missing += 1;
    });
  });
  const members = Array.from(memberMap.values());

  const pieData = members.length > 0
    ? members.map(m => ({ name: m.name, value: m.total, color: m.color }))
    : [{ name: 'ว่าง', value: 1, color: '#e5e7eb' }];

  // หาชื่อคอลัมน์จาก task
  const getColumnTitle = (task: Task) => columns.find(c => c.tasks.some(t => t.id === task.id))?.title ?? '';

  if (!isOpen) return null;

  const tabs: { key: Tab; label: string; count?: number; color?: string }[] = [
    { key: 'overview', label: 'ภาพรวม' },
    { key: 'late', label: 'ส่งล่าช้า', count: lateTasks.length, color: 'text-yellow-600' },
    { key: 'missing', label: 'ไม่ได้ส่ง', count: missingTasks.length, color: 'text-red-500' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-70 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-71 flex flex-col transition-transform duration-300 ease-out ${mounted ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">การมีส่วนร่วม</h2>
            <p className="text-xs text-gray-400 mt-0.5">สถิติการทำงานของสมาชิก</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
            <i className="fi fi-rr-cross text-gray-500"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 shrink-0 px-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === tab.key ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${tab.key === 'late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ===== TAB: OVERVIEW ===== */}
          {activeTab === 'overview' && (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{totalTasks}</p>
                  <p className="text-xs text-blue-400 mt-1">งานทั้งหมด</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{doneTasks}</p>
                  <p className="text-xs text-green-400 mt-1">เสร็จตรงเวลา</p>
                </div>
                <div className="bg-yellow-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-500">{lateTasks.length}</p>
                  <p className="text-xs text-yellow-400 mt-1">ส่งล่าช้า</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-red-500">{missingTasks.length}</p>
                  <p className="text-xs text-red-400 mt-1">ไม่ได้ส่ง</p>
                </div>
              </div>

              {/* Pie Chart */}
              <h3 className="text-sm font-semibold text-gray-600 mb-4">สัดส่วนงานตามสมาชิก</h3>
              <PieChart data={pieData} />

              {members.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mt-4 mb-6">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="text-xs text-gray-500">{m.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Overall progress */}
              {totalTasks > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-600">ความคืบหน้าภาพรวม</span>
                    <span className="text-sm font-bold text-gray-700">{Math.round(((doneTasks + lateTasks.length) / totalTasks) * 100)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-green-500 transition-all duration-700" style={{ width: `${(doneTasks / totalTasks) * 100}%` }} />
                    <div className="h-full bg-yellow-400 transition-all duration-700" style={{ width: `${(lateTasks.length / totalTasks) * 100}%` }} />
                  </div>
                  <div className="flex gap-4 mt-1.5">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-xs text-gray-400">ตรงเวลา</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400" /><span className="text-xs text-gray-400">ล่าช้า</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-200" /><span className="text-xs text-gray-400">ยังไม่ส่ง</span></div>
                  </div>
                </div>
              )}

              {/* Per member */}
              <h3 className="text-sm font-semibold text-gray-600 mb-3">รายละเอียดรายบุคคล</h3>
              {members.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <i className="fi fi-rr-users text-gray-300 text-2xl"></i>
                  </div>
                  <p className="text-sm text-gray-400">ยังไม่มีสมาชิกที่ถูกมอบหมายงาน</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map(m => {
                    const pct = m.total > 0 ? Math.round(((m.done + m.late) / m.total) * 100) : 0;
                    return (
                      <div key={m.id} className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-9 h-9 rounded-full ${m.bgColor} flex items-center justify-center text-white font-bold shrink-0`}>{m.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 truncate">{m.name}</p>
                            <div className="flex gap-2 mt-0.5">
                              <span className="text-xs text-green-600">{m.done} ตรงเวลา</span>
                              {m.late > 0 && <span className="text-xs text-yellow-600">{m.late} ล่าช้า</span>}
                              {m.missing > 0 && <span className="text-xs text-red-500">{m.missing} ไม่ส่ง</span>}
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: m.color }}>
                            {pct}%
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
                          <div className="h-full bg-green-500" style={{ width: `${m.total > 0 ? (m.done / m.total) * 100 : 0}%` }} />
                          <div className="h-full bg-yellow-400" style={{ width: `${m.total > 0 ? (m.late / m.total) * 100 : 0}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ===== TAB: LATE ===== */}
          {activeTab === 'late' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <i className="fi fi-rr-clock text-yellow-600 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">ส่งล่าช้ากว่ากำหนด</p>
                  <p className="text-xs text-gray-400">งานที่ทำเสร็จแล้วแต่เกิน deadline</p>
                </div>
              </div>

              {lateTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-3">
                    <i className="fi fi-rr-check text-yellow-400 text-2xl"></i>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">ไม่มีงานที่ส่งล่าช้า</p>
                  <p className="text-xs text-gray-400 mt-1">ทุกงานส่งตรงเวลา</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lateTasks.map(task => {
                    const deadline = task.endDate
                      ? `${task.endDate}${task.endTime ? ` ${task.endTime}` : ''}`
                      : `${task.startDate}${task.startTime ? ` ${task.startTime}` : ''}`;
                    return (
                      <div key={task.id} className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center shrink-0 mt-0.5">
                            <i className="fi fi-rr-clock text-white" style={{ fontSize: '9px' }}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 wrap-break-words">{task.content}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{getColumnTitle(task)}</p>
                          </div>
                        </div>
                        <div className="ml-7">
                          <p className="text-xs text-yellow-700">
                            <span className="font-medium">กำหนด:</span> {deadline}
                          </p>
                          {(task.members ?? []).length > 0 && (
                            <div className="flex items-center gap-1 mt-1.5">
                              {task.members!.map(m => (
                                <div key={m.id} className={`w-5 h-5 rounded-full ${m.color} flex items-center justify-center text-white font-bold border border-white`} style={{ fontSize: '8px' }} title={m.name}>
                                  {m.avatar}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ===== TAB: MISSING ===== */}
          {activeTab === 'missing' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <i className="fi fi-rr-cross-circle text-red-500 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">ไม่ได้ส่ง</p>
                  <p className="text-xs text-gray-400">งานที่เกิน deadline และยังไม่เสร็จ</p>
                </div>
              </div>

              {missingTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                    <i className="fi fi-rr-check text-red-300 text-2xl"></i>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">ไม่มีงานที่หายไป</p>
                  <p className="text-xs text-gray-400 mt-1">ทุกงานอยู่ในระหว่างดำเนินการ</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {missingTasks.map(task => {
                    const deadline = task.endDate
                      ? `${task.endDate}${task.endTime ? ` ${task.endTime}` : ''}`
                      : `${task.startDate}${task.startTime ? ` ${task.startTime}` : ''}`;
                    // คำนวณว่าเกินมากี่วัน
                    const deadlineDate = new Date(task.endDate
                      ? `${task.endDate}T${task.endTime || '23:59'}`
                      : `${task.startDate}T${task.startTime || '23:59'}`);
                    const daysLate = Math.floor((Date.now() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <div key={task.id} className="bg-red-50 border border-red-100 rounded-2xl p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center shrink-0 mt-0.5">
                            <i className="fi fi-rr-cross text-white" style={{ fontSize: '8px' }}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 wrap-break-words">{task.content}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{getColumnTitle(task)}</p>
                          </div>
                          {daysLate > 0 && (
                            <span className="shrink-0 text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                              เกิน {daysLate} วัน
                            </span>
                          )}
                        </div>
                        <div className="ml-7">
                          <p className="text-xs text-red-700">
                            <span className="font-medium">กำหนด:</span> {deadline}
                          </p>
                          {(task.members ?? []).length > 0 && (
                            <div className="flex items-center gap-1 mt-1.5">
                              {task.members!.map(m => (
                                <div key={m.id} className={`w-5 h-5 rounded-full ${m.color} flex items-center justify-center text-white font-bold border border-white`} style={{ fontSize: '8px' }} title={m.name}>
                                  {m.avatar}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
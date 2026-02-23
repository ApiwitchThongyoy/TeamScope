import { useState, useRef } from 'react';
import type { Task, TaskMember, TaskAttachment } from '../Board/types';

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

interface Props {
  task: Task;
  columnTitle: string;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onToggleDone: (taskId: string, isDone: boolean) => void;
}

const MOCK_MEMBERS: TaskMember[] = [
  { id: '1', name: 'Del Kung', avatar: 'D', color: 'bg-purple-500' },
  { id: '2', name: 'Somchai Thai', avatar: 'S', color: 'bg-blue-500' },
  { id: '3', name: 'Malee Jaidee', avatar: 'M', color: 'bg-green-500' },
  { id: '4', name: 'Pattara Dee', avatar: 'P', color: 'bg-orange-500' },
  { id: '5', name: 'Niran Suwan', avatar: 'N', color: 'bg-red-500' },
];

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return 'fi-rr-picture';
  if (type.includes('pdf')) return 'fi-rr-file-pdf';
  if (type.includes('word') || type.includes('document')) return 'fi-rr-file-word';
  if (type.includes('sheet') || type.includes('excel')) return 'fi-rr-file-spreadsheet';
  return 'fi-rr-document';
};

export default function CardModal({ task, columnTitle, onClose, onUpdateTask, onToggleDone }: Props) {
  const [description, setDescription] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.content);
  const [isDone, setIsDone] = useState(task.isDone ?? false);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(task.startDate ?? '');
  const [startTime, setStartTime] = useState(task.startTime ?? '');
  const [endDate, setEndDate] = useState(task.endDate ?? '');
  const [endTime, setEndTime] = useState(task.endTime ?? '');

  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [assignedMembers, setAssignedMembers] = useState<TaskMember[]>(task.members ?? []);
  const [attachedFiles, setAttachedFiles] = useState<TaskAttachment[]>(task.attachments ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveTitle = () => {
    if (titleValue.trim()) onUpdateTask(task.id, { content: titleValue });
    setIsEditingTitle(false);
  };

  const handleToggleDone = () => {
    const newVal = !isDone;
    setIsDone(newVal);
    onToggleDone(task.id, newVal);
  };

  const handleSaveDate = () => {
    onUpdateTask(task.id, { startDate, startTime, endDate, endTime });
    setShowDatePicker(false);
  };

  const handleClearDate = () => {
    setStartDate(''); setStartTime(''); setEndDate(''); setEndTime('');
    onUpdateTask(task.id, { startDate: '', startTime: '', endDate: '', endTime: '' });
    setShowDatePicker(false);
  };

  const toggleMember = (member: TaskMember) => {
    const newMembers = assignedMembers.find(m => m.id === member.id)
      ? assignedMembers.filter(m => m.id !== member.id)
      : [...assignedMembers, member];
    setAssignedMembers(newMembers);
    onUpdateTask(task.id, { members: newMembers });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now().toString(),
      author: 'คุณ',
      text: commentText,
      createdAt: new Date(),
    }]);
    setCommentText('');
  };

  const formatTime = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'เมื่อกี้';
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่ผ่านมา`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่ผ่านมา`;
    return date.toLocaleDateString('th-TH');
  };

  const formatDate = (date: string, time?: string) => {
    if (!date) return '';
    const d = new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    return time ? `${d} ${time}` : d;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: TaskAttachment[] = Array.from(files).map(f => ({
      id: Date.now().toString() + Math.random(),
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      fileType: f.type,
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    }));
    const updated = [...attachedFiles, ...newFiles];
    setAttachedFiles(updated);
    onUpdateTask(task.id, { attachments: updated });
    setShowAddMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteFile = (fileId: string) => {
    const updated = attachedFiles.filter(f => f.id !== fileId);
    setAttachedFiles(updated);
    onUpdateTask(task.id, { attachments: updated });
  };

  const filteredMembers = MOCK_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const closeAllDropdowns = () => {
    setShowAddMenu(false);
    setShowDatePicker(false);
    setShowMemberPicker(false);
  };

  const hasDate = startDate || endDate;

  return (
    <div className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center p-4" onClick={onClose}>
      {(showAddMenu || showDatePicker || showMemberPicker) && (
        <div className="fixed inset-0 z-61" onClick={(e) => { e.stopPropagation(); closeAllDropdowns(); }} />
      )}

      <div className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col relative z-62" onClick={(e) => e.stopPropagation()}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{columnTitle}</span>
            <i className="fi fi-rr-angle-small-down text-xs"></i>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer">
              <i className="fi fi-rr-picture text-gray-500 text-lg"></i>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer">
              <i className="fi fi-br-menu-dots text-gray-500 text-lg"></i>
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer">
              <i className="fi fi-rr-cross text-gray-500 text-lg"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left */}
          <div className="flex-1 overflow-y-auto px-8 py-6 min-w-0">

            {/* Title */}
            <div className="flex items-start gap-3 mb-5">
              <button onClick={handleToggleDone} className="mt-1 shrink-0 cursor-pointer">
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                    <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-green-400 transition" />
                )}
              </button>
              {isEditingTitle ? (
                <input type="text" value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') { setTitleValue(task.content); setIsEditingTitle(false); }
                  }}
                  className="text-xl font-bold w-full focus:outline-none border-b-2 border-blue-500" autoFocus />
              ) : (
                <h2 onClick={() => setIsEditingTitle(true)}
                  className="text-xl font-bold cursor-pointer hover:bg-gray-100 px-1 rounded transition w-full wrap-break-words">
                  {titleValue}
                </h2>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mb-5 ml-9">

              {/* เพิ่ม */}
              <div className="relative">
                <button onClick={() => { closeAllDropdowns(); setShowAddMenu(p => !p); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition cursor-pointer">
                  <i className="fi fi-rr-plus text-xs"></i><span>เพิ่ม</span>
                </button>
                {showAddMenu && (
                  <div className="absolute top-9 left-0 bg-white border rounded-xl shadow-lg z-63 w-40 py-1">
                    <button onClick={() => fileInputRef.current?.click()}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                      <i className="fi fi-rr-clip text-gray-500"></i><span>แนบไฟล์</span>
                    </button>
                    <button onClick={() => { closeAllDropdowns(); setShowDatePicker(true); }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                      <i className="fi fi-rr-calendar text-gray-500"></i><span>ลงวันที่</span>
                    </button>
                    <button onClick={() => { closeAllDropdowns(); setShowMemberPicker(true); }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                      <i className="fi fi-rr-user text-gray-500"></i><span>สมาชิก</span>
                    </button>
                  </div>
                )}
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
              </div>

              {/* วันที่ */}
              <div className="relative">
                <button onClick={() => { closeAllDropdowns(); setShowDatePicker(p => !p); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition cursor-pointer ${hasDate ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <i className="fi fi-rr-clock text-xs"></i>
                  <span>{hasDate ? `${formatDate(startDate, startTime)}${endDate ? ` → ${formatDate(endDate, endTime)}` : ''}` : 'ลงวันที่'}</span>
                </button>
                {showDatePicker && (
                  <div className="absolute top-9 left-0 bg-white border rounded-xl shadow-lg z-63 p-3 w-64">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-700">กำหนดวันที่และเวลา</p>
                      <button onClick={() => setShowDatePicker(false)} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                        <i className="fi fi-rr-cross text-gray-400 text-xs"></i>
                      </button>
                    </div>
                    <div className="mb-3">
                      <label className="text-xs text-gray-500 mb-1 block">วันเริ่มต้น</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-500 mb-1" />
                      <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="mb-3">
                      <label className="text-xs text-gray-500 mb-1 block">วันสิ้นสุด</label>
                      <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-500 mb-1" />
                      <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSaveDate} className="flex-1 bg-blue-500 text-white py-1 rounded-lg text-sm hover:bg-blue-600">บันทึก</button>
                      <button onClick={handleClearDate} className="px-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">ล้าง</button>
                    </div>
                  </div>
                )}
              </div>

              {/* สมาชิก */}
              <div className="relative">
                <button onClick={() => { closeAllDropdowns(); setShowMemberPicker(p => !p); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition cursor-pointer ${assignedMembers.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  {assignedMembers.length > 0 ? (
                    <div className="flex -space-x-1">
                      {assignedMembers.slice(0, 3).map(m => (
                        <div key={m.id} className={`w-5 h-5 rounded-full ${m.color} flex items-center justify-center text-white text-xs font-bold border border-white`}>{m.avatar}</div>
                      ))}
                    </div>
                  ) : <i className="fi fi-rr-user text-xs"></i>}
                  <span>สมาชิก{assignedMembers.length > 0 ? ` (${assignedMembers.length})` : ''}</span>
                </button>
                {showMemberPicker && (
                  <div className="absolute top-9 left-0 bg-white border rounded-xl shadow-lg z-63 w-60 pb-2">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-700">มอบหมายสมาชิก</p>
                      <button onClick={() => setShowMemberPicker(false)} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                        <i className="fi fi-rr-cross text-gray-400 text-xs"></i>
                      </button>
                    </div>
                    <div className="px-3 pt-2 pb-1">
                      <input type="text" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)}
                        placeholder="ค้นหาชื่อ..."
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" autoFocus />
                    </div>
                    <div className="max-h-44 overflow-y-auto">
                      {filteredMembers.length === 0
                        ? <p className="text-sm text-gray-400 text-center py-3">ไม่พบสมาชิก</p>
                        : filteredMembers.map(member => {
                          const isAssigned = assignedMembers.some(m => m.id === member.id);
                          return (
                            <button key={member.id} onClick={() => toggleMember(member)}
                              className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition text-left ${isAssigned ? 'bg-blue-50' : ''}`}>
                              <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>{member.avatar}</div>
                              <span className="text-sm flex-1">{member.name}</span>
                              {isAssigned && (
                                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                  <i className="fi fi-rr-check text-white" style={{ fontSize: '8px' }}></i>
                                </div>
                              )}
                            </button>
                          );
                        })}
                    </div>
                    {assignedMembers.length > 0 && (
                      <div className="px-3 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1.5">ที่เลือกไว้</p>
                        <div className="flex flex-wrap gap-1">
                          {assignedMembers.map(m => (
                            <div key={m.id} className="flex items-center gap-1 bg-gray-100 rounded-full px-1.5 py-0.5">
                              <div className={`w-3.5 h-3.5 rounded-full ${m.color} flex items-center justify-center text-white font-bold`} style={{ fontSize: '8px' }}>{m.avatar}</div>
                              <span className="text-xs">{m.name.split(' ')[0]}</span>
                              <button onClick={() => toggleMember(m)} className="text-gray-400 hover:text-red-500">
                                <i className="fi fi-rr-cross-small text-xs"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ผู้รับผิดชอบ */}
            {assignedMembers.length > 0 && (
              <div className="ml-9 mb-4">
                <p className="text-xs text-gray-500 mb-1.5">ผู้รับผิดชอบ</p>
                <div className="flex flex-wrap gap-1.5">
                  {assignedMembers.map(m => (
                    <div key={m.id} className="flex items-center gap-1.5 bg-gray-100 rounded-full px-2 py-1">
                      <div className={`w-5 h-5 rounded-full ${m.color} flex items-center justify-center text-white text-xs font-bold`}>{m.avatar}</div>
                      <span className="text-xs">{m.name}</span>
                      <button onClick={() => toggleMember(m)} className="text-gray-400 hover:text-red-500 ml-0.5">
                        <i className="fi fi-rr-cross-small text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ไฟล์แนบ */}
            {attachedFiles.length > 0 && (
              <div className="ml-9 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fi fi-rr-clip text-gray-500 text-sm"></i>
                  <span className="font-semibold text-gray-700 text-sm">ไฟล์แนบ</span>
                </div>
                <div className="space-y-2">
                  {attachedFiles.map(file => (
                    <div key={file.id} className="flex items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <div className="w-20 h-14 shrink-0 bg-gray-200 flex items-center justify-center overflow-hidden">
                        {file.previewUrl
                          ? <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
                          : <i className={`fi ${getFileIcon(file.fileType)} text-gray-400 text-2xl`}></i>
                        }
                      </div>
                      <div className="flex-1 min-w-0 px-3 py-2">
                        <p className="text-sm font-medium truncate text-gray-700">{file.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{file.size}</p>
                        <div className="flex gap-2 mt-1">
                          <button className="text-xs text-blue-500 hover:underline">ดาวน์โหลด</button>
                          <span className="text-gray-300">•</span>
                          <button onClick={() => handleDeleteFile(file.id)} className="text-xs text-red-400 hover:underline">ลบ</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* คำอธิบาย */}
            <div className="ml-9 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <i className="fi fi-rr-align-left text-gray-500 text-sm"></i>
                <span className="font-semibold text-gray-700 text-sm">คำอธิบาย</span>
              </div>
              {isEditingDesc ? (
                <div>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="เพิ่มคำอธิบายโดยละเอียด..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 resize-none text-sm"
                    rows={3} autoFocus />
                  <div className="flex gap-2 mt-1.5">
                    <button onClick={() => setIsEditingDesc(false)} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">บันทึก</button>
                    <button onClick={() => setIsEditingDesc(false)} className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">ยกเลิก</button>
                  </div>
                </div>
              ) : (
                <div onClick={() => setIsEditingDesc(true)}
                  className={`w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm cursor-pointer transition min-h-12 wrap-break-words whitespace-pre-wrap ${description ? 'text-gray-700' : 'text-gray-400'}`}>
                  {description || 'เพิ่มคำอธิบายโดยละเอียด...'}
                </div>
              )}
            </div>
          </div>

          {/* Right — comments */}
          <div className="w-80 border-l border-gray-100 flex flex-col shrink-0">
            <div className="px-5 py-5 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <i className="fi fi-rr-comment text-gray-500 text-sm"></i>
                  <span className="font-semibold text-gray-700 text-sm">ความคิดเห็นและกิจกรรม</span>
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 bg-gray-100 rounded-lg cursor-pointer">ซ่อนรายละเอียด</button>
              </div>
              <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                placeholder="เขียนความคิดเห็น..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 mb-4 shrink-0" />
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{comment.author.charAt(0)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{comment.author}</span>
                        <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 break-all overflow-hidden w-full">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
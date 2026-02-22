import { useState } from 'react';
import type { Task } from '../Board/types';

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
  onUpdateContent: (taskId: string, newContent: string) => void;
}

export default function CardModal({ task, columnTitle, onClose, onUpdateContent }: Props) {
  const [description, setDescription] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.content);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveTitle = () => {
    if (titleValue.trim()) {
      onUpdateContent(task.id, titleValue);
    }
    setIsEditingTitle(false);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        author: 'คุณ',
        text: commentText,
        createdAt: new Date(),
      },
    ]);
    setCommentText('');
  };

  const formatTime = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'เมื่อกี้';
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่ผ่านมา`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่ผ่านมา`;
    return date.toLocaleDateString('th-TH');
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
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
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            >
              <i className="fi fi-rr-cross text-gray-500 text-lg"></i>
            </button>
          </div>
        </div>

        <div className="flex gap-0">
          
          <div className="flex-1 px-6 py-5">
            
            <div className="flex items-start gap-3 mb-6">
              <button className="mt-1 text-gray-400 hover:text-gray-600 transition shrink-0">
                <i className="fi fi-rr-circle text-xl"></i>
              </button>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') { setTitleValue(task.content); setIsEditingTitle(false); }
                  }}
                  className="text-2xl font-bold w-full focus:outline-none border-b-2 border-blue-500"
                  autoFocus
                />
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className="text-2xl font-bold cursor-pointer hover:bg-gray-100 px-1 rounded transition w-full"
                >
                  {titleValue}
                </h2>
              )}
            </div>

            
            <div className="flex flex-wrap gap-2 mb-6 ml-8">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition cursor-pointer">
                <i className="fi fi-rr-plus text-xs"></i>
                <span>เพิ่ม</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(prev => !prev)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition cursor-pointer"
                >
                  <i className="fi fi-rr-clock text-xs"></i>
                  <span>{dueDate ? dueDate : 'ลงวันที่'}</span>
                </button>
                {showDatePicker && (
                  <div className="absolute top-10 left-0 bg-white border rounded-xl shadow-lg p-3 z-10">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => { setDueDate(e.target.value); setShowDatePicker(false); }}
                      className="focus:outline-none text-sm"
                    />
                  </div>
                )}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition cursor-pointer">
                <i className="fi fi-rr-user text-xs"></i>
                <span>สมาชิก</span>
              </button>
            </div>

          
            <div className="ml-8 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <i className="fi fi-rr-align-left text-gray-500"></i>
                <span className="font-semibold text-gray-700">คำอธิบาย</span>
              </div>

              {isEditingDesc ? (
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="เพิ่มคำอธิบายโดยละเอียด..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 resize-none text-sm"
                    rows={4}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setIsEditingDesc(false)}
                      className="px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                    >
                      บันทึก
                    </button>
                    <button
                      onClick={() => setIsEditingDesc(false)}
                      className="px-4 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingDesc(true)}
                  className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-400 cursor-pointer transition min-h-16"
                >
                  {description || 'เพิ่มคำอธิบายโดยละเอียด...'}
                </div>
              )}
            </div>
          </div>

        
          <div className="w-72 border-l border-gray-100 px-5 py-5 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <i className="fi fi-rr-comment text-gray-500"></i>
                <span className="font-semibold text-gray-700">ความคิดเห็นและกิจกรรม</span>
              </div>
              <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 bg-gray-100 rounded-lg transition cursor-pointer">
                ซ่อนรายละเอียด
              </button>
            </div>

           
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddComment();
              }}
              placeholder="เขียนความคิดเห็น..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 mb-4"
            />

           
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {comment.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{comment.author}</span>
                      <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
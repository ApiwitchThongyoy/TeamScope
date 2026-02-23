import { useEffect, useState } from 'react';

type Privacy = 'private' | 'public';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  privacy: Privacy;
  onChangePrivacy: (p: Privacy) => void;
}

export default function PrivacyPanel({ isOpen, onClose, privacy, onChangePrivacy }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) setTimeout(() => setMounted(true), 10);
    else setMounted(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-70 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-88 bg-white shadow-2xl z-71 flex flex-col transition-transform duration-300 ease-out ${mounted ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '360px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">การมองเห็น Board</h2>
            <p className="text-xs text-gray-400 mt-0.5">ตั้งค่าว่าใครสามารถเห็น board นี้ได้</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
            <i className="fi fi-rr-cross text-gray-500"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

          {/* Private */}
          <button
            onClick={() => onChangePrivacy('private')}
            className={`w-full text-left rounded-2xl border-2 p-5 transition cursor-pointer ${
              privacy === 'private'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-100 bg-gray-50 hover:border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${privacy === 'private' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                <i className={`fi fi-rr-lock text-xl ${privacy === 'private' ? 'text-white' : 'text-gray-500'}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-800">Private</p>
                  {privacy === 'private' && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">เฉพาะคุณและสมาชิกในทีมเท่านั้นที่จะเห็นและแก้ไข board นี้ได้</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className="fi fi-rr-check text-green-500"></i>
                    <span>คุณและทีมเห็น board ได้</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className="fi fi-rr-check text-green-500"></i>
                    <span>คุณและทีมแก้ไขได้</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <i className="fi fi-rr-cross text-red-400"></i>
                    <span>บุคคลภายนอกไม่สามารถเห็นได้</span>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Public */}
          <button
            onClick={() => onChangePrivacy('public')}
            className={`w-full text-left rounded-2xl border-2 p-5 transition cursor-pointer ${
              privacy === 'public'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-100 bg-gray-50 hover:border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${privacy === 'public' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                <i className={`fi fi-rr-globe text-xl ${privacy === 'public' ? 'text-white' : 'text-gray-500'}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-800">Public</p>
                  {privacy === 'public' && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">ทุกคนสามารถเห็น board นี้ได้ แต่แก้ไขได้เฉพาะคุณและทีมเท่านั้น</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className="fi fi-rr-check text-green-500"></i>
                    <span>ทุกคนเห็น board ได้</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className="fi fi-rr-check text-green-500"></i>
                    <span>คุณและทีมแก้ไขได้</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <i className="fi fi-rr-cross text-red-400"></i>
                    <span>บุคคลภายนอกแก้ไขไม่ได้</span>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Current status badge */}
          <div className={`rounded-2xl p-4 flex items-center gap-3 ${privacy === 'private' ? 'bg-gray-100' : 'bg-green-50'}`}>
            <i className={`fi ${privacy === 'private' ? 'fi-rr-lock text-gray-500' : 'fi-rr-globe text-green-500'} text-lg`}></i>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                สถานะปัจจุบัน: <span className={privacy === 'private' ? 'text-gray-800' : 'text-green-600'}>{privacy === 'private' ? 'Private' : 'Public'}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {privacy === 'private'
                  ? 'เฉพาะสมาชิกในทีมเท่านั้นที่มองเห็น'
                  : 'ทุกคนสามารถเห็น board นี้ได้'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
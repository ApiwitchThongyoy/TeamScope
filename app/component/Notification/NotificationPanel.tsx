'use client';

import { useState } from 'react';

interface Notification {
  id: string;
  type: 'team_invite' | 'task_assigned' | 'comment' | 'deadline' | 'mention';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  boardName?: string;
  sender?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'team_invite',
      title: 'คำเชิญเข้าร่วมทีม',
      message: 'สมชาย เชิญคุณเข้าร่วมบอร์ด "โปรเจค A"',
      time: '5 นาทีที่แล้ว',
      isRead: false,
      boardName: 'โปรเจค A',
      sender: 'สมชาย'
    },
    {
      id: '2',
      type: 'task_assigned',
      title: 'มอบหมายงาน',
      message: 'คุณได้รับมอบหมายงาน "ออกแบบ UI" ในบอร์ด "Design Sprint"',
      time: '2 ชั่วโมงที่แล้ว',
      isRead: false,
      boardName: 'Design Sprint'
    },
    {
      id: '3',
      type: 'comment',
      title: 'ความคิดเห็นใหม่',
      message: 'สมศรี แสดงความคิดเห็นในการ์ด "Review Code"',
      time: '1 วันที่แล้ว',
      isRead: true,
      sender: 'สมศรี'
    },
    {
      id: '4',
      type: 'deadline',
      title: 'ใกล้ถึงกำหนด',
      message: 'งาน "เขียน Documentation" ครบกำหนด 2 วันนี้',
      time: '1 วันที่แล้ว',
      isRead: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'team_invite':
        return 'fi-rr-user-add';
      case 'task_assigned':
        return 'fi-rr-document';
      case 'comment':
        return 'fi-rr-comment';
      case 'deadline':
        return 'fi-rr-clock';
      case 'mention':
        return 'fi-rr-at';
      default:
        return 'fi-rr-bell';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'team_invite':
        return 'bg-blue-50 border-blue-200';
      case 'task_assigned':
        return 'bg-green-50 border-green-200';
      case 'comment':
        return 'bg-purple-50 border-purple-200';
      case 'deadline':
        return 'bg-orange-50 border-orange-200';
      case 'mention':
        return 'bg-pink-50 border-pink-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'team_invite':
        return 'text-blue-500';
      case 'task_assigned':
        return 'text-green-500';
      case 'comment':
        return 'text-purple-500';
      case 'deadline':
        return 'text-orange-500';
      case 'mention':
        return 'text-pink-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div className="fixed top-16 right-4 w-96 max-h-[calc(100vh-5rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <i className="fi fi-sr-bell"></i>
              การแจ้งเตือน
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition cursor-pointer"
            >
              <i className="fi fi-rr-cross text-lg"></i>
            </button>
          </div>

          {notifications.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleMarkAllAsRead}
                className="flex-1 text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition cursor-pointer"
              >
                อ่านทั้งหมด
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition cursor-pointer"
              >
                ลบทั้งหมด
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="fi fi-rr-bell-slash text-4xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 text-center font-medium mb-1">
                ไม่มีการแจ้งเตือนในตอนนี้
              </p>
              <p className="text-gray-400 text-sm text-center">
                เมื่อมีกิจกรรมใหม่ จะแสดงที่นี่
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition relative ${
                    !notification.isRead ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {/* Unread Indicator */}
                  {!notification.isRead && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                  )}

                  <div className="flex gap-3 pl-2">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full ${getNotificationColor(notification.type)} border flex items-center justify-center flex-shrink-0`}>
                      <i className={`fi ${getNotificationIcon(notification.type)} ${getIconColor(notification.type)}`}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">
                          {notification.title}
                        </h4>
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="opacity-0 group-hover:opacity-100 hover:bg-red-100 p-1 rounded transition flex-shrink-0"
                        >
                          <i className="fi fi-rr-trash text-xs text-red-500"></i>
                        </button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>

                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                          >
                            ทำเครื่องหมายว่าอ่านแล้ว
                          </button>
                        )}
                      </div>

                      {/* Action Buttons for Team Invite */}
                      {notification.type === 'team_invite' && !notification.isRead && (
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition cursor-pointer">
                            ยอมรับ
                          </button>
                          <button className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition cursor-pointer">
                            ปฏิเสธ
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 cursor-pointer">
              ดูการแจ้งเตือนทั้งหมด
            </button>
          </div>
        )}
      </div>
    </>
  );
}
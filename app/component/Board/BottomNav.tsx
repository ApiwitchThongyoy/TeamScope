export default function BottomNav() {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-8 py-4 shadow-lg flex items-center gap-8 z-50">
      <button className="text-lg hover:text-blue-500 transition cursor-pointer">บอร์ด</button>
      <button className="text-lg hover:text-blue-500 transition cursor-pointer">ส่วนร่วม</button>
      <button className="text-lg hover:text-blue-500 transition cursor-pointer">สลับบอร์ด</button>
    </div>
  );
  
}
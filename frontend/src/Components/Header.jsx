const Header = () => (
  <header className="bg-gray-900 text-gray-100 px-4 py-2 flex flex-col">
    <div className="flex justify-between items-center text-xs">
      <span>Welcome, User | <span className="text-yellow-400 cursor-pointer">Logout</span></span>
      <span>Last login: 05 November, Wednesday, 2025</span>
    </div>
    <nav className="mt-2 flex flex-wrap gap-2">
      {['Dashboard','Home','Manage Account','Projects List','Leave Management','Tracker','My FTP','Ticket','Purchase Requests'].map((item) => (
        <button key={item} className="bg-gray-800 px-3 py-1 rounded text-xs border border-gray-700 hover:bg-gray-700">{item}</button>
      ))}
    </nav>
  </header>
);

export default Header;

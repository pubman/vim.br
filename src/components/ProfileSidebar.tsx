import { config } from "../config";

interface ProfileSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ProfileSidebar({ isOpen, onToggle }: ProfileSidebarProps) {
  const menuItems = [
    { icon: '⚡', label: 'Practice', active: true },
    { icon: '👤', label: 'Profile' },
    { icon: '❓', label: 'Help' },
    { icon: '🏆', label: 'High Scores' },
    { icon: '👥', label: 'Multiplayer' },
    { icon: '⌨️', label: 'Typing Test' },
    { icon: '🎯', label: 'Layouts' },
  ];



  return (
    <>
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full bg-dark-800 border-r border-dark-600 transition-transform duration-300 z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-50`}>
        {/* Profile header */}
        <div className="p-6 border-b border-dark-600">
          <div className="flex flex-col w-full justify-center items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-vim-normal to-vim-insert rounded-full flex flex-col items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h3 className="text-dark-100 font-semibold">pubman</h3>
              <p className="text-dark-400 text-sm">Level 15</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${item.active
                    ? 'bg-vim-normal text-white'
                    : 'text-dark-300 hover:bg-dark-700 hover:text-dark-100'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer links */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-dark-500 space-y-1">
            <p>{config.email}</p>
            <p>Discord • GitHub</p>
            <p>Terms of Service • Privacy Policy</p>
            <p>English</p>
          </div>
        </div>
      </div>
    </>
  );
}

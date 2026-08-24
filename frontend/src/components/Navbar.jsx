import { Bell, User } from "lucide-react";

function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Dashboard
        </h2>
        <p className="text-xs text-slate-500">
          Monitor your AI-powered revenue recovery
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-slate-500 hover:text-slate-800">
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center">
            <User size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800">
              Admin
            </p>
            <p className="text-xs text-slate-500">
              Merchant
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
// import {
//   LayoutDashboard,
//   CreditCard,
//   RotateCcw,
//   Bot,
//   ShieldCheck,
//   Settings,
// } from "lucide-react";

// const menuItems = [
//   { name: "Dashboard", icon: LayoutDashboard },
//   { name: "Payments", icon: CreditCard },
//   { name: "Recoveries", icon: RotateCcw },
//   { name: "AI Decisions", icon: Bot },
//   { name: "Approvals", icon: ShieldCheck },
//   { name: "Settings", icon: Settings },
// ];

// function Sidebar() {
//   return (
//     <aside className="w-64 min-h-screen bg-slate-950 text-white fixed left-0 top-0">
//       <div className="px-6 py-6 border-b border-slate-800">
//         <h1 className="text-xl font-bold">RevenueAI</h1>
//         <p className="text-xs text-slate-400 mt-1">
//           AI Revenue Recovery
//         </p>
//       </div>

//       <nav className="p-4 space-y-2">
//         {menuItems.map((item) => {
//           const Icon = item.icon;

//           return (
//             <button
//               key={item.name}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
//                 ${
//                   item.name === "Dashboard"
//                     ? "bg-slate-800 text-white"
//                     : "text-slate-400 hover:bg-slate-900 hover:text-white"
//                 }`}
//             >
//               <Icon size={19} />
//               <span>{item.name}</span>
//             </button>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }

// export default Sidebar;

import {
  LayoutDashboard,
  CreditCard,
  RotateCcw,
  Bot,
  ShieldCheck,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Payments",
    path: "/payments",
    icon: CreditCard,
  },
  {
    name: "Recoveries",
    path: "/recoveries",
    icon: RotateCcw,
  },
  {
    name: "AI Decisions",
    path: "/ai-decisions",
    icon: Bot,
  },
  {
    name: "Approvals",
    path: "/approvals",
    icon: ShieldCheck,
  },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-64 min-h-screen bg-slate-950 text-white">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-800">
        <h1 className="text-xl font-bold">
          RevenueAI
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          AI Revenue Recovery
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-white text-slate-950"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={19} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-5 left-4 right-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:bg-slate-900 hover:text-white">
          <Settings size={19} />
          Settings
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
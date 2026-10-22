import { Link, NavLink } from "react-router";
import {
  LayoutDashboard, Users, Map, PanelLeftClose, PanelLeftOpen, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  {
    name: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "All Users",
    to: "/admin/all-users",
    icon: Users,
  },
  {
    name: "AI Trips",
    to: "/admin/trips",
    icon: Map,
  },
];

const AdminNavbar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed, }) => {
  const { user, logout } = useAuth()
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-dvh flex-col
          border-r border-gray-200 bg-white
          transition-all duration-300 ease-in-out
          md:sticky md:top-0 md:z-20 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "md:w-[72px]" : "w-64 md:w-64"}
        `}
      >
        {/* Logo and controls */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-gray-200 px-3 ${isCollapsed ? "md:justify-center" : "justify-between"
            }`}
        >
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            title="Tourvisto home"
            className="flex min-w-0 items-center gap-2"
          >
            <img
              src="/icons/logo.svg"
              alt="Tourvisto logo"
              className="h-8 w-8 shrink-0"
            />

            <span
              className={`overflow-hidden whitespace-nowrap text-xl font-extrabold transition-all ${isCollapsed ? "md:hidden" : ""
                }`}
            >
              Tourvisto
            </span>
          </Link>

          {/* Desktop collapse button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:inline-flex ${isCollapsed ? "md:hidden" : ""
              }`}
          >
            <PanelLeftClose size={20} />
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
          {navLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${isCollapsed ? "md:justify-center md:px-0" : ""
                  } ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={21}
                      strokeWidth={1.8}
                      className="shrink-0"
                    />

                    <span
                      className={`whitespace-nowrap text-sm font-medium ${isCollapsed ? "md:hidden" : ""
                        }`}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-5 flex items-center gap-3">
          <img src={user?.avatar} alt="" className="h-8 w-8 rounded-full" />
          <div className="">
            <p className="leading-none">{user.name}</p>
            <p className="leading-none text-xs">{user.email}</p>
          </div>
          <button onClick={logout} className="cursor-pointer"><img src="/icons/logout.svg" alt="logout" /></button>
        </div>

        {/* Expand control in collapsed desktop mode */}
        {isCollapsed && (
          <div className="hidden border-t border-gray-200 p-3 md:block">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="flex w-full justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              <PanelLeftOpen size={21} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default AdminNavbar;
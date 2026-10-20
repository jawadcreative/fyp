
import { Link, NavLink } from "react-router";

const AdminNavbar = () => {
  const navLinks = [
    { name: "Dashboard", to: "/admin/dashboard", icon: "/icons/home.svg" },
    { name: "All Users", to: "/admin/all-users", icon: "/icons/users.svg" },
    { name: "AI Trips", to: "/admin/trips", icon: "/icons/itinerary.svg" },
  ];

  return (
    <div className="p-6">
      <Link
        to="/"
        className="flex items-center gap-2 border-b border-[#dadada] pb-6"
      >
        <img src="/icons/logo.svg" alt="Tourvisto logo" />
        <h1 className="text-2xl font-extrabold">Tourvisto</h1>
      </Link>

      <nav className="flex flex-col gap-4 py-6">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-lg p-4 transition-colors ${isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={item.icon}
                  alt=""
                  className={`h-5 w-5 ${isActive ? "invert" : ""}`}
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminNavbar;
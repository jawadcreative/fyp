import { Outlet, Navigate, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import AdminNavbar from "../../components/AdminNavbar";

const AdminLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login', { replace: true })
        }
    })

    if (loading || !user) {
        return <p>Loading...</p>;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            <AdminNavbar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                {/* Top bar */}
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-3 sm:px-5">
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        aria-label="Open sidebar"
                        title="Open sidebar"
                        className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
                    >
                        <Menu size={22} />
                    </button>

                    <span className="text-sm font-semibold text-gray-800">
                        Admin Panel
                    </span>
                </header>

                {/* Page content */}
                <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
import { Outlet, Navigate, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminTop from "../../components/AdminTop";

const AdminLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate()
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
        <main className="flex gap-8">
            <aside className="h-256 w-60 border-r border-[#dadada]">
                <AdminNavbar />
            </aside>
            <aside className="h-screen w-[80%] p-6">
                <Outlet />
            </aside>
        </main>
    );
};

export default AdminLayout;
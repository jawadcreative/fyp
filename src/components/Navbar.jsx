import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Navbar = () => {
    const { user, loading, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // Set initial state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
    
    if (loading) return <p>Loading...</p>;

    return (
        <nav className={`flex items-center justify-between px-6 py-5 fixed z-50 top-0 left-0 w-full ${scrolled ? 'bg-black transition-all duration-1000' : 'bg-transparent transition-all duration-1000'}`}>
            <Link to={'/'} className="flex items-center gap-2">
                <img src="/icons/logo.svg" alt="logo" className="max-sm:h-6" />
                <p className={`font-extrabold text-sm md:text-xl ${scrolled && 'text-white'}`}>Tourvisto</p>
            </Link>
            {user ? (
                <div className="flex items-center gap-3 md:gap-6">
                    {user.role == 'admin' && (
                        <Link to={'/admin/dashboard'} className="text-white max-md:text-xs">Admin Panel</Link>
                    )}
                    <img className="h-4 w-4 md:h-8 md:w-8 rounded-full bg-white object-cover object-center" src={user?.avatar} alt="" />
                    <button onClick={logout} className="p-2 bg-gray-100 rounded-md cursor-pointer"><img src="/icons/logout.svg" alt="logout" className="h-2 md:h-4" /></button>
                </div>
            ) : (
                <span>Please log in</span>
            )}
        </nav>
    );
};

export default Navbar;
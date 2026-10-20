import { Link, useLocation } from "react-router"

const AdminTop = ({ title, des, btn, to }) => {
    const location = useLocation()
    const isDisabled = location.pathname === "/admin/trips/create" || /^\/admin\/trips\/[^/]+$/.test(location.pathname);
    return (
        <div className="h-[10vh] w-full flex items-start justify-between">
            <div className="">
                <h1 className="text-xl font-extrabold">{title}</h1>
                <p className="text-xs">{des}</p>
            </div>
            <Link
                to={isDisabled ? "#" : to}
                onClick={(e) => {
                    if (isDisabled) {
                        e.preventDefault();
                    }
                }}
                aria-disabled={isDisabled}
                className={`flex items-center justify-center gap-3 rounded-lg bg-blue-600 px-8 py-2 text-white ${isDisabled
                    ? "opacity-10 cursor-not-allowed pointer-events-none"
                    : "cursor-pointer"
                    }`}
            >
                <span>
                    <img src="/icons/plus.svg" alt="" />
                </span>
                {btn}
            </Link>
        </div>
    )
}

export default AdminTop
import { Link, useLocation } from "react-router";

const AdminTop = ({ title, des, btn, to }) => {
  const location = useLocation();

  const isDisabled =
    location.pathname === "/admin/trips/create" ||
    /^\/admin\/trips\/[^/]+$/.test(location.pathname);

  return (
    <div className="flex w-full flex-col gap-4 pb-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Title and Description */}
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-extrabold leading-tight sm:text-2xl lg:text-3xl">
          {title}
        </h1>

        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
          {des}
        </p>
      </div>

      {/* Action Button */}
      <Link
        to={isDisabled ? "#" : to}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
          }
        }}
        aria-disabled={isDisabled}
        className={`inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors sm:w-auto sm:px-5 lg:px-6 ${
          isDisabled
            ? "pointer-events-none cursor-not-allowed bg-blue-600 opacity-40"
            : "cursor-pointer bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        }`}
      >
        <img
          src="/icons/plus.svg"
          alt=""
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
        />

        <span className="whitespace-nowrap">{btn}</span>
      </Link>
    </div>
  );
};

export default AdminTop;
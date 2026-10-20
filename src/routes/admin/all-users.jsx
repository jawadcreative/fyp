import { useEffect, useState } from "react";
import AdminTop from "../../components/AdminTop";
import { useAuth } from "../../context/AuthContext";

const PAGE_SIZE = 10;

const AllUsers = () => {
  const { allUsers, refreshAllUsers } = useAuth();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        await refreshAllUsers(page, PAGE_SIZE);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, refreshAllUsers]);

  const users = allUsers?.users ?? [];
  const total = allUsers?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <section className="flex w-full flex-col gap-6">
      <AdminTop
        title="Manage Users"
        des="Filter, sort, and access detailed user profiles"
        btn="Add new user"
        to="/users/create"
      />

      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] border-collapse text-left">
            <thead>
              <tr className="h-12 tracking-wide text-gray-400">
                {['Name', 'Email Address', 'Date Joined', 'Itinerary Created', 'Status', 'Action'].map((item, i) => (
                  <th key={i} className="px-5">{item}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="h-32 text-center text-gray-500"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="h-32 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((item, index) => (
                  <tr
                    key={item.$id}
                    className={`h-[45px] text-gray-700 transition-colors hover:bg-blue-50/60 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                  >
                    <td className="px-5 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-700">
                          {item.avatar ? (
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            (item.name || "U")
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()
                          )}
                        </div>

                        <span className="whitespace-nowrap text-gray-900">
                          {item.name || "Unnamed User"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-2">
                      <span className="whitespace-nowrap">
                        {item.email || "—"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-2">
                      {item.$createdAt
                        ? new Date(item.$createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                        : "—"}
                    </td>

                    <td className="px-5 py-2">
                      {item.itineraryCount ?? "—"}
                    </td>

                    <td className="px-5 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 ${item.role === "admin"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-emerald-50 text-emerald-700"
                          }`}
                      >
                        {item.role || "User"}
                      </span>
                    </td>

                    <td className="px-5 py-2 text-right">
                      <button
                        type="button"
                        title={`Delete ${item.name || "user"}`}
                        onClick={() =>
                          console.log("Delete user:", item.$id)
                        }
                        className="rounded p-1 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <img src="/icons/delete.svg" alt="delete" className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => current - 1)}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {/* <ChevronLeft size={14} /> */}
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  disabled={loading}
                  onClick={() => setPage(pageNumber)}
                  className={`h-7 min-w-7 rounded-md px-2 text-xs transition ${page === pageNumber
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {pageNumber}
                </button>
              ))}
          </div>

          <button
            type="button"
            disabled={page >= totalPages || loading || totalPages === 0}
            onClick={() => setPage((current) => current + 1)}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            {/* <ChevronRight size={14} /> */}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AllUsers;

import { useEffect, useState } from "react";
import { getAllTrips } from "../appwrite/trip";
import { Link, useLocation } from "react-router";
import { MoveLeft, MoveRight, MapPin, LoaderCircle } from "lucide-react";

const Trips = ({ total }) => {
    const location = useLocation();
    const pageSize = 8;

    const [page, setPage] = useState(1);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchTrips = async () => {
            setLoading(true);
            setError("");

            try {
                const result = await getAllTrips(total);

                if (isMounted) {
                    setTrips(Array.isArray(result) ? result : []);
                    setPage(1);
                }
            } catch (err) {
                console.error("Failed to fetch trips:", err);

                if (isMounted) {
                    setError("Unable to load trips. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTrips();

        return () => {
            isMounted = false;
        };
    }, [total]);

    const totalPages = Math.ceil(trips.length / pageSize);
    const start = (page - 1) * pageSize;
    const shownTrips = trips.slice(start, start + pageSize);

    const isAdmin = location.pathname.startsWith("/admin");

    const getTripDetails = (item) => {
        try {
            const details =
                typeof item.tripDetails === "string"
                    ? JSON.parse(item.tripDetails)
                    : item.tripDetails;

            const images =
                typeof item.imageUrls === "string"
                    ? JSON.parse(item.imageUrls)
                    : item.imageUrls;

            return {
                details: details || {},
                images: Array.isArray(images) ? images : [],
            };
        } catch {
            return { details: {}, images: [] };
        }
    };

    const changePage = (newPage) => {
        setPage(Math.max(1, Math.min(newPage, totalPages)));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section className="w-full py-6">
            {/* Loading State */}
            {loading && (
                <div
                    className="flex min-h-[40vh] flex-col items-center justify-center gap-4"
                    role="status"
                    aria-live="polite"
                >
                    <LoaderCircle className="h-10 w-10 animate-spin text-blue-600" />
                    <p className="text-sm font-medium text-gray-500">
                        Loading your trips...
                    </p>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 text-center">
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                        onClick={() => {
                            setLoading(true);
                            setError("");

                            getAllTrips(total)
                                .then((result) => {
                                    setTrips(Array.isArray(result) ? result : []);
                                    setPage(1);
                                })
                                .catch((err) => {
                                    console.error(err);
                                    setError("Unable to load trips. Please try again.");
                                })
                                .finally(() => setLoading(false));
                        }}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && trips.length === 0 && (
                <div className="flex min-h-[30vh] items-center justify-center text-center">
                    <p className="text-gray-500">No trips found.</p>
                </div>
            )}

            {/* Trips Grid */}
            {!loading && !error && trips.length > 0 && (
                <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {shownTrips.map((item) => {
                            const { details, images } = getTripDetails(item);

                            const tripName = details.name || details.country || "Trip";
                            const country = details.country || "Unknown destination";
                            const city =
                                details.location?.city || details.city || "Explore destination";

                            return (
                                <Link
                                    key={item.$id}
                                    to={
                                        isAdmin
                                            ? `/admin/trips/${item.$id}`
                                            : `/trips/${item.$id}`
                                    }
                                    className="group block min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                >
                                    <article className="flex h-full flex-col">
                                        {/* Trip Image */}
                                        <div className="relative h-52 overflow-hidden sm:h-48 lg:h-52">
                                            {images[2] || images[0] ? (
                                                <img
                                                    src={images[2] || images[0]}
                                                    alt={tripName}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                                                    No image available
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        </div>

                                        {/* Trip Information */}
                                        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                                            <h2 className="line-clamp-1 text-xl font-bold text-gray-900 sm:text-2xl">
                                                {country}
                                            </h2>

                                            <p className="flex min-w-0 items-center gap-2 text-sm text-gray-500">
                                                <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
                                                <span className="truncate">{city}</span>
                                            </p>

                                            <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                                                {details.budget && (
                                                    <span className="max-w-full truncate rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800">
                                                        {details.budget}
                                                    </span>
                                                )}

                                                {details.groupType && (
                                                    <span className="max-w-full truncate rounded-full bg-pink-100 px-3 py-1.5 text-xs font-medium text-pink-800">
                                                        {details.groupType}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Responsive Pagination */}
                    {totalPages > 1 && (
                        <nav
                            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-between"
                            aria-label="Trip pagination"
                        >
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => changePage(page - 1)}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-3 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
                            >
                                <MoveLeft size={18} />
                                <span>Previous</span>
                            </button>

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(
                                        (n) =>
                                            n === 1 ||
                                            n === totalPages ||
                                            Math.abs(n - page) <= 1
                                    )
                                    .reduce((result, n, index, array) => {
                                        if (index > 0 && n - array[index - 1] > 1) {
                                            result.push("ellipsis-" + n);
                                        }

                                        result.push(n);
                                        return result;
                                    }, [])
                                    .map((n) =>
                                        typeof n === "string" ? (
                                            <span
                                                key={n}
                                                className="px-1 text-gray-400"
                                                aria-hidden="true"
                                            >
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={n}
                                                type="button"
                                                aria-label={`Go to page ${n}`}
                                                aria-current={page === n ? "page" : undefined}
                                                onClick={() => changePage(n)}
                                                className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${page === n
                                                        ? "bg-blue-600 text-white shadow-sm"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {n}
                                            </button>
                                        )
                                    )}
                            </div>

                            <button
                                type="button"
                                disabled={page === totalPages}
                                onClick={() => changePage(page + 1)}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-3 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
                            >
                                <span>Next</span>
                                <MoveRight size={18} />
                            </button>
                        </nav>
                    )}

                    <p className="mt-4 text-center text-xs text-gray-400">
                        Showing {start + 1}–{Math.min(start + pageSize, trips.length)} of{" "}
                        {trips.length} trips
                    </p>
                </>
            )}
        </section>
    );
};

export default Trips;

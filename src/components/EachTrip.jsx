
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { getTripById } from "../appwrite/trip";

const EachTrip = () => {
    const { id } = useParams();
    const url = useLocation();
    const isDisable = url.pathname === `/admin/trips/${id}`;
    console.log(isDisable);

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getTripById(id);
                setTrip(data);
            } catch (err) {
                setError("Unable to load this trip. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTrip();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen w-full animate-pulse bg-slate-50 p-4 sm:p-6 md:p-12">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="h-10 w-2/3 rounded-lg bg-slate-200" />
                    <div className="h-64 rounded-3xl bg-slate-200 sm:h-80 md:h-96" />
                    <div className="h-8 w-1/3 rounded-lg bg-slate-200" />
                    <div className="h-64 rounded-2xl bg-slate-200" />
                </div>
            </main>
        );
    }

    if (error || !trip) {
        return (
            <main className="flex min-h-screen w-full items-center justify-center px-4 sm:px-6">
                <div className="w-full max-w-lg text-center">
                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                        Trip not found
                    </h2>
                    <p className="mt-3 break-words text-sm text-slate-500 sm:text-base">
                        {error || "This trip may have been removed."}
                    </p>
                </div>
            </main>
        );
    }

    const details = trip.tripDetails;
    const images = trip.imageUrls || [];
    const location = details.location || {};
    const coordinates = location.coordinates || [];

    const mapUrl = coordinates.length === 2 ? `https://www.openstreetmap.org/export/embed.html?bbox=${Number(coordinates[1]) - 0.15}%2C${Number(coordinates[0]) - 0.1}%2C${Number(coordinates[1]) + 0.15}%2C${Number(coordinates[0]) + 0.1}&layer=mapnik&marker=${coordinates[0]}%2C${coordinates[1]}` : null;

    return (
        <div className={`${url.pathname === `/trips/${trip.$id}` ? "px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40" : "px-0"}`}>
            <main className="min-h-screen w-full overflow-hidden bg-[#f8fafc] text-slate-900">
                {/* Full-width page container */}
                <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-3 py-6 sm:px-5 sm:py-8 md:px-8 lg:px-12 lg:py-12">

                    {/* Header */}
                    <header className="mb-6 sm:mb-8">
                        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
                            <span>Travel</span>
                            <span>/</span>
                            <span>{details.country}</span>
                            <span>/</span>
                            <span className="text-blue-600">Trip overview</span>
                        </div>

                        <h1 className="max-w-5xl break-words text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                            {details.name}
                        </h1>

                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-3 text-sm text-slate-600 sm:mt-5 sm:gap-x-6 md:text-base">
                            <span>📍 {location.city || details.country}</span>
                            <span>🗓️ {details.duration} days</span>
                            <span>👥 {details.groupType}</span>
                        </div>
                    </header>

                    {/* Trip Images */}
                    <section className="grid h-auto w-full grid-cols-1 grid-rows-[240px_150px_150px] gap-3 sm:grid-cols-2 sm:grid-rows-[300px_180px] md:h-[60vh] md:min-h-[450px] md:grid-cols-3 md:grid-rows-2 lg:h-[80vh] lg:max-h-[850px]">
                        <div className="relative col-span-1 row-span-1 overflow-hidden rounded-xl sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-2">
                            <img src={images[0]} alt="" className="h-full w-full object-cover object-center" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white sm:bottom-6 sm:left-6 md:bottom-10 md:left-10">
                                <p className="text-xs font-medium uppercase tracking-[0.15em] sm:text-sm sm:tracking-[0.2em]">
                                    Your next adventure
                                </p>
                                <h2 className="mt-2 break-words text-2xl font-bold sm:text-3xl md:text-4xl">
                                    Explore {details.country}
                                </h2>
                            </div>
                        </div>

                        <div className="col-span-1 row-span-1 overflow-hidden rounded-xl">
                            <img src={images[1]} alt="" className="h-full w-full object-cover object-center" />
                        </div>

                        <div className="col-span-1 row-span-1 overflow-hidden rounded-xl">
                            <img src={images[2]} alt="" className="h-full w-full object-cover object-center" />
                        </div>
                    </section>

                    {/* Trip tags */}
                    <section className="mb-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-6 sm:mb-12 sm:gap-3 sm:pb-8">
                        {[details.budget, details.travelStyle, details.interests, details.groupType]
                            .flat()
                            .filter(Boolean)
                            .map((tag, index) => (
                                <span
                                    key={`${tag}-${index}`}
                                    className="max-w-full break-words rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm sm:px-5 sm:text-sm"
                                >
                                    {tag}
                                </span>
                            ))}

                        <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-bold text-amber-600 sm:ml-auto sm:px-4 sm:text-sm">
                            ★ Recommended itinerary
                        </span>
                    </section>

                    {/* Overview and price */}
                    <section className="mb-10 grid min-w-0 gap-6 sm:mb-16 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 xl:gap-14">
                        <div className="min-w-0">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                                Trip overview
                            </p>

                            <h2 className="break-words text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                                {details.name}
                            </h2>

                            <p className="mt-4 break-words text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base sm:leading-8 md:text-lg">
                                {details.description}
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
                                {[
                                    { label: "Destination", value: details.country, icon: "📍" },
                                    { label: "Duration", value: `${details.duration} days`, icon: "🗓️" },
                                    { label: "Travel style", value: details.travelStyle, icon: "✈️" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
                                    >
                                        <span className="text-2xl">{item.icon}</span>
                                        <p className="mt-3 text-sm text-slate-500 sm:mt-4">{item.label}</p>
                                        <p className="mt-1 break-words font-bold">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <aside className="h-fit min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7 lg:sticky lg:top-8">
                            <p className="text-sm font-semibold text-slate-500">
                                Estimated trip cost
                            </p>

                            <p className="mt-3 break-words text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                {details.estimatedPrice}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Estimated total in USD. Actual costs may vary.
                            </p>

                            <div className="my-6 border-t border-slate-100" />

                            <div className="space-y-4 text-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-slate-500">Budget</span>
                                    <span className="break-words text-right font-semibold">{details.budget}</span>
                                </div>

                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-slate-500">Travel group</span>
                                    <span className="break-words text-right font-semibold">{details.groupType}</span>
                                </div>

                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-slate-500">Duration</span>
                                    <span className="text-right font-semibold">{details.duration} days</span>
                                </div>
                            </div>

                            <a
                                href="#itinerary"
                                className="mt-7 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700 sm:px-5 sm:py-4 sm:text-base"
                            >
                                Explore itinerary ↓
                            </a>
                        </aside>
                    </section>

                    {/* Itinerary */}
                    <section id="itinerary" className="mb-12 scroll-mt-6 sm:mb-20 sm:scroll-mt-8">
                        <div className="mb-6 sm:mb-10">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                                Your journey
                            </p>
                            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl md:text-4xl">
                                Day-by-day itinerary
                            </h2>
                            <p className="mt-3 text-sm text-slate-500 sm:text-base">
                                Your complete {details.duration}-day travel plan.
                            </p>
                        </div>

                        <div className="space-y-5 sm:space-y-6">
                            {details.itinerary?.map((day, index) => (
                                <article
                                    key={day.day ?? index}
                                    className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl"
                                >
                                    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-5 sm:gap-4 sm:px-6 sm:py-6 md:px-9">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-extrabold text-white sm:h-14 sm:w-14 sm:rounded-2xl sm:text-xl">
                                            {String(day.day ?? index + 1).padStart(2, "0")}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                                                Day {day.day ?? index + 1}
                                            </p>
                                            <h3 className="mt-1 break-words text-lg font-bold sm:text-xl md:text-2xl">
                                                {day.location}
                                            </h3>
                                        </div>

                                        <span className="hidden rounded-full bg-white px-4 py-2 text-sm text-slate-500 ring-1 ring-slate-200 sm:block">
                                            📍 Explore destination
                                        </span>
                                    </div>

                                    <div className="p-4 sm:p-6 md:p-9">
                                        <div className="relative space-y-6 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-slate-200 sm:space-y-7 md:ml-2">
                                            {day.activities?.map((activity, activityIndex) => (
                                                <div
                                                    key={`${activity.time}-${activityIndex}`}
                                                    className="relative flex min-w-0 gap-3 pl-1 sm:gap-5"
                                                >
                                                    <div className="relative z-10 mt-1.5 h-5 w-5 shrink-0 rounded-full border-4 border-blue-100 bg-blue-600 ring-4 ring-white" />

                                                    <div className="min-w-0 flex-1 pb-2">
                                                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600 sm:text-sm">
                                                            {activity.time}
                                                        </p>
                                                        <p className="mt-2 break-words text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 md:text-lg">
                                                            {activity.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Best time to visit */}
                    <section className="mb-12 sm:mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                            Plan your visit
                        </p>
                        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl md:text-4xl">
                            Best time to visit
                        </h2>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
                            {details.bestTimeToVisit?.map((season, index) => (
                                <div
                                    key={index}
                                    className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
                                >
                                    <span className="text-3xl">
                                        {["🌸", "☀️", "🍁", "❄️"][index % 4]}
                                    </span>
                                    <p className="mt-4 break-words leading-7 text-slate-600">{season}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Weather */}
                    <section className="mb-12 rounded-2xl bg-slate-900 p-5 text-white sm:mb-20 sm:rounded-3xl sm:p-7 md:p-10 lg:p-12">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300 sm:text-sm">
                                    Destination forecast guide
                                </p>
                                <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl md:text-4xl">
                                    Weather information
                                </h2>
                            </div>
                            <span className="text-3xl">🌤️</span>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
                            {details.weatherInfo?.map((weather, index) => (
                                <div
                                    key={index}
                                    className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
                                >
                                    <span className="text-2xl">
                                        {["☀️", "🌦️", "🌧️", "❄️"][index % 4]}
                                    </span>
                                    <p className="mt-4 break-words leading-7 text-slate-300">{weather}</p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-6 text-xs leading-6 text-slate-400 sm:text-sm">
                            These are general seasonal estimates, not a live weather forecast.
                        </p>
                    </section>

                    {/* Map */}
                    <section className="mb-8 sm:mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
                            Find your destination
                        </p>
                        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl md:text-4xl">
                            Explore the location
                        </h2>
                        <p className="mt-3 break-words text-sm text-slate-500 sm:text-base">
                            {location.city || details.country}
                        </p>

                        {mapUrl ? (
                            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:mt-8 sm:rounded-3xl sm:p-2">
                                <iframe
                                    title={`Map of ${location.city || details.country}`}
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                        `${location.city || details.country}, ${details.country}`
                                    )}&hl=en&z=11&output=embed`}
                                    className="h-64 w-full rounded-xl sm:h-80 md:h-[450px] lg:h-[600px] sm:rounded-2xl"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />

                                <div className="flex flex-col items-start justify-between gap-4 px-3 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-5">
                                    <div className="min-w-0">
                                        <p className="break-words font-bold">
                                            {location.city || details.country}
                                        </p>
                                        <p className="mt-1 break-words text-xs text-slate-500 sm:text-sm">
                                            {coordinates.length === 2
                                                ? `${coordinates[0]}, ${coordinates[1]}`
                                                : "Destination map"}
                                        </p>
                                    </div>

                                    {location.openStreetMap && (
                                        <a
                                            href={location.openStreetMap}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:w-auto"
                                        >
                                            Open full map ↗
                                        </a>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 flex min-h-64 items-center justify-center rounded-2xl bg-slate-100 px-4 text-center text-sm text-slate-500 sm:rounded-3xl sm:text-base">
                                Map coordinates are not available for this trip.
                            </div>
                        )}
                    </section>

                    {/* Payment link */}
                    <Link
                        to={`/trips/strip/${id}`}
                        disabled={isDisable}
                        className={`flex w-full flex-wrap items-center justify-center gap-3 rounded-md bg-blue-600 px-3 py-3 transition hover:bg-blue-700 sm:px-5 sm:py-4 ${isDisable && "pointer-events-none opacity-20"}`}
                    >
                        <p className="text-center text-sm font-semibold text-white sm:text-base">
                            Pay and join trip
                        </p>
                        <p className="max-w-full break-words rounded-full bg-white px-4 py-1 text-sm font-extrabold sm:text-base">
                            {details.estimatedPrice}
                        </p>
                    </Link>

                    {/* Footer */}
                    <footer className="mt-8 border-t border-slate-200 py-6 text-center text-xs text-slate-500 sm:mt-12 sm:py-8 sm:text-sm">
                        Your next adventure starts here. ✈️
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default EachTrip;
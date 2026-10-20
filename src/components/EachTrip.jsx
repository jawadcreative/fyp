import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { getTripById } from "../appwrite/trip";

const EachTrip = () => {
    const { id } = useParams();
    const url = useLocation()
    const isDisable = url.pathname === `/admin/trips/${id}`
    console.log(isDisable)

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
            <main className="min-h-screen w-full animate-pulse bg-slate-50 p-6 md:p-12">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="h-10 w-2/3 rounded-lg bg-slate-200" />
                    <div className="h-96 rounded-3xl bg-slate-200" />
                    <div className="h-8 w-1/3 rounded-lg bg-slate-200" />
                    <div className="h-64 rounded-2xl bg-slate-200" />
                </div>
            </main>
        );
    }

    if (error || !trip) {
        return (
            <main className="flex min-h-screen items-center justify-center px-6 max-w-lg">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Trip not found
                    </h2>
                    <p className="mt-3 text-slate-500">
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
        <div className={`${url.pathname === `/trips/${trip.$id}` && 'px-40'}`}>
            <main className="min-h-screen w-full bg-[#f8fafc] text-slate-900">
                {/* Full-width page container */}
                <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-8 md:px-12 lg:px-16 lg:py-12 flex flex-col gap-3">

                    {/* Header */}
                    <header className="mb-8">
                        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <span>Travel</span>
                            <span>/</span>
                            <span>{details.country}</span>
                            <span>/</span>
                            <span className="text-blue-600">Trip overview</span>
                        </div>

                        <h1 className="max-w-5xl text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                            {details.name}
                        </h1>

                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 md:text-base">
                            <span>📍 {location.city || details.country}</span>
                            <span>🗓️ {details.duration} days</span>
                            <span>👥 {details.groupType}</span>
                        </div>
                    </header>

                    <section className="h-[80vh] w-full grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-2 gap-3">
                        <div className="relative col-span-1 row-span-1 md:col-span-2 md:row-span-2 rounded-xl overflow-hidden">
                            <img src={images[0]} alt="" className="h-full w-full object-cover object-center" />
                            <div className="absolute bottom-6 left-6 text-white md:bottom-10 md:left-10">
                                <p className="text-sm font-medium uppercase tracking-[0.2em]">
                                    Your next adventure
                                </p>
                                <h2 className="mt-2 text-2xl font-bold md:text-4xl">
                                    Explore {details.country}
                                </h2>
                            </div>
                        </div>
                        <div className="col-span-1 row-span-1 rounded-xl overflow-hidden">
                            <img src={images[1]} alt="" className="h-full w-full object-cover object-center" />
                        </div>
                        <div className="col-span-1 row-span-1 rounded-xl overflow-hidden">
                            <img src={images[2]} alt="" className="h-full w-full object-cover object-center" />
                        </div>
                    </section>

                    {/* Trip tags */}
                    <section className="mb-12 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-8">
                        {[details.budget, details.travelStyle, details.interests, details.groupType]
                            .flat()
                            .filter(Boolean)
                            .map((tag, index) => (
                                <span
                                    key={`${tag}-${index}`}
                                    className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                                >
                                    {tag}
                                </span>
                            ))}

                        <span className="ml-auto rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-600">
                            ★ Recommended itinerary
                        </span>
                    </section>

                    {/* Overview and price */}
                    <section className="mb-16 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-14">
                        <div>
                            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                                Trip overview
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                                {details.name}
                            </h2>

                            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600 md:text-lg">
                                {details.description}
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                                {[
                                    { label: "Destination", value: details.country, icon: "📍" },
                                    { label: "Duration", value: `${details.duration} days`, icon: "🗓️" },
                                    { label: "Travel style", value: details.travelStyle, icon: "✈️" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-slate-200 bg-white p-5"
                                    >
                                        <span className="text-2xl">{item.icon}</span>
                                        <p className="mt-4 text-sm text-slate-500">{item.label}</p>
                                        <p className="mt-1 font-bold">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:sticky lg:top-8">
                            <p className="text-sm font-semibold text-slate-500">
                                Estimated trip cost
                            </p>

                            <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
                                {details.estimatedPrice}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Estimated total in USD. Actual costs may vary.
                            </p>

                            <div className="my-6 border-t border-slate-100" />

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Budget</span>
                                    <span className="font-semibold">{details.budget}</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Travel group</span>
                                    <span className="font-semibold">{details.groupType}</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Duration</span>
                                    <span className="font-semibold">{details.duration} days</span>
                                </div>
                            </div>

                            <a
                                href="#itinerary"
                                className="mt-7 block rounded-xl bg-blue-600 px-5 py-4 text-center font-bold text-white transition hover:bg-blue-700"
                            >
                                Explore itinerary ↓
                            </a>
                        </aside>
                    </section>

                    {/* Itinerary */}
                    <section id="itinerary" className="mb-20 scroll-mt-8">
                        <div className="mb-10">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                                Your journey
                            </p>
                            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                                Day-by-day itinerary
                            </h2>
                            <p className="mt-3 text-slate-500">
                                Your complete {details.duration}-day travel plan.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {details.itinerary?.map((day, index) => (
                                <article
                                    key={day.day ?? index}
                                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                                >
                                    <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-6 md:px-9">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-extrabold text-white">
                                            {String(day.day ?? index + 1).padStart(2, "0")}
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                                                Day {day.day ?? index + 1}
                                            </p>
                                            <h3 className="mt-1 text-xl font-bold md:text-2xl">
                                                {day.location}
                                            </h3>
                                        </div>

                                        <span className="ml-auto hidden rounded-full bg-white px-4 py-2 text-sm text-slate-500 ring-1 ring-slate-200 sm:block">
                                            📍 Explore destination
                                        </span>
                                    </div>

                                    <div className="p-6 md:p-9">
                                        <div className="relative space-y-7 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-slate-200 md:ml-2">
                                            {day.activities?.map((activity, activityIndex) => (
                                                <div
                                                    key={`${activity.time}-${activityIndex}`}
                                                    className="relative flex gap-5 pl-1"
                                                >
                                                    <div className="relative z-10 mt-1.5 h-5 w-5 shrink-0 rounded-full border-4 border-blue-100 bg-blue-600 ring-4 ring-white" />

                                                    <div className="min-w-0 flex-1 pb-2">
                                                        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                                                            {activity.time}
                                                        </p>
                                                        <p className="mt-2 text-base leading-8 text-slate-600 md:text-lg">
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
                    <section className="mb-16">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                            Plan your visit
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                            Best time to visit
                        </h2>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {details.bestTimeToVisit?.map((season, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <span className="text-3xl">
                                        {["🌸", "☀️", "🍁", "❄️"][index % 4]}
                                    </span>
                                    <p className="mt-4 leading-7 text-slate-600">{season}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Weather */}
                    <section className="mb-20 rounded-3xl bg-slate-900 p-7 text-white md:p-10 lg:p-12">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                                    Destination forecast guide
                                </p>
                                <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                                    Weather information
                                </h2>
                            </div>
                            <span className="text-3xl">🌤️</span>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {details.weatherInfo?.map((weather, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-6"
                                >
                                    <span className="text-2xl">
                                        {["☀️", "🌦️", "🌧️", "❄️"][index % 4]}
                                    </span>
                                    <p className="mt-4 leading-7 text-slate-300">{weather}</p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-6 text-sm text-slate-400">
                            These are general seasonal estimates, not a live weather forecast.
                        </p>
                    </section>

                    {/* Map */}
                    <section className="mb-10">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                            Find your destination
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                            Explore the location
                        </h2>
                        <p className="mt-3 text-slate-500">
                            {location.city || details.country}
                        </p>

                        {mapUrl ? (
                            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
                                <iframe
                                    title={`Map of ${location.city || details.country}`}
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                        `${location.city || details.country}, ${details.country}`
                                    )}&hl=en&z=11&output=embed`}
                                    className="h-[400px] w-full rounded-2xl sm:h-[500px] lg:h-[600px]"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />

                                <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-5 md:px-6">
                                    <div>
                                        <p className="font-bold">
                                            {location.city || details.country}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
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
                                            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                                        >
                                            Open full map ↗
                                        </a>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 flex min-h-64 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
                                Map coordinates are not available for this trip.
                            </div>
                        )}
                    </section>

                    <Link to={`/trips/strip/${id}`} disabled={isDisable} className={`bg-blue-600 flex items-center justify-center gap-3 py-2 cursor-pointer rounded-md ${isDisable && 'opacity-20 cursor-not-allowed!'}`}>
                        <p className="text-white">Pay and join trip</p>
                        <p className="px-4 py-1 bg-white rounded-full font-extrabold">{details.estimatedPrice}</p>
                    </Link>

                    {/* Footer */}
                    <footer className="mt-12 border-t border-slate-200 py-8 text-center text-sm text-slate-500">
                        Your next adventure starts here. ✈️
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default EachTrip;

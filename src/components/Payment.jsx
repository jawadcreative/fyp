import { useEffect, useState } from "react";
import { replace, useNavigate, useParams } from "react-router";
import { getTripById } from "../appwrite/trip";

const Payment = () => {
    const { id } = useParams();
    const navigate = useNavigate()

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await getTripById(id);
                setTrip(result);
            } catch (err) {
                console.error("Failed to fetch trip:", err);
                setError("Failed to load trip details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTrip();
        } else {
            setLoading(false);
            setError("Trip ID is missing.");
        }
    }, [id]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center px-4">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
                    <p className="text-center text-sm text-gray-500">
                        Loading trip...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !trip) {
        return (
            <main className="flex min-h-screen items-center justify-center px-4">
                <p className="max-w-md text-center text-red-500">
                    {error || "Trip not found."}
                </p>
            </main>
        );
    }

    let details;
    let imageUrls;

    try {
        details =
            typeof trip.tripDetails === "string"
                ? JSON.parse(trip.tripDetails)
                : trip.tripDetails;

        imageUrls =
            typeof trip.imageUrls === "string"
                ? JSON.parse(trip.imageUrls)
                : trip.imageUrls;
    } catch (err) {
        console.error("Invalid trip data:", err);

        return (
            <main className="flex min-h-screen items-center justify-center px-4">
                <p className="text-center">
                    Unable to display trip details.
                </p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen w-full flex-col bg-white lg:flex-row">

            {/* Trip Information */}
            <section className="flex w-full items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:min-h-screen lg:w-1/2 lg:px-10 lg:py-8 xl:px-16">
                <div className="flex w-full max-w-xl flex-col justify-between gap-8 lg:min-h-[85vh] lg:gap-6">

                    {/* Trip Details */}
                    <div className="flex flex-col gap-5 sm:gap-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm leading-6 text-gray-600 sm:text-base">
                                Pay {details.duration}-days {details.country} Highlights: {details.budget}, {details.travelStyle}.
                            </p>

                            <h1 className="break-words text-2xl font-extrabold sm:text-3xl">
                                {details.estimatedPrice}
                            </h1>
                        </div>

                        <img
                            src={imageUrls?.[0]}
                            alt={details.country}
                            className="h-52 w-[30vw] rounded-xl object-cover sm:h-64 md:h-72 lg:h-[40vh] lg:max-h-80"
                        />

                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-gray-800 sm:text-base">
                                {details.duration}-days {details.country} Adventure
                            </p>

                            <p className="break-words text-sm text-gray-500 sm:text-base">
                                {details.name},
                            </p>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-gray-100 pt-5 text-sm sm:gap-6 lg:border-0 lg:pt-0">
                        <p className="flex items-center gap-2 font-extrabold leading-none">
                            Powered by
                            <span>
                                <img
                                    src="/icons/strip.svg"
                                    alt="Stripe"
                                    className="h-4"
                                />
                            </span>
                        </p>

                        <div className="hidden h-6 w-px bg-black sm:block" />

                        <div className="flex gap-4">
                            <a
                                href="https://stripe.com/legal"
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-600 transition hover:text-black"
                            >
                                Terms
                            </a>

                            <a
                                href="https://stripe.com/privacy"
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-600 transition hover:text-black"
                            >
                                Privacy
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Form */}
            <section className="flex w-full items-center justify-center border-t border-gray-200 px-5 py-8 sm:px-8 sm:py-10 lg:min-h-screen lg:w-1/2 lg:border-l lg:border-t-0 lg:px-10 lg:py-8 xl:px-16">
                <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 sm:gap-5">

                    {/* Apple Pay */}
                    <button
                        type="button"
                        className="flex h-11 w-full items-center justify-center gap-1 rounded-lg bg-black py-3 text-white transition hover:bg-gray-800 sm:h-12"
                    >
                        <img
                            className="h-4 invert"
                            src="/icons/apple.svg"
                            alt="Apple"
                        />
                        Pay
                    </button>

                    {/* Divider */}
                    <div className="relative flex h-px w-full items-center justify-center bg-gray-200">
                        <p className="absolute whitespace-nowrap bg-white px-3 text-sm text-gray-500">
                            Or pay with card
                        </p>
                    </div>

                    {/* Card Form */}
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex w-full flex-col gap-4"
                    >
                        <label className="block">
                            <span className="mb-1.5 block text-sm text-gray-600">
                                Email
                            </span>

                            <input
                                type="email"
                                autoComplete="email"
                                required
                                className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                        </label>

                        {/* Card Information */}
                        <div>
                            <label className="mb-1.5 block text-sm text-gray-600">
                                Card information
                            </label>

                            <div className="overflow-hidden rounded-md border border-gray-200">
                                <div className="flex h-10 items-center border-b border-gray-200">
                                    <input
                                        type="text"
                                        autoComplete="cc-number"
                                        inputMode="numeric"
                                        placeholder="1234 1234 1234 1234"
                                        className="h-full min-w-0 flex-1 px-3 text-sm outline-none"
                                    />

                                    <span className="shrink-0 px-2 text-[10px] font-bold text-blue-800 sm:px-3">
                                        VISA
                                    </span>
                                </div>

                                <div className="grid grid-cols-2">
                                    <input
                                        type="text"
                                        autoComplete="cc-exp"
                                        inputMode="numeric"
                                        placeholder="MM / YY"
                                        className="h-10 min-w-0 border-r border-gray-200 px-3 text-sm outline-none"
                                    />

                                    <input
                                        type="password"
                                        autoComplete="cc-csc"
                                        inputMode="numeric"
                                        placeholder="CVC"
                                        className="h-10 min-w-0 px-3 text-sm outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Name on Card */}
                        <label className="block">
                            <span className="mb-1.5 block text-sm text-gray-600">
                                Name on card
                            </span>

                            <input
                                type="text"
                                autoComplete="cc-name"
                                className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                        </label>

                        {/* Country and Postal Code */}
                        <div>
                            <label
                                htmlFor="country"
                                className="mb-1.5 block text-sm text-gray-600"
                            >
                                Country or region
                            </label>

                            <div className="overflow-hidden rounded-md border border-gray-200">
                                <select
                                    id="country"
                                    name="country"
                                    defaultValue="PK"
                                    autoComplete="country"
                                    className="h-10 w-full border-b border-gray-200 bg-white px-3 text-sm outline-none"
                                >
                                    <option value="PK">Pakistan</option>
                                    <option value="US">United States</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="IN">India</option>
                                </select>

                                <input
                                    type="text"
                                    name="zip"
                                    autoComplete="postal-code"
                                    placeholder="Postal code / ZIP"
                                    className="h-10 w-full px-3 text-sm outline-none"
                                />
                            </div>
                        </div>

                        {/* Pay Button */}
                        <button onClick={() => {
                            navigate('/thankyou', { replace: true })
                        }}
                            type="submit"
                            className="mt-1 h-11 w-full cursor-pointer rounded-md bg-[#3d4359] px-4 text-sm font-semibold text-white transition hover:bg-[#2d3348] sm:h-12 sm:text-base"
                        >
                            Pay {details.estimatedPrice}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Payment;

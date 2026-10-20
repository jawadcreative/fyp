import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getTripById } from "../appwrite/trip";
import { ArrowLeft, LucideApple } from "lucide-react";

const Payment = () => {
    const { id } = useParams();

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
        return <p className="p-6 text-center">Loading trip...</p>;
    }

    if (error || !trip) {
        return (
            <p className="p-6 text-center text-red-500">
                {error || "Trip not found."}
            </p>
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
            <p className="p-6 text-center">
                Unable to display trip details.
            </p>
        );
    }



    return (
        <main className="flex">
            <section className="h-screen w-1/2 flex items-center justify-center">
                <div className="h-[85vh] flex flex-col items-start justify-around gap-6">
                    <div className="flex flex-col gap-6">
                        <div className="">
                            <p>Pay {details.duration}-days {details.country} Highlights: {details.budget}, {details.travelStyle}. </p>
                            <h1 className="text-2xl font-extrabold">{details.estimatedPrice}</h1>
                        </div>
                        <img src={imageUrls[0]} alt={details.country} className="h-[30vh] w-[20vw] rounded-lg" />
                        <div className="">
                            <p>{details.duration}-days {details.country} Adventure</p>
                            <p>{details.name}, </p>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <p className="flex items-center gap-3 font-extrabold leading-none">Powered by <span><img src="/icons/strip.svg" alt="strip" className="h-4" /></span></p>
                        <div className="h-6 w-px bg-black"></div>
                        <div className="flex gap-3">
                            <a href="https://stripe.com/legal">Terms</a>
                            <a href="https://stripe.com/privacy">Privacy</a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="h-screen w-1/2 flex items-center justify-center border-l border-gray-200 shadow-2xl">
                <div className="flex flex-col gap-4 items-center justify-center w-sm">
                    <button className="flex items-center justify-center py-3 rounded-lg gap-1 bg-black text-white w-full"><img className="h-4 invert-100" src="/icons/apple.svg" alt="apple" />Pay</button>
                    <div className="h-px w-full flex items-center justify-center bg-black">
                        <p className="flex items-center justify-center px-3 bg-white">Or pay with card</p>
                    </div>
                    <form onSubmit={(e) => e.preventDefault()}
                    className="flex flex-col gap-3">
                        <label className="block">
                            <span className="mb-1.5 block text-gray-600">
                                Email
                            </span>
                            <input
                                type="email"
                                autoComplete="email"
                                required
                                className="h-9 w-full rounded-md border border-gray-200 px-3  outline-none focus:border-indigo-400"
                            />
                        </label>

                        <div>
                            <label className="mb-1.5 block text-gray-600">
                                Card information
                            </label>

                            <div className="overflow-hidden rounded-md border border-gray-200">
                                <div className="flex h-9 items-center border-b border-gray-200">
                                    <input
                                        type="text"
                                        autoComplete="cc-number"
                                        placeholder="1234 1234 1234 1234"
                                        className="h-full min-w-0 flex-1 px-3 outline-none"
                                    />
                                    <span className="px-2 text-[10px] font-bold text-blue-800">
                                        VISA
                                    </span>
                                </div>

                                <div className="grid grid-cols-2">
                                    <input
                                        type="text"
                                        autoComplete="cc-exp"
                                        placeholder="MM / YY"
                                        className="h-9 min-w-0 border-r border-gray-200 px-3 outline-none"
                                    />
                                    <input
                                        type="password"
                                        autoComplete="cc-csc"
                                        placeholder="CVC"
                                        className="h-9 min-w-0 px-3 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <label className="block">
                            <span className="mb-1.5 block text-gray-600">
                                Name on card
                            </span>
                            <input
                                type="text"
                                autoComplete="cc-name"
                                className="h-9 w-full rounded-md border border-gray-200 px-3  outline-none focus:border-indigo-400"
                            />
                        </label>

                        <div>
                            <label
                                htmlFor="country"
                                className="mb-1.5 block text-gray-600"
                            >
                                Country or region
                            </label>

                            <div className="overflow-hidden rounded-md border border-gray-200">
                                <select
                                    id="country"
                                    name="country"
                                    defaultValue="PK"
                                    autoComplete="country"
                                    className="h-9 w-full border-b border-gray-200 bg-white px-3  outline-none"
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
                                    className="h-9 w-full px-3 outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="h-10 w-full rounded-md bg-[#3d4359]  text-white transition hover:bg-[#2d3348] cursor-pointer"
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
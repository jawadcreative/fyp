import { Link } from "react-router";
import { BadgeCheck, ArrowLeft, PartyPopper } from "lucide-react";

const ThankYou = () => {
    const confetti = Array.from({ length: 42 }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 8) % 97}%`,
        top: `${(i * 53 + 5) % 94}%`,
        color: [
            "#F97316",
            "#C084FC",
            "#A3E635",
            "#67E8F9",
            "#F472B6",
            "#FACC15",
            "#60A5FA",
            "#4ADE80",
        ][i % 8],
        rotate: `${(i * 47) % 180}deg`,
        size: i % 3 === 0 ? 6 : 4,
    }));

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f8fafc] px-4 py-10">
            {/* Colorful confetti */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                {confetti.map((piece) => (
                    <span
                        key={piece.id}
                        className="absolute block"
                        style={{
                            left: piece.left,
                            top: piece.top,
                            width: piece.size,
                            height: piece.size,
                            backgroundColor: piece.color,
                            transform: `rotate(${piece.rotate})`,
                        }}
                    >
                        {piece.id % 5 === 0 && (
                            <span
                                className="absolute inset-0"
                                style={{
                                    backgroundColor: piece.color,
                                    transform: "rotate(45deg)",
                                }}
                            />
                        )}
                    </span>
                ))}
            </div>

            {/* Welcome content */}
            <section className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
                {/* Success icon */}
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full text-emerald-500">
                    <BadgeCheck
                        size={64}
                        strokeWidth={3}
                        fill="currentColor"
                        className="text-emerald-500"
                    >
                        <path
                            d="m9 12 2 2 4-4"
                            stroke="white"
                            strokeWidth={2}
                            fill="none"
                        />
                    </BadgeCheck>
                </div>

                <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Thank You &amp; Welcome Aboard!
                </h1>

                <p className="mt-3 max-w-sm text-xs leading-6 text-gray-600 sm:text-sm">
                    Your trip's booked — can't wait to have you on this adventure!
                    🌍 Get ready to explore &amp; make memories.
                </p>

                {/* Actions */}
                <div className="mt-5 flex w-full max-w-xs flex-col gap-3">
                    <Link
                        to="/trips"
                        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                    >
                        <PartyPopper size={16} />
                        View trip details
                    </Link>

                    <Link
                        to="/"
                        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-md transition hover:bg-gray-50 active:scale-[0.98]"
                    >
                        <ArrowLeft size={15} />
                        Return to homepage
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default ThankYou;
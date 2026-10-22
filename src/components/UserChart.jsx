import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import { getUserRegistrationStats } from "../appwrite/auth";

const UserChart = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getUserRegistrationStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch registration stats:", err);
                setError("Unable to load registration statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-80 items-center justify-center rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">
                    Loading registration chart...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-80 items-center justify-center rounded-xl border bg-white p-5">
                <p className="text-sm text-red-500">{error}</p>
            </div>
        );
    }

    const chartData = [
        {
            name: "Yesterday",
            registrations: stats.yesterday,
        },
        {
            name: "Today",
            registrations: stats.today,
        },
    ];

    const changeText =
        stats.percentage === null
            ? stats.today > 0
                ? "New registrations today"
                : "No registrations yet"
            : `${stats.percentage > 0 ? "+" : ""}${stats.percentage}% vs yesterday`;

    const changeColor =
        stats.direction === "increase"
            ? "text-green-600"
            : stats.direction === "decrease"
                ? "text-red-600"
                : "text-gray-500";

    return (
        <section className="w-full min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                        User Registrations
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Compare today's registrations with yesterday's.
                    </p>
                </div>

                <span
                    className={`w-50 flex items-center justify-center rounded-full bg-gray-100 px-3 py-1.5 text-xs ${changeColor}`}
                >
                    {changeText}
                </span>
            </div>

            {/* Summary */}
            <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-blue-50 p-3 sm:p-4">
                    <p className="text-xs text-gray-600 sm:text-sm">
                        Today's registrations
                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-700 sm:text-3xl">
                        {stats.today}
                    </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <p className="text-xs text-gray-600 sm:text-sm">
                        Yesterday's registrations
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-800 sm:text-3xl">
                        {stats.yesterday}
                    </p>
                </div>
            </div>

            {/* Responsive chart */}
            <div className="h-64 w-full min-w-0 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 8, left: -20, bottom: 5 }}
                        barCategoryGap="40%"
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e5e7eb"
                        />

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                        />

                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            width={35}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                        />

                        <Tooltip
                            cursor={{ fill: "#f3f4f6" }}
                            formatter={(value) => [
                                `${value} ${value === 1 ? "user" : "users"}`,
                                "Registrations",
                            ]}
                            contentStyle={{
                                borderRadius: "10px",
                                border: "1px solid #e5e7eb",
                                fontSize: "12px",
                            }}
                        />

                        <Bar
                            dataKey="registrations"
                            name="Registrations"
                            fill="#2563eb"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={80}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <p className="mt-3 text-xs text-gray-400">
                Data fetched from your Appwrite users table.
            </p>
        </section>
    );
};

export default UserChart;
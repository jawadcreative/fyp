import { useEffect, useState } from "react";
import AdminTop from "../../components/AdminTop";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { getAllTrips } from "../../appwrite/trip";
import { Link } from "react-router";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);

      try {
        const data = await getAllTrips(4);
        setTrips(data);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <section className="flex min-h-full w-full min-w-0 flex-col gap-5 p-3 sm:gap-6 sm:p-5 lg:p-6 xl:p-8">
      <AdminTop
        title={`Welcome ${user?.name ?? "Admin"} 👋`}
        des="Track activity, trends, and popular destinations in real time"
        btn="Create a trip"
        to="/admin/trips/create"
      />

      {/* Dashboard statistics */}
      <div className="w-full min-w-0">
        <Card />
      </div>

      {/* Trips section */}
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold sm:text-2xl">
            Trips
          </h2>

          <Link
            to="/admin/trips"
            className="shrink-0 text-sm font-medium text-blue-600 hover:underline sm:text-base"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center">
            <p className="text-sm text-gray-500 sm:text-base">
              Loading trips...
            </p>
          </div>
        ) : trips.length === 0 ? (
          <div className="flex min-h-40 items-center justify-center">
            <p className="text-center text-sm text-gray-500 sm:text-base">
              No trips found.
            </p>
          </div>
        ) : (
          <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
            {trips.map((trip) => {
              let details;
              let images;

              try {
                details =
                  typeof trip.tripDetails === "string"
                    ? JSON.parse(trip.tripDetails)
                    : trip.tripDetails;

                images =
                  typeof trip.imageUrls === "string"
                    ? JSON.parse(trip.imageUrls)
                    : trip.imageUrls;
              } catch (error) {
                console.error(
                  `Invalid trip data for ${trip.$id}:`,
                  error
                );
                return null;
              }

              const image = Array.isArray(images)
                ? images[2] || images[0]
                : null;

              return (
                <Link
                  key={trip.$id}
                  to={`/admin/trips/${trip.$id}`}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
                >
                  {/* Trip image */}
                  <div className="relative h-48 w-full overflow-hidden sm:h-52 lg:h-56">
                    {image ? (
                      <img
                        src={image}
                        alt={
                          details?.name ||
                          details?.country ||
                          "Trip"
                        }
                        loading="lazy"
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-500">
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Trip information */}
                  <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                    <h3 className="break-words text-lg font-semibold leading-snug sm:text-xl">
                      {details?.country || "Unknown destination"}
                    </h3>

                    {details?.location?.city && (
                      <p className="flex items-start gap-2 break-words text-sm text-gray-600">
                        <img
                          src="/icons/location-mark.svg"
                          alt=""
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0"
                        />
                        <span>{details.location.city}</span>
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                      {details?.budget && (
                        <span className="max-w-full break-words rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 sm:px-4">
                          {details.budget}
                        </span>
                      )}

                      {details?.groupType && (
                        <span className="max-w-full break-words rounded-full bg-pink-100 px-3 py-1.5 text-xs font-medium text-pink-800 sm:px-4">
                          {details.groupType}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
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
    <section className="flex h-full w-full flex-col gap-6">
      <AdminTop
        title={`Welcome ${user?.name ?? "Admin"} 👋`}
        des="Track activity, trends, and popular destinations in real time"
        btn="Create a trip"
        to="/admin/trips/create"
      />

      <Card />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Trips</h2>

          <Link
            to="/admin/trips"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p className="py-10 text-center">Loading trips...</p>
        ) : trips.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No trips found.
          </p>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  className="overflow-hidden rounded-xl shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-[50vh] min-h-[350px] flex-col">
                    {image ? (
                      <img
                        src={image}
                        alt={details?.name || details?.country || "Trip"}
                        className="h-1/2 w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-1/2 items-center justify-center bg-gray-100">
                        No image available
                      </div>
                    )}

                    <div className="flex flex-1 flex-col gap-3 px-5 py-4">
                      <h3 className="text-2xl font-semibold">
                        {details?.country || "Unknown destination"}
                      </h3>

                      {details?.location?.city && (
                        <p className="flex items-center gap-2 text-sm text-gray-600">
                          <img
                            src="/icons/location-mark.svg"
                            alt=""
                            className="h-4 w-4"
                          />
                          {details.location.city}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        {details?.budget && (
                          <span className="rounded-full bg-green-200 px-4 py-2 text-xs">
                            {details.budget}
                          </span>
                        )}

                        {details?.groupType && (
                          <span className="rounded-full bg-pink-200 px-4 py-2 text-xs">
                            {details.groupType}
                          </span>
                        )}
                      </div>
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
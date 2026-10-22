import { useEffect, useState } from "react";
import AdminTop from "../../components/AdminTop";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { getAllTrips } from "../../appwrite/trip";
import { Link } from "react-router";
import UserChart from "../../components/UserChart";


const Dashboard = () => {
  const { allUsers, refreshAllUsers } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // Fetch recent trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getAllTrips(3);
        setTrips(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await refreshAllUsers(1, 7);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [refreshAllUsers]);

  const users = (allUsers?.users ?? []).slice(0, 7);

  return (
    <section className="flex w-full min-w-0 flex-col gap-5 p-3 sm:gap-6 sm:p-5 lg:p-6 xl:p-8">
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

      {/* Trips */}
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
          <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
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

      {/* Analytics and recent users */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-2">
        {/* Registration chart */}
        <div className="min-w-0">
          <UserChart />
        </div>

        {/* Latest user signups */}
        <div className="min-w-0 bg-white rounded-xl border border-gray-100 p-5 shadow-sm sm:p-4">
          <h2 className="border-b border-gray-100 pb-4 text-lg font-semibold text-gray-900">
            Latest user signups
          </h2>

          <div className="mt-4">
            <div className="grid grid-cols-[minmax(0,1fr)_100px] gap-3 px-3 py-3 text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:grid-cols-[minmax(0,1fr)_120px] sm:px-4">
              <span>Name</span>
              <span>Itinerary created</span>
            </div>

            {users.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No users found.
              </p>
            ) : (
              <div className="space-y-1">
                {users.map((item) => (
                  <div
                    key={item.$id}
                    className="grid min-h-[60px] grid-cols-[minmax(0,1fr)_100px] items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100 sm:grid-cols-[minmax(0,1fr)_120px] sm:px-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={
                          item.avatar ||
                          "/images/default-avatar.png"
                        }
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/default-avatar.png";
                        }}
                      />

                      <span className="truncate text-xs font-medium text-gray-900 sm:text-sm">
                        {item.name || "Unknown user"}
                      </span>
                    </div>

                    <span className="text-sm text-gray-700">
                      {item.itineraryCount ?? item.tripsCount ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Dashboard;
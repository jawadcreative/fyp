import { useState } from "react";
import countriesData from "country-list";
import { createTrip } from "../../../api/create-trip";
import { replace, useNavigate } from "react-router";
import Map from "../../../components/Map";

const CreateTrip = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [form, setForm] = useState({
    country: "Croatia",
    group: "",
    duration: "",
    travel: "",
    interests: "",
    budget: ""
  });

  const { country, group, duration, travel, interests, budget } = form;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const countries = countriesData
    .getData()
    .sort((a, b) => a.name.localeCompare(b.name));

  const groupType = ["Solo", "Couple", "Family", "Friend", "Business"];

  const travelStyle = [
    "Relaxed",
    "Adventure",
    "Culture",
    "Luxury",
    "Nature & Outdoors",
    "City Exploration",
  ];

  const interest = ["Food & Culinary",
    "Hiking & Nature Walks",
    "Historical Sites",
    "Museums & Art",
    "Beaches & Water Activities",
    "Nightlife & Bars",
    "Photography Spots",
    "Shopping",
    "Local Experiences"]

  const budgets = ["Mid Range", "Premium", "Luxury"]

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const result = await createTrip(form);
      navigate(`/trips/${result?.$id}`, { replace: true })
      console.log('Trip create Successfully.')
    } catch (error) {
      console.error("Failed to create trip:", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex min-h-screen w-full justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl flex-col gap-5 rounded-2xl bg-white p-6 shadow-lg"
      >
        <label className="flex flex-col gap-1">
          <span className="text-xs">Country</span>
          <select
            name="country"
            value={country}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {countries.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs">Duration (days)</span>
          <input
            name="duration"
            type="number"
            min="1"
            value={duration}
            onChange={handleChange}
            required
            placeholder="Enter number of days"
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs">Group type</span>
          <select
            name="group"
            value={group}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select group type
            </option>
            {groupType.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs">Travel style</span>
          <select
            name="travel"
            value={travel}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select travel style
            </option>
            {travelStyle.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs">Interests</span>
          <select
            name="interests"
            value={interests}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select your interest
            </option>
            {interest.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs">Budget Estimate</span>
          <select
            name="budget"
            value={budget}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>
              Budget
            </option>
            {budgets.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <Map country={country} />

        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700"
        >
          {loading ? (<img src='/icons/loader.svg' alt="loader" className="loader" />) : (<p className="flex items-center gap-2 tracking-widest">Generate Trip <img src="/icons/magic-star.svg" alt="" /></p>)}
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;
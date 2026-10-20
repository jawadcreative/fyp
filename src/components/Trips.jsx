import { useEffect, useState } from "react";
import { getAllTrips } from "../appwrite/trip";
import { Link, useLocation } from "react-router";
import { MoveLeft, MoveRight } from "lucide-react";

const Trips = ({ total }) => {
    const location = useLocation()
    const pageSize = 8
    const [page, setPage] = useState(1);
    const [trips, setTrips] = useState([]);
    useEffect(() => {
        const fetchPost = async () => {
            const result = await getAllTrips(total)
            setTrips(result)
        }
        fetchPost()
    })
    const totalPages = Math.ceil(trips.length / pageSize)
    const start = (page - 1) * pageSize
    const shownTrips = trips.slice(start, start + pageSize)
    return (
        <div className="flex flex-col py-6 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {shownTrips.map((item) => {
                    let details = JSON.parse(item.tripDetails)
                    let images = JSON.parse(item.imageUrls)
                    return (
                        <Link to={`${location.pathname === '/' ? `/trips/${item.$id}` : `/admin/trips/${item.$id}`}`}>
                            <div className="col-span-1 h-[50vh] rounded-xl overflow-hidden shadow-md flex flex-col justify-between">
                                <img src={images[2]} alt={details.name} className="h-45 w-full object-cover object-center" />
                                <div className="w-full px-6 flex flex-col gap-3 justify-start py-3">
                                    <h1 className="text-2xl">{details.country}</h1>
                                    <p className="flex items-center gap-2 text-sm"><span><img src="/icons/location-mark.svg" alt="location" /></span>{details.location.city}</p>
                                    <div className="flex items-center gap-3">
                                        <p className="text-xs px-4 py-2 bg-green-200 rounded-full">{details.budget}</p>
                                        <p className="text-xs px-4 py-2 bg-pink-200 rounded-full">{details.groupType}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
            <div className="flex items-center justify-between">
                <button disabled={page === 1} onClick={() => { setPage((p) => p - 1) }} className={`flex gap-3 items-center px-6 py-3 shadow-md rounded-full cursor-pointer border-t border-gray-300 ${page === 1 && 'opacity-20'}`}><MoveLeft /> Previous</button>
                <div className="flex items-center gap-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button onClick={(e) => { setPage(n) }} className={`h-8 w-8 rounded-md shadow-md ${page === n ? 'bg-blue-600 text-white' : ''} cursor-pointer`}>{n}</button>
                    ))}
                </div>
                <button disabled={page === totalPages} onClick={() => { setPage((p) => p + 1) }} className={`flex gap-3 items-center px-6 py-3 shadow-md rounded-full cursor-pointer border-t border-gray-300 ${page === totalPages && 'opacity-20'}`}>Next <MoveRight /></button>
            </div>
        </div>
    )
}

export default Trips
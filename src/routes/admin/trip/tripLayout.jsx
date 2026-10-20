import { Outlet } from "react-router"
import AdminTop from "../../../components/AdminTop"

const TripLayout = () => {
    return (
        <section>
            <AdminTop title="Trips" des="View and generate AI travel plans" btn="Create a trip" to="/admin/trips/create" />
            <Outlet />
        </section>
    )
}

export default TripLayout
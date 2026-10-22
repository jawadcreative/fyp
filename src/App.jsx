import { Route, Routes, useLocation } from "react-router"
import { AdminLayout, AiTrips, AllUsers, AuthLayout, CreateTrip, Dashboard, Home, Login, Register, RootLayout, Separate, ThankYou, TripLayout } from "./routes"
import EachTrip from "./components/EachTrip"
import Payment from "./components/Payment"

const App = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="admin/dashboard" element={<Dashboard />} />
        <Route path="admin/all-users" element={<AllUsers />} />
        <Route element={<TripLayout />}>
          <Route path="admin/trips" element={<AiTrips />} />
          <Route path="admin/trips/create" element={<CreateTrip />} />
          <Route path="/admin/trips/:id" element={<Separate />} />
        </Route>

      </Route>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/trips/:id" element={<EachTrip />} />
        <Route path="/thankyou" element={<ThankYou />} />
      </Route>
      <Route path="/trips/strip/:id" element={<Payment />} />
    </Routes>
  )
}

export default App
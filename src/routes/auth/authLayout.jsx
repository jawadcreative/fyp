import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import { account } from "../../appwrite/config"

const AuthLayout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await account.get()
                if (user) {
                    navigate('/', { replace: true })
                }
                return user
            } catch (e) {
                console.log(e)
            }

        }
        fetchUser()
    }, [])
    return (
        <main>
            <Outlet />
        </main>
    )
}

export default AuthLayout
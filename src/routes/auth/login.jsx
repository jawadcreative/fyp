import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await login(form);

            setSuccess("Login successful!");

            navigate("/", { replace: true });
        } catch (error) {
            setError(error.message || "Login failed. Please try again.");
        }
    };

    return (
        <section className="h-screen flex items-center justify-center">
            <div className="flex items-center justify-center flex-col gap-4 w-md p-6 shadow-md border border-gray-200">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-extrabold">Welcome back!</h1>
                    <p className="text-center text-xs">Simplify your trip journey all in one place book, see and edit trips.</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-md w-full">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />

                    <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 cursor-pointer duration-100 rounded-sm hover:scale-[1.01] flex items-center justify-center">
                        {loading ? (
                            <img src="/icons/loader.svg" alt="loader" className="loader" />
                        ) : "Login"}
                    </button>
                </form>
                <div className="flex items-center gap-2">
                    <p>Don't have an account.</p>
                    <Link to={'/register'} className="text-blue-600">Register</Link>
                </div>

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
            </div>
        </section>
    );
};

export default Login;
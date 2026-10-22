import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const [load, setLoad] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { register, loading } = useAuth();
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
        setLoading(true)
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const result = await register(form);

            setSuccess(result.message);
            setForm({ name: "", email: "", password: "" });

            navigate("/", { replace: true });
        } catch (error) {
            setError(error.message || "Registration failed.");
        }finally{
            setLoading(false)
        }
    };

    return (
        <section className="h-screen flex items-center justify-center">
            <div className="flex items-center justify-center flex-col gap-4 w-md p-6 shadow-md border border-gray-200">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-extrabold">Create an account!</h1>
                    <p className="text-center text-xs">Simplify your trip journey all in one place book, see and edit trips.</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-md w-full">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                    />

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
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 cursor-pointer duration-100 rounded-sm hover:scale-[1.01] flex items-center justify-center">
                        {load ? <img src="/icons/loader.svg" alt="loader" className="loader" /> : "Register"}
                    </button>
                </form>

                <div className="flex items-center gap-2">
                    <p>Already have an account.</p>
                    <Link to={'/Login'} className="text-blue-600">Login</Link>
                </div>

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
            </div>
        </section>
    );
};

export default Register;

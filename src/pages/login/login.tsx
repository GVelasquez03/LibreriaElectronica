import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import bgImage from "../../assets/book.avif"
import { login } from "../../services/authApi";
import { saveSession } from "../../services/authService";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor completa todos los campos",
            });
            return;
        }

        try {
            setLoading(true);

            const { token, role } = await login(email, password);

            // Guardar token y rol
            saveSession(token, role);

            Swal.fire({
                icon: "success",
                title: "Bienvenido",
                text: "Inicio de sesión exitoso",
                timer: 1500,
                showConfirmButton: false,
            });

            setTimeout(() => {
                if (role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }, 1600);

        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Credenciales incorrectas",
                background: "#49464b",
                color: "#fffefc",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* CARD */}
            <div className="relative z-10 w-full max-w-md bg-zinc-900/90 border border-[#735CDB]/30 rounded-2xl p-8 shadow-[0_0_45px_#735CDB80]">
                <h1 className="text-3xl font-bold text-[#8b7cf0] text-center mb-6">
                    Iniciar sesión
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[#8b7cf0] mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg bg-zinc-900/40 border border-white-10 px-4 py-2 text-white focus:ring-2 focus:ring-[#735CDB] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[#8b7cf0] mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg bg-zinc-900/40 border border-white-10  px-4 py-2 text-white focus:ring-2 focus:ring-[#735CDB] focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-[#735CDB] to-[#8f7fff] text-white font-semibold transition shadow-[0_0_30px_#735CDB99] disabled:opacity-50"
                    >
                        {loading ? "Ingresando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}

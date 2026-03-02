import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/Versora.png";
import { login } from "../../services/authApi";
import { saveSession } from "../../services/authService";
import { Mail, Lock, LogIn, BookOpen, Shield, Award, Users } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor completa todos los campos",
                background: "#1f2937",
                color: "#fff",
                confirmButtonColor: "#735CDB",
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
                title: "¡Bienvenido a Versora!",
                text: "Inicio de sesión exitoso",
                timer: 1500,
                showConfirmButton: false,
                background: "#1f2937",
                color: "#fff",
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
                background: "#1f2937",
                color: "#fff",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            {/* Header simple */}
            <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Versora" className="w-10 h-10 rounded-full" />
                    <span className="text-2xl font-bold text-[#735CDB]">Versora</span>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    {/* Columna izquierda - Hero / Beneficios */}
                    <div className="hidden lg:block space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-linear-to-br from-[#735CDB] to-[#8f7fff] rounded-xl">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-white">
                                Bienvenido a <span className="text-[#8b7cf0]">Versora</span>
                            </h1>
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed">
                            "Lee más, cuando quieras, donde quieras". Accede a miles de libros digitales
                            y descubre un mundo de conocimiento y entretenimiento.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-[#735CDB]/20 rounded-lg">
                                    <Award className="w-6 h-6 text-[#8b7cf0]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Curaduría Especializada</h3>
                                    <p className="text-gray-400 text-sm">Selección cuidada de los mejores títulos</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-[#735CDB]/20 rounded-lg">
                                    <Shield className="w-6 h-6 text-[#8b7cf0]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Compra Segura</h3>
                                    <p className="text-gray-400 text-sm">Pagos protegidos y descarga inmediata</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-[#735CDB]/20 rounded-lg">
                                    <Users className="w-6 h-6 text-[#8b7cf0]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Comunidad Lectora</h3>
                                    <p className="text-gray-400 text-sm">Únete a miles de lectores como tú</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial rápido */}
                        <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700 mt-6">
                            <p className="text-gray-300 text-sm italic">
                                "Versora ha cambiado mi forma de leer. La curaduría es excelente y la experiencia de compra es muy fluida."
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                                <div className="w-8 h-8 bg-linear-to-br from-[#735CDB] to-[#8f7fff] rounded-full flex items-center justify-center text-white font-bold text-xs">
                                    MR
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">María Rodríguez</p>
                                    <p className="text-gray-500 text-xs">Lectora frecuente</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Formulario de Login */}
                    <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
                        {/* Logo móvil (solo visible en móvil) */}
                        <div className="lg:hidden flex justify-center mb-6">
                            <img src={logo} alt="Versora" className="w-16 h-16 rounded-full" />
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
                            {/* Header del formulario */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    Iniciar sesión
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Ingresa tus credenciales para acceder a tu biblioteca
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">
                                        Correo electrónico
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="tu@email.com"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#735CDB] focus:border-transparent transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#735CDB] focus:border-transparent transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                                        >
                                            {showPassword ? "Ocultar" : "Mostrar"}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        type="button"
                                        className="text-sm text-[#8b7cf0] hover:text-[#735CDB] transition"
                                        onClick={() => {
                                            Swal.fire({
                                                icon: "info",
                                                title: "Recuperar contraseña",
                                                text: "Funcionalidad próximamente disponible",
                                                background: "#1f2937",
                                                color: "#fff",
                                                confirmButtonColor: "#735CDB",
                                            });
                                        }}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-lg bg-linear-to-r from-[#735CDB] to-[#8f7fff] text-white font-semibold transition shadow-lg shadow-[#735CDB]/30 hover:from-[#8f7fff] hover:to-[#735CDB] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                            Ingresando...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-5 h-5" />
                                            Entrar a Versora
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Separador */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-800 text-gray-400">¿Nuevo en Versora?</span>
                                </div>
                            </div>

                            {/* Botón de registro */}
                            <Link
                                to="/user/register"
                                className="block w-full py-3 px-4 bg-transparent border border-[#735CDB] text-[#8b7cf0] rounded-lg hover:bg-[#735CDB]/10 transition text-center font-medium"
                            >
                                Crear una cuenta
                            </Link>

                            {/* Términos */}
                            <p className="text-xs text-gray-500 text-center mt-6">
                                Al iniciar sesión aceptas nuestros{" "}
                                <span className="text-[#8b7cf0] hover:underline cursor-pointer">
                                    Términos
                                </span>{" "}
                                y{" "}
                                <a href="/privacidad" className="text-[#8b7cf0] hover:underline">
                                    Política de Privacidad
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-800 mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Columna 1 - Logo y descripción */}
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-3">
                                <img src={logo} alt="Versora" className="w-8 h-8 rounded-full" />
                                <span className="text-xl font-bold text-[#735CDB]">Versora</span>
                            </div>
                        </div>

                        {/* Columna 2 - Enlaces rápidos */}
                        <div>
                            <h4 className="text-white font-semibold mb-2">Explorar</h4>
                            <ul className="space-y-2">
                                <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition">Inicio</Link></li>
                            </ul>
                        </div>

                        {/* Columna 3 - Soporte */}
                        <div>
                            <h4 className="text-white font-semibold mb-2">Soporte</h4>
                            <ul className="space-y-2">
                                <li><a href="/faq" className="text-gray-400 hover:text-white text-sm transition">FAQ y centro de ayuda</a></li>
                            </ul>
                        </div>

                        {/* Columna 4 - Legal */}
                        <div>
                            <h4 className="text-white font-semibold mb-2">Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="/privacidad" className="text-gray-400 hover:text-white text-sm transition">Política de privacidad</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-xs">
                            © 2026 Versora. Todos los derechos reservados.
                            "Lee más, cuando quieras, donde quieras"
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-500 hover:text-white transition">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.277-12.409c0-.212-.005-.424-.015-.636A9.935 9.935 0 0024 4.59z" /></svg>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
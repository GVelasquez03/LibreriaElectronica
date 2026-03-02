import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/Versora.png";
import { register } from "../../services/authApi";
import { sendVerificationEmail } from '../../services/emailService';
import { v4 as uuidv4 } from 'uuid';
import { Mail, Lock, User, Calendar, Globe, ChevronRight, Eye, EyeOff, Award, Shield, Users } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        nombreCompleto: "",
        fechaNacimiento: "",
        pais: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [verificationSent, setVerificationSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "Email inválido";
        }

        if (form.password.length < 6) {
            newErrors.password = "Mínimo 6 caracteres";
        }

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (!form.nombreCompleto.trim()) {
            newErrors.nombreCompleto = "Nombre completo requerido";
        }

        if (form.fechaNacimiento) {
            const fechaNacimiento = new Date(form.fechaNacimiento);
            const today = new Date();
            const age = today.getFullYear() - fechaNacimiento.getFullYear();

            if (age < 13) {
                newErrors.fechaNacimiento = "Debes tener al menos 13 años";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            Swal.fire({
                icon: "warning",
                title: "Errores en el formulario",
                text: "Por favor corrige los campos marcados",
                background: "#1f2937",
                color: "#fff",
                confirmButtonColor: "#735CDB",
            });
            return;
        }

        try {
            setLoading(true);

            const verificationToken = uuidv4();

            const { ...registerData } = form;
            await register({
                ...registerData,
                verificationToken,
                isVerified: false
            });

            const emailSent = await sendVerificationEmail(
                form.email,
                form.nombreCompleto,
                verificationToken
            );

            if (!emailSent) {
                throw new Error('No se pudo enviar el email de verificación');
            }

            setVerificationSent(true);
            setLoading(false);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setLoading(false);
            let errorMessage = "Error al registrar. Intenta nuevamente.";

            if (error.response?.status === 409) {
                errorMessage = "El email ya está registrado";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
                background: "#1f2937",
                color: "#fff",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    if (verificationSent) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
                <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Versora" className="w-10 h-10 rounded-full" />
                        <span className="text-2xl font-bold text-[#735CDB]">Versora</span>
                    </div>
                    <Link to="/" className="text-gray-300 hover:text-white transition flex items-center gap-1 text-sm">
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Volver al inicio
                    </Link>
                </header>

                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl text-center">
                        <div className="mb-6">
                            <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50">
                                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Verifica tu email</h2>
                            <p className="text-gray-300 mb-4">
                                Hemos enviado un enlace de verificación a:
                            </p>
                            <p className="text-[#8b7cf0] font-medium mb-6">{form.email}</p>
                            <div className="bg-gray-700/30 rounded-xl p-5 text-left border border-gray-600">
                                <p className="text-gray-300 mb-3 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-[#8b7cf0]" />
                                    Revisa tu bandeja de entrada
                                </p>
                                <p className="text-gray-300 mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#8b7cf0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    El enlace expira en 24 horas
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-3 rounded-lg bg-linear-to-r from-[#735CDB] to-[#8f7fff] text-white font-semibold hover:from-[#8f7fff] hover:to-[#735CDB] transition shadow-lg shadow-[#735CDB]/30"
                        >
                            Ir al inicio de sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            {/* Header */}
            <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-800">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Versora" className="w-10 h-10 rounded-full" />
                    <span className="text-2xl font-bold text-[#735CDB]">Versora</span>
                </Link>
                <Link to="/" className="text-gray-300 hover:text-white transition flex items-center gap-1 text-sm">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Volver al inicio
                </Link>
            </header>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    {/* Columna izquierda - Hero / Beneficios */}
                    <div className="hidden lg:block space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-linear-to-br from-[#735CDB] to-[#8f7fff] rounded-xl">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-white">
                                Únete a <span className="text-[#8b7cf0]">Versora</span>
                            </h1>
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed">
                            "Lee más, cuando quieras, donde quieras". Crea tu cuenta y descubre un mundo de conocimiento y entretenimiento.
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
                    </div>

                    {/* Columna derecha - Formulario */}
                    <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
                        <div className="lg:hidden flex justify-center mb-6">
                            <img src={logo} alt="Versora" className="w-16 h-16 rounded-full" />
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    Crear cuenta
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Completa tus datos para unirte a Versora
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Nombre Completo */}
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">
                                        Nombre completo *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="nombreCompleto"
                                            value={form.nombreCompleto}
                                            onChange={handleChange}
                                            placeholder="Juan Pérez"
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${errors.nombreCompleto ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#735CDB] focus:border-transparent transition`}
                                        />
                                    </div>
                                    {errors.nombreCompleto && (
                                        <p className="text-red-400 text-xs mt-1">{errors.nombreCompleto}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">
                                        Correo electrónico *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="tu@email.com"
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#735CDB] focus:border-transparent transition`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Contraseña */}
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">
                                        Contraseña *
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Mínimo 6 caracteres"
                                            className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#735CDB] focus:border-transparent transition`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirmar Contraseña */}
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">
                                        Confirmar contraseña *
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Repite tu contraseña"
                                            className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#735CDB] focus:border-transparent transition`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Fecha de Nacimiento */}
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">
                                        Fecha de nacimiento (opcional)
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="date"
                                            name="fechaNacimiento"
                                            value={form.fechaNacimiento}
                                            onChange={handleChange}
                                            max={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#735CDB] focus:border-transparent transition"
                                        />
                                    </div>
                                    {errors.fechaNacimiento && (
                                        <p className="text-red-400 text-xs mt-1">{errors.fechaNacimiento}</p>
                                    )}
                                </div>

                                {/* País */}
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">
                                        País/Región (opcional)
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        <select
                                            name="pais"
                                            value={form.pais}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#735CDB] focus:border-transparent transition appearance-none"
                                        >
                                            <option value="">Selecciona un país</option>
                                            <option value="AR">Argentina</option>
                                            <option value="BO">Bolivia</option>
                                            <option value="CL">Chile</option>
                                            <option value="CO">Colombia</option>
                                            <option value="CR">Costa Rica</option>
                                            <option value="CU">Cuba</option>
                                            <option value="DO">República Dominicana</option>
                                            <option value="EC">Ecuador</option>
                                            <option value="ES">España</option>
                                            <option value="GT">Guatemala</option>
                                            <option value="HN">Honduras</option>
                                            <option value="MX">México</option>
                                            <option value="NI">Nicaragua</option>
                                            <option value="PA">Panamá</option>
                                            <option value="PE">Perú</option>
                                            <option value="PR">Puerto Rico</option>
                                            <option value="PY">Paraguay</option>
                                            <option value="SV">El Salvador</option>
                                            <option value="UY">Uruguay</option>
                                            <option value="VE">Venezuela</option>
                                            <option value="US">Estados Unidos</option>
                                            <option value="OT">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-lg bg-linear-to-r from-[#735CDB] to-[#8f7fff] text-white font-semibold transition shadow-lg shadow-[#735CDB]/30 hover:from-[#8f7fff] hover:to-[#735CDB] disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                            Creando cuenta...
                                        </>
                                    ) : (
                                        "Crear cuenta"
                                    )}
                                </button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-800 text-gray-400">¿Ya tienes cuenta?</span>
                                </div>
                            </div>

                            <Link
                                to="/login"
                                className="block w-full py-3 px-4 bg-transparent border border-[#735CDB] text-[#8b7cf0] rounded-lg hover:bg-[#735CDB]/10 transition text-center font-medium"
                            >
                                Iniciar sesión
                            </Link>

                            <p className="text-xs text-gray-500 text-center mt-6">
                                Al registrarte aceptas nuestros{" "}
                                <a href="#" className="text-[#8b7cf0] hover:underline">
                                    Términos
                                </a>{" "}
                                y{" "}
                                <a href="#" className="text-[#8b7cf0] hover:underline">
                                    Política de Privacidad
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-800 mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <p className="text-center text-gray-500 text-xs">
                        © 2026 Versora. "Lee más, cuando quieras, donde quieras". Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
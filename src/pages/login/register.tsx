import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import bgImage from "../../assets/book.avif";
import { register } from "../../services/authApi"; // Necesitarás crear este servicio

import { sendVerificationEmail } from '../../services/emailService';
import { v4 as uuidv4 } from 'uuid'; // Para tokens

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Limpiar error del campo al escribir
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
            });
            return;
        }

        try {
            setLoading(true);

            // 1. Generar token de verificación
            const verificationToken = uuidv4();


            // 2. Guardar usuario en backend (con token)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...registerData } = form;
            await register({
                ...registerData,
                verificationToken,
                isVerified: false
            });

            // 3. SOLO si el registro fue exitoso, enviar email
            const emailSent = await sendVerificationEmail(
                form.email,
                form.nombreCompleto,
                verificationToken
            );

            if (!emailSent) {
                throw new Error('No se pudo enviar el email de verificación');
            }

            // 4. Mostrar pantalla de verificación (NO Swal)
            setVerificationSent(true);
            setLoading(false);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
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
                background: "#49464b",
                color: "#fffefc",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setLoading(false);
        }
    };

    // Si se envió el email de verificación
    if (verificationSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
                style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                <div className="relative z-10 w-full max-w-md bg-zinc-900/90 border border-[#735CDB]/30 rounded-2xl p-8 shadow-[0_0_45px_#735CDB80] text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verifica tu email</h2>
                        <p className="text-gray-300 mb-4">
                            Hemos enviado un enlace de verificación a:
                        </p>
                        <p className="text-[#8b7cf0] font-medium mb-6">{form.email}</p>
                        <div className="bg-gray-800/50 rounded-lg p-4 text-left text-sm">
                            <p className="text-gray-400 mb-2">📧 Revisa tu bandeja de entrada</p>
                            <p className="text-gray-400 mb-2">🗑️ Revisa la carpeta de spam</p>
                            <p className="text-gray-400">⏱️ El enlace expira en 24 horas</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#735CDB] to-[#8f7fff] text-white font-semibold"
                    >
                        Ir al inicio de sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center px-8"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* OVERLAY */}
            <div className="absolute inset-0 backdrop-blur-sm" />

            {/* CARD */}
            <div className="relative z-10 w-full max-w-lg bg-zinc-900/90 border border-[#735CDB]/30 rounded-2xl p-8 shadow-[0_0_45px_#735CDB80]">
                <h1 className="text-3xl font-bold text-[#8b7cf0] text-center mb-2">
                    Crear Cuenta
                </h1>
                <p className="text-gray-400 text-center text-sm mb-6">
                    Únete a nuestra comunidad de lectores
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Primera Fila: 2 columnas */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div >
                            <label className="block text-[#8b7cf0] mb-1 text-sm">
                                Nombre Completo *
                            </label>
                            <input
                                type="text"
                                name="nombreCompleto"
                                value={form.nombreCompleto}
                                onChange={handleChange}
                                placeholder="Juan Pérez"
                                className={`w-full rounded-lg bg-zinc-900/40 border ${errors.nombreCompleto ? 'border-red-500' : 'border-white/10'} px-4 py-2 text-white focus:ring-2 focus:ring-[#735CDB] focus:outline-none`}
                            />
                            {errors.nombreCompleto && (
                                <p className="text-red-400 text-xs mt-1">{errors.nombreCompleto}</p>
                            )}
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-[#8b7cf0] mb-1 text-sm">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                className={`w-full rounded-lg bg-zinc-900/40 border ${errors.email ? 'border-red-500' : 'border-white/10'} px-4 py-2 text-white focus:ring-2 focus:ring-[#735CDB] focus:outline-none`}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Segundo Fila: 2 columnas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Contraseña */}
                        <div>
                            <label className="block text-[#8b7cf0] mb-1 text-sm">
                                Contraseña *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                className={`w-full rounded-lg bg-zinc-900/40 border ${errors.password ? 'border-red-500' : 'border-white/10'} px-4 py-2 text-white focus:ring-2 focus:ring-[#735CDB] focus:outline-none`}
                            />
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirmar Contraseña */}
                        <div>
                            <label className="block text-[#8b7cf0] mb-1 text-sm">
                                Confirmar Contraseña *
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repite tu contraseña"
                                className={`w-full rounded-lg bg-zinc-900/40 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} px-4 py-2 text-white focus:ring-2 focus:ring-[#735CDB] focus:outline-none`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {/* Tercera Fila: 2 columnas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Fecha de Nacimiento */}
                        <div>
                            <label className="block text-[#8b7cf0] mb-1 text-sm">
                                Fecha de Nacimiento (Opcional)
                            </label>
                            <input
                                type="date"
                                name="fechaNacimiento"
                                value={form.fechaNacimiento}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                className={`w-full rounded-lg bg-zinc-900/40 border ${errors.fechaNacimiento ? 'border-red-500' : 'border-white/10'} px-4 py-2 text-white focus:ring-2 focus:ring-[#735CDB] focus:outline-none`}
                            />
                            {errors.fechaNacimiento && (
                                <p className="text-red-400 text-xs mt-1">{errors.fechaNacimiento}</p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">
                                Para personalizar tu experiencia de lectura
                            </p>
                        </div>

                        {/* País */}
                        <div>
                            <label className="block text-[#8b7cf0] mb-1 text-sm">
                                País/Región (Opcional)
                            </label>
                            <select
                                name="pais"
                                value={form.pais}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-zinc-900/40 border border-white/10 px-4 py-2 text-white focus:ring-2 focus:ring-[#735CDB] focus:outline-none"
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



                    {/* Botón de registro */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#735CDB] to-[#8f7fff] text-white font-semibold transition shadow-[0_0_30px_#735CDB99] hover:from-[#8f7fff] hover:to-[#735CDB] disabled:opacity-50 mt-4"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creando cuenta...
                            </span>
                        ) : (
                            "Crear Cuenta"
                        )}
                    </button>
                </form>

                {/* Enlace a login */}
                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <p className="text-gray-400 text-sm">
                        ¿Ya tienes una cuenta?{" "}
                        <Link
                            to="/login"
                            className="text-[#8b7cf0] hover:text-[#735CDB] font-medium transition"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>

                {/* Términos y condiciones */}
                <p className="text-gray-500 text-xs text-center mt-6">
                    Al registrarte, aceptas nuestros{" "}
                    <a href="#" className="text-[#8b7cf0] hover:underline">
                        Términos de Servicio
                    </a>{" "}
                    y{" "}
                    <a href="#" className="text-[#8b7cf0] hover:underline">
                        Política de Privacidad
                    </a>
                </p>
            </div>
        </div>
    );
}
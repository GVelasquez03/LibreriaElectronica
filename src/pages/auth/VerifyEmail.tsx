import { useState, useEffect } from "react";
import { useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import bgImage from "../../assets/book.avif";
import { verifyEmailToken } from "../../services/authApi";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading",);

    const [errorMessage, setErrorMessage] = useState("");
    const hasVerified = useRef(false);
    useEffect(() => {
        if (hasVerified.current) return; // 🔥 evita doble ejecución
        hasVerified.current = true;

        const token = searchParams.get("token");

        if (!token) {
            Promise.resolve().then(() => setStatus("error"));
            Promise.resolve().then(() => setErrorMessage("No se proporcionó token de verificación"));
            return;
        }

        console.log("🔍 Token URL (crudo):", token);

        verifyEmailToken(token)
            .then(() => {
                setStatus("success");
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: any) => {
                setStatus("error");

                setErrorMessage(error.response?.status === 400
                    ? "Token inválido o expirado"
                    : "Error al verificar el email"
                );
            });

    }, [searchParams, navigate]);

    // Ir a inicio de sesion
    const handleGoToLogin = () => {
        navigate("/login");
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Rendirizados segun el status */}

            <div className="relative z-10 w-full max-w-md bg-zinc-900/90 border border-[#735CDB]/30 rounded-2xl p-8 shadow-[0_0_45px_#735CDB80] text-center">
                {status === "loading" && (
                    <>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#735CDB]/20 flex items-center justify-center">
                            <Loader2 className="w-10 h-10 text-[#8b7cf0] animate-spin" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3">
                            Verificando tu email
                        </h2>

                        <p className="text-gray-400">
                            Por favor espera mientras verificamos tu cuenta...
                        </p>

                        <div className="mt-8 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-gradient-to-r from-[#735CDB] to-[#8f7fff] animate-pulse rounded-full"></div>
                        </div>
                    </>
                )}

                {/* Estado exitoso */}

                {status === "success" && (
                    <>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-900/30 border-2 border-green-500/50 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3">
                            ¡Email verificado!
                        </h2>

                        <p className="text-gray-300 mb-2">
                            Tu cuenta ha sido activada exitosamente.
                        </p>

                        <p className="text-gray-400 text-sm mb-8">
                            Ya puedes iniciar sesión y comenzar a comprar libros.
                        </p>

                        <button
                            onClick={handleGoToLogin}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#735CDB] to-[#8f7fff] text-white font-semibold hover:from-[#8f7fff] hover:to-[#735CDB] transition shadow-lg shadow-[#735CDB]/30"
                        >
                            Ir al inicio de sesión
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-900/30 border-2 border-red-500/50 flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-red-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3">
                            Error de verificación
                        </h2>

                        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                            <p className="text-red-300 font-medium">
                                {errorMessage ||
                                    "El enlace de verificación es inválido o ha expirado"}
                            </p>
                        </div>

                        <p className="text-gray-400 text-sm mb-6">
                            Si necesitas un nuevo enlace de verificación, regístrate
                            nuevamente o contacta a soporte.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={handleGoToLogin}
                                className="w-full py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition border border-gray-600"
                            >
                                Ir al inicio de sesión
                            </button>

                            <Link
                                to="/user/register"
                                className="block w-full py-3 rounded-lg bg-gradient-to-r from-[#735CDB] to-[#8f7fff] text-white font-semibold hover:from-[#8f7fff] hover:to-[#735CDB] transition shadow-lg shadow-[#735CDB]/30"
                            >
                                Crear nueva cuenta
                            </Link>
                        </div>
                    </>
                )}

                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-gray-500 text-xs">
                        ¿Tienes problemas?{" "}
                        <a href="#" className="text-[#8b7cf0] hover:underline">
                            Contacta a soporte
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

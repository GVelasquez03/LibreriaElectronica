import { Link } from "react-router-dom";
import logo from "../../assets/Versora.png";
import { Shield, Mail, Lock, Eye, Download, ChevronRight } from "lucide-react";

export default function Privacidad() {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            {/* Header */}
            <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-800">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Versora" className="w-10 h-10 rounded-full" />
                    <span className="text-2xl font-bold text-[#735CDB]">Versora</span>
                </Link>
                <Link to="/login" className="text-gray-300 hover:text-white transition flex items-center gap-1 text-sm">
                    Volver al inicio
                </Link>
            </header>

            {/* Contenido */}
            <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
                <div className="text-center mb-10">
                    <div className="inline-block p-3 bg-[#735CDB]/20 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-[#8b7cf0]" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Política de <span className="text-[#8b7cf0]">Privacidad</span>
                    </h1>
                    <p className="text-gray-400">Última actualización: Febrero 2026</p>
                </div>

                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 space-y-6">

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Mail className="w-5 h-5 text-[#8b7cf0]" />
                            Datos que recopilamos
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            En Versora recopilamos únicamente la información necesaria para procesar tus compras y mejorar tu experiencia: nombre, correo electrónico y datos de pago. No almacenamos información sensible de tus métodos de pago.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Lock className="w-5 h-5 text-[#8b7cf0]" />
                            Uso de la información
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Tus datos se utilizan para: procesar tus pedidos, enviarte los libros adquiridos, notificarte sobre novedades (si aceptaste) y mejorar nuestros servicios. Nunca compartimos tu información con terceros sin tu consentimiento.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Eye className="w-5 h-5 text-[#8b7cf0]" />
                            Protección de datos
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Implementamos medidas de seguridad como cifrado SSL/TLS de 256 bits, tokens de descarga temporales y acceso restringido a tu información. Tus contraseñas están encriptadas y ni siquiera nosotros podemos verlas.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Download className="w-5 h-5 text-[#8b7cf0]" />
                            Tus derechos
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Puedes solicitar en cualquier momento: acceder a tus datos, corregirlos, eliminarlos o exportarlos. Para ejercer estos derechos, escríbenos a privacidad@versora.com. Respondemos en máximo 48 horas.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#8b7cf0]" />
                            Cookies y navegación
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Usamos cookies esenciales para el funcionamiento de la plataforma. No utilizamos cookies de rastreo invasivas. Puedes deshabilitarlas desde tu navegador, aunque algunas funciones podrían verse afectadas.
                        </p>
                    </div>

                    <div className="bg-[#735CDB]/10 rounded-xl p-5 border border-[#735CDB]/30 mt-6">
                        <p className="text-gray-300 text-sm">
                            <span className="text-[#8b7cf0] font-semibold">📧 Contacto:</span> Para consultas sobre privacidad, escríbenos a privacidad@versora.com o utiliza nuestro formulario de contacto.
                        </p>
                    </div>

                    <div className="pt-4 text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-[#8b7cf0] hover:text-white transition">
                            <ChevronRight className="w-4 h-4 rotate-180" />
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer simple */}
            <footer className="border-t border-gray-800 mt-8">
                <div className="max-w-3xl mx-auto px-4 py-6 text-center">
                    <p className="text-gray-500 text-xs">
                        © 2026 Versora. "Lee más, cuando quieras, donde quieras". Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
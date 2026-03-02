import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, BookOpen, CreditCard, Download, Shield, HelpCircle, Mail, MessageCircle } from "lucide-react";
import logo from "../../assets/Versora.png";

interface FAQItem {
    question: string;
    answer: string;
    category: "general" | "compra" | "lectura" | "cuenta";
}

export default function FAQ() {
    const [openItems, setOpenItems] = useState<number[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("todas");

    const faqs: FAQItem[] = [
        // Generales
        {
            question: "¿Qué es Versora?",
            answer: "Versora es una librería digital especializada en la venta de libros electrónicos (e-books). Nuestra misión es facilitar el acceso a la lectura digital mediante una plataforma segura, intuitiva y accesible, ofreciendo un catálogo variado de libros para diferentes públicos, intereses y niveles de formación.",
            category: "general"
        },
        {
            question: "¿Necesito una suscripción para comprar en Versora?",
            answer: "No, en Versora no trabajamos con suscripciones obligatorias. Puedes comprar únicamente los libros que te interesen, pagando solo por lo que deseas leer. Creemos en la libertad del lector para elegir sin compromisos mensuales.",
            category: "general"
        },
        {
            question: "¿En qué formatos están disponibles los libros?",
            answer: "Actualmente ofrecemos nuestros libros en formato PDF optimizado, garantizando una excelente experiencia de lectura en todos tus dispositivos. Este formato es compatible con computadoras, tablets, smartphones y la mayoría de lectores de e-books.",
            category: "general"
        },

        // Compra
        {
            question: "¿Cómo funciona el proceso de compra?",
            answer: "El proceso es muy sencillo: 1) Explora nuestro catálogo y selecciona el libro que deseas. 2) Haz clic en 'Comprar' y serás redirigido a la página de pago. 3) Elige tu método de pago preferido. 4) Una vez confirmado el pago, recibirás un enlace de descarga temporal en tu correo electrónico y podrás acceder inmediatamente al libro desde nuestra plataforma.",
            category: "compra"
        },
        {
            question: "¿Qué métodos de pago aceptan?",
            answer: "Aceptamos múltiples métodos de pago para tu comodidad: transferencias bancarias, pago móvil (para Venezuela), tarjetas de crédito/débito a través de nuestra pasarela segura, y PayPal para clientes internacionales. Todos los pagos están protegidos con cifrado de 256 bits.",
            category: "compra"
        },
        {
            question: "¿Puedo comprar libros para regalar?",
            answer: "¡Por supuesto! Durante el proceso de compra, puedes indicar que es un regalo. El destinatario recibirá un correo personalizado con el enlace de descarga y podrá acceder al libro en su propia cuenta de Versora.",
            category: "compra"
        },
        {
            question: "¿Ofrecen descuentos por compras al por mayor?",
            answer: "Sí, contamos con paquetes temáticos y colecciones completas con descuentos especiales. También ofrecemos promociones temporales y descuentos por volumen. Síguenos en redes sociales para estar al tanto de nuestras ofertas.",
            category: "compra"
        },

        // Lectura
        {
            question: "¿Cómo puedo leer los libros después de comprarlos?",
            answer: "Una vez realizada la compra, podrás descargar el archivo PDF directamente desde nuestra plataforma o desde el enlace enviado a tu correo. Puedes leerlo en cualquier dispositivo: computadora (con programas como Adobe Acrobat), tablet, smartphone o en tu lector de e-books favorito.",
            category: "lectura"
        },
        {
            question: "¿Puedo leer mis libros en varios dispositivos?",
            answer: "¡Claro que sí! Nuestra política de DRM social te permite descargar y leer tus libros en todos tus dispositivos personales. El archivo incluye una marca de agua con tus datos para proteger tus derechos, pero sin limitar tu experiencia de lectura.",
            category: "lectura"
        },
        {
            question: "¿Qué hago si el archivo presenta problemas de lectura?",
            answer: "Si encuentras algún problema con tu archivo (errores de formato, páginas faltantes, etc.), contáctanos inmediatamente a través de nuestro centro de soporte. Revisaremos el caso y te enviaremos una copia corregida en un plazo máximo de 24 horas.",
            category: "lectura"
        },
        {
            question: "¿Los libros tienen DRM que limite su uso?",
            answer: "Utilizamos un sistema de DRM social (marca de agua digital) que inserta tus datos de compra en el archivo, pero no restringe su uso. Puedes leer tus libros en cualquier dispositivo, hacer copias de respaldo y disfrutar de tu compra sin limitaciones técnicas, siempre para uso personal.",
            category: "lectura"
        },

        // Cuenta
        {
            question: "¿Cómo creo una cuenta en Versora?",
            answer: "Crear una cuenta es muy sencillo: haz clic en 'Registrarse', completa el formulario con tu nombre, correo electrónico y una contraseña segura. Recibirás un correo de verificación; una vez confirmado, podrás acceder a tu biblioteca personal y comenzar a comprar.",
            category: "cuenta"
        },
        {
            question: "Olvidé mi contraseña, ¿cómo la recupero?",
            answer: "En la página de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?'. Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla. Si no recibes el correo, revisa tu bandeja de spam o contáctanos para ayudarte.",
            category: "cuenta"
        },
        {
            question: "¿Puedo ver mi historial de compras?",
            answer: "Sí, una vez que inicies sesión en tu cuenta, podrás acceder a la sección 'Mis compras' donde encontrarás el historial completo de tus transacciones, con acceso a los libros adquiridos y la opción de volver a descargarlos si es necesario.",
            category: "cuenta"
        },
        {
            question: "¿Cómo actualizo mi información personal?",
            answer: "Dentro de tu cuenta, en la sección 'Configuración' o 'Mi perfil', puedes editar tu información personal, cambiar tu contraseña y actualizar tus preferencias de comunicación.",
            category: "cuenta"
        }
    ];

    const categories = [
        { id: "todas", name: "Todas", icon: HelpCircle },
        { id: "general", name: "Generales", icon: BookOpen },
        { id: "compra", name: "Compras", icon: CreditCard },
        { id: "lectura", name: "Lectura", icon: Download },
        { id: "cuenta", name: "Mi cuenta", icon: Shield },
    ];

    const toggleItem = (index: number) => {
        setOpenItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const filteredFaqs = activeCategory === "todas"
        ? faqs
        : faqs.filter(faq => faq.category === activeCategory);

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            {/* Header simple */}
            <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-800">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Versora" className="w-10 h-10 rounded-full" />
                    <span className="text-2xl font-bold text-[#735CDB]">Versora</span>
                </Link>
                <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition flex items-center gap-1 text-sm"
                >
                    Volver al inicio
                </Link>
            </header>

            {/* Contenido principal */}
            <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                {/* Título */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Preguntas <span className="text-[#8b7cf0]">Frecuentes</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Encuentra respuestas a las dudas más comunes sobre Versora.
                        Si no encuentras lo que buscas, contáctanos directamente.
                    </p>
                </div>

                {/* Categorías */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${activeCategory === cat.id
                                        ? 'bg-linear-to-r from-[#735CDB] to-[#8f7fff] text-white shadow-lg shadow-[#735CDB]/30'
                                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.name}
                            </button>
                        );
                    })}
                </div>

                {/* Lista de FAQs */}
                <div className="space-y-4">
                    {filteredFaqs.map((faq, index) => {
                        const originalIndex = faqs.findIndex(f => f.question === faq.question);
                        return (
                            <div
                                key={index}
                                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-[#735CDB]/50"
                            >
                                <button
                                    onClick={() => toggleItem(originalIndex)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/20 transition-colors"
                                >
                                    <span className="text-white font-medium pr-8">{faq.question}</span>
                                    {openItems.includes(originalIndex) ? (
                                        <ChevronUp className="w-5 h-5 text-[#8b7cf0] shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                                    )}
                                </button>

                                {openItems.includes(originalIndex) && (
                                    <div className="px-6 pb-4 text-gray-300 leading-relaxed border-t border-gray-700/50 pt-4">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Contacto adicional */}
                <div className="mt-16 bg-linear-to-br from-[#735CDB]/10 to-[#8f7fff]/5 rounded-2xl p-8 border border-[#735CDB]/30">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            ¿No encuentras lo que buscas?
                        </h2>
                        <p className="text-gray-400">
                            Estamos aquí para ayudarte. Contáctanos directamente y te responderemos a la brevedad.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <a
                            href="mailto:soporte@versora.com"
                            className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-[#735CDB] transition group"
                        >
                            <div className="p-3 bg-[#735CDB]/20 rounded-lg group-hover:bg-[#735CDB]/30 transition">
                                <Mail className="w-6 h-6 text-[#8b7cf0]" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Correo electrónico</p>
                                <p className="text-gray-400 text-sm">soporte@versora.com</p>
                            </div>
                        </a>

                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                // Aquí iría la lógica para abrir chat
                            }}
                            className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-[#735CDB] transition group"
                        >
                            <div className="p-3 bg-[#735CDB]/20 rounded-lg group-hover:bg-[#735CDB]/30 transition">
                                <MessageCircle className="w-6 h-6 text-[#8b7cf0]" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Chat en vivo</p>
                                <p className="text-gray-400 text-sm">Disponible de 9am a 6pm</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Footer simple */}
                <footer className="mt-16 pt-8 border-t border-gray-800">
                    <p className="text-center text-gray-500 text-sm">
                        © 2026 Versora. "Lee más, cuando quieras, donde quieras".
                        <Link to="/login" className="text-[#8b7cf0] hover:underline ml-1">
                            Volver al inicio
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}
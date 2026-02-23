import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { BookRequest } from "../../types/book";
import { getBookById } from "../../services/bookService";
import { getAllCategories } from "../../services/CategoryService";
import { ArrowLeft, BookOpen, User, DollarSign, Tag, ShoppingCart, Lock, Maximize2 } from "lucide-react";
import type { Categoria } from "../../types/categoria";
import Swal from "sweetalert2";
import { createOrden, getUsuarioByEmail } from "../../services/ordenService";
import { getCurrentUser} from '../../services/authApi';
import { isAuthenticated } from "../../services/authService";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookRequest, setBook] = useState<BookRequest | null>(null);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [, setPdfError] = useState(false);
  const [, setPdfLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [bookData, categoriesData] = await Promise.all([
          getBookById(Number(id)),
          getAllCategories()
        ]);

        setBook(bookData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // OBTENER NOMBRE DE LA CATEGORIA
  const getCategoriaName = () => {
    if (!bookRequest) return "Sin categoría";
    const category = categories.find(c => c.id === bookRequest.category.id);
    return category?.name || `ID: ${bookRequest.category.name}`;
  };

  // URL DEL PDF CON PARAMETROS PARA VISTA PREVIA RESTRINGIDA 
  const getRestrictedPdfUrl = () => {
    if (!bookRequest?.pdfFilename) return "";
    // Parámetros que ocultan TODOS los controles
    return `http://localhost:8080/api/books/pdf/preview/${bookRequest.pdfFilename}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=FitH&page=1`;
  };

  // FUNCION PARA ABRIR EL PDF EN PANTALLA COMPLETA
  const openFullscreenPdf = () => {
    if (!bookRequest?.pdfFilename) return;
    const fullscreenUrl = `http://localhost:8080/api/books/pdf/preview/${bookRequest.pdfFilename}#toolbar=0&navpanes=0`;
    window.open(fullscreenUrl, '_blank', 'noopener,noreferrer');
  };

  // BLOQUEAR ATAJOS DEL TECLADO
  useEffect(() => {
    const preventKeyEvents = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) &&
        (e.key === 's' || e.key === 'p' || e.key === 'c')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', preventKeyEvents);
    return () => document.removeEventListener('keydown', preventKeyEvents);
  }, []);

  // ESTADO CARGANDO....
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Cargando libro...</p>
        </div>
      </div>
    );
  }

  // SI EL LIBRO NO EXISTE
  if (!bookRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Libro no encontrado</h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // NUEVA FUNCIONALIDAD PARA IMPLEMENTAR ORDEN DE COMPRA DE UN LIBRO
  const handleComprar = async () => {
    try {

      if (!isAuthenticated()) {
        Swal.fire({
          icon: "warning",
          title: "Inicia sesión",
          text: "Debes iniciar sesión para comprar",
          confirmButtonColor: "#735CDB",
          background: "#1f2937",
          color: "#fff",
        }).then(() => navigate("/login"));
        return;
      }

      // OBTENER DATOS DEL USUARIO ACTUAL ATRAVES DEL TOKEN
      const usuario = getCurrentUser(); 
    
      // OBTENER DATOS COMPLETOS DEL USUARIO PARA LA ORDEN
      if(usuario?.email){
        const userData = await getUsuarioByEmail(usuario.email);

        console.log("Datos del Usuario:", userData);

        // CREAR ORDEN
          const ordenData = {
            idUsuario: userData.id,
            idLibro: bookRequest.id,
            idMetodoPago: 1, // Por defecto o seleccionado
            montoTotal: bookRequest.price
          };
          console.log("orden Data:", ordenData);
          await createOrden(ordenData);

          Swal.fire({
          icon: "success",
          title: "¡Compra realizada!",
          text: "Tu orden ha sido creada exitosamente",
          timer: 2000,
          showConfirmButton: false,
          });
      }else{
        console.log("El email no existe o no ha iniciado sesion");
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo procesar la compra:"+ error,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Botón de volver */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 mb-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Columna 1: Portada y acciones */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Portada */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="w-72 h-96 md:w-80 md:h-[28rem] bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl overflow-hidden shadow-2xl">
                      <img
                        src={bookRequest.cover}
                        alt={bookRequest.title}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
                      />
                    </div>
                    {bookRequest.pdfFilename && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        <span className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm rounded-full border border-green-700/50 shadow-lg">
                          DISPONIBLE
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Apartado precio */}
                  <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 rounded-xl p-2 px-6 border border-orange-700/30 w-full max-w-xs">
                    <p className="text-gray-300 text-sm mb-2">Precio de venta</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-orange-400" />
                        <span className="text-2xl font-bold text-white">
                          ${bookRequest.price.toFixed(2)}
                        </span>
                      </div>
                      <button onClick={handleComprar} className="px-5 ml-2 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white
                       rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold shadow-lg
                        shadow-orange-500/20 flex items-center gap-2" >
                          
                        <ShoppingCart className="w-5 h-5" />
                        Comprar
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs mt-2 text-center">
                      Incluye PDF descargable después de la compra
                    </p>
                  </div>
                </div>

                {/* Información del libro */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {bookRequest.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-300 mb-4">
                      <User className="w-4 h-4" />
                      <span className="text-lg">{bookRequest.author}</span>
                    </div>
                  </div>

                  {/* Categoría */}
                  <div className="flex items-center gap-3 bg-gray-700/30 rounded-lg p-3 border border-gray-600">
                    <Tag className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-xs">Categoría</p>
                      <p className="text-white font-medium">
                        {getCategoriaName()}
                      </p>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Descripción</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed font-['Open_Sans']">
                      {bookRequest.description || "Este libro no tiene descripción disponible."}
                    </p>
                  </div>

                  {/* Nota sobre acceso PDF */}
                  {bookRequest.pdfFilename && (
                    <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl p-6 border border-blue-700/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Lock className="w-5 h-5 text-blue-400" />
                        <h4 className="text-lg font-semibold text-white">Acceso al contenido digital</h4>
                      </div>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                          <span>Vista previa gratuita de las primeras 2 páginas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                          <span>Acceso completo al PDF después de la compra</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                          <span>Descarga ilimitada sin DRM</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna 2: Vista Previa PDF AUTOMÁTICA */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-2xl h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Vista Previa Gratuita</h3>
                  <p className="text-gray-400 text-sm">Primeras 2 páginas - Compra para continuar</p>
                </div>
              </div>

              {bookRequest.pdfFilename ? (
                <div className="space-y-4">
                  {/* Contenedor del PDF con restricciones */}
                  <div className="bg-gray-900 rounded-lg border-2 border-purple-700/50 overflow-hidden relative pdf-container">

                    {/* Iframe del PDF */}
                    <div className="aspect-[3/4] relative">
                      {/* Contenedor para ocultar bordes */}
                      <div className="absolute inset-0 overflow-hidden">
                        <iframe
                          ref={iframeRef}
                          src={getRestrictedPdfUrl()}
                          title={`Vista previa - ${bookRequest.title}`}
                          className="w-full h-full scale-110 -translate-y-8"
                          style={{
                            border: 'none',
                            pointerEvents: 'none'
                          }}
                          onLoad={() => {
                            console.log("PDF preview cargado");
                            setPdfLoaded(true);
                          }}
                          onError={() => {
                            console.error("Error cargando PDF preview");
                            setPdfError(true);
                          }}
                        />
                      </div>

                      {/* Overlay que bloquea interacción */}
                      <div
                        className="absolute inset-0 z-20"
                        onContextMenu={(e) => e.preventDefault()}
                        onClick={(e) => e.preventDefault()}
                        style={{
                          cursor: 'not-allowed',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                          userSelect: 'none'
                        }}
                      />

                      {/* Botón para pantalla completa */}
                      <button
                        onClick={openFullscreenPdf}
                        className="absolute top-4 right-4 z-30 p-2 bg-gray-800/80 hover:bg-gray-700/90 rounded-full backdrop-blur-sm"
                        title="Ver en pantalla completa"
                      >
                        <Maximize2 className="w-4 h-4 text-white" />
                      </button>

                      {/* Overlay de restricción visual */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent h-32 z-10 flex items-end justify-center p-4">
                        <div className="text-center bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-purple-700/30">
                          <Lock className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                          <p className="text-white text-sm font-medium">
                            Contenido restringido
                          </p>
                          <p className="text-gray-400 text-xs">
                            Compra para acceder al PDF completo
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Controles inferiores */}
                    <div className="flex justify-between items-center p-3 bg-gray-800/50">
                      <span className="text-gray-400 text-sm">
                        Mostrando página 1 de 2
                      </span>
                      <button
                        onClick={openFullscreenPdf}
                        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                      >
                        <Maximize2 className="w-3 h-3" />
                        Pantalla completa
                      </button>
                    </div>
                  </div>

                  {/* Indicador de páginas */}
                  <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Páginas visibles</p>
                      <p className="text-white font-bold">2</p>
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Formato</p>
                      <p className="text-white font-bold">PDF</p>
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Acceso</p>
                      <p className="text-yellow-400 font-bold">Limitado</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-700">
                  <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-white mb-2">Este libro no incluye versión digital</p>
                  <p className="text-gray-400 text-sm">
                    Solo disponible en formato físico
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
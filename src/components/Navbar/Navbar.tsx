import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../assets/Versora.png";
import { isAuthenticated, logout } from "../../services/authService";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../services/CategoryService";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "";
  const searchQuery = searchParams.get("search") ?? "";

  const [categories, setCategories] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      const categoryNames = data.map((c) => c.name);
      setCategories(categoryNames);
    };
    fetchCategories();
  }, []);

  // Sincronizar searchTerm cuando cambia la URL
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará",
      icon: "warning",
      background: "#49464b",
      color: "#fffefc",
      showCancelButton: true,
      confirmButtonColor: "#735CDB",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      logout();
      await Swal.fire({
        title: "Sesión cerrada",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
      navigate("/login");
    }
  };

  const handleCategoryChange = (value: string) => {
    setMobileMenuOpen(false);
    const params = new URLSearchParams();
    if (value) params.set("category", value);
    if (searchTerm) params.set("search", searchTerm);
    navigate(isAdmin ? `/admin?${params.toString()}` : `/?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    navigate(isAdmin ? `/admin?${params.toString()}` : `/?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#181d27] text-white">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <div
          onClick={() => navigate(isAdmin ? "/admin" : "/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={logo}
            alt="Versora logo"
            className="w-12 h-12 rounded-full scale-125 transform-origin-center"
          />
          <span className="text-2xl font-bold text-[#735CDB]">Versora</span>
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        

        {/* Navegación desktop */}
        <div className="hidden md:flex items-center gap-6">
          {!isAdmin ? (
            // Vista usuario normal
            <>
              <span
                className="nav-link cursor-pointer px-4 py-2 transition-all duration-300 hover:bg-[#735CDB]/20 hover:scale-105"
                onClick={() => navigate("/")}
              >
                Inicio
              </span>
              <span
                className="nav-link cursor-pointer px-4 py-2 transition-all duration-300 hover:bg-[#735CDB]/20 hover:scale-105"
                onClick={() => navigate("/mis-compras")}
              >
                Mis compras
              </span>

              <div className="relative group">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="bg-transparent px-4 py-2 text-white cursor-pointer hover:border-[#735CDB] transition-all duration-300 hover:bg-[#735CDB]/20 appearance-none pr-10"
                >
                  <option value="" className="bg-gray-800">Categorías</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-800">
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#735CDB] transition-colors">
                  
                </div>
              </div>
            </>
          ) : (
            // Vista admin
            <>
              <span
                className="nav-link cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#735CDB]/20 hover:shadow-lg hover:shadow-[#735CDB]/30 hover:scale-105"
                onClick={() => navigate("/admin")}
              >
                Inicio
              </span>
              <span
                className="nav-link cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#735CDB]/20 hover:shadow-lg hover:shadow-[#735CDB]/30 hover:scale-105"
                onClick={() => navigate("/admin/add")}
              >
                Nuevo libro
              </span>
              <span
                className="nav-link cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#735CDB]/20 hover:shadow-lg hover:shadow-[#735CDB]/30 hover:scale-105"
                onClick={() => navigate("/admin/categories")}
              >
                Nueva categoría
              </span>
              <span
                className="nav-link cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#735CDB]/20 hover:shadow-lg hover:shadow-[#735CDB]/30 hover:scale-105"
                onClick={() => navigate("/admin/metodos-pago")}
              >
                Métodos de pago
              </span>
              <span
                className="nav-link cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#735CDB]/20 hover:shadow-lg hover:shadow-[#735CDB]/30 hover:scale-105"
                onClick={() => navigate("/admin/ordenes")}
              >
                Gestión de Órdenes
              </span>
            </>
          )}
        </div>

        {/* Buscador desktop (visible en todas las vistas) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar libros por título o autor..."
                className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#735CDB] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    const params = new URLSearchParams();
                    if (selectedCategory) params.set("category", selectedCategory);
                    navigate(isAdmin ? `/admin?${params.toString()}` : `/?${params.toString()}`);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Botón cerrar sesión desktop */}
        {isAuthenticated() && (
          <button
            onClick={handleLogout}
            className="hidden md:block border border-[#735CDB] text-[#735CDB] px-3 py-1.5 rounded hover:bg-[#735CDB] hover:text-white transition"
          >
            Cerrar Sesión
          </button>
        )}
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181d27] border-t border-gray-700 py-4 px-4">
          <div className="flex flex-col gap-3">
            {/* Buscador móvil */}
            <form onSubmit={handleSearch} className="w-full mb-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar libros..."
                  className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            {!isAdmin ? (
              // Menú móvil usuario
              <>
                <span
                  className="nav-link cursor-pointer py-2"
                  onClick={() => {
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                >
                  Inicio
                </span>
                <span
                  className="nav-link cursor-pointer py-2"
                  onClick={() => {
                    navigate("/mis-compras");
                    setMobileMenuOpen(false);
                  }}
                >
                  Mis compras
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white cursor-pointer"
                >
                  <option value="">Categorías</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </>
            ) : (
              // Menú móvil admin
              <>
                <span
                  className="nav-link cursor-pointer py-2"
                  onClick={() => {
                    navigate("/admin");
                    setMobileMenuOpen(false);
                  }}
                >
                  Inicio
                </span>
                <span
                  className="nav-link cursor-pointer py-2"
                  onClick={() => {
                    navigate("/admin/add");
                    setMobileMenuOpen(false);
                  }}
                >
                  Nuevo libro
                </span>
                <span
                  className="nav-link cursor-pointer py-2"
                  onClick={() => {
                    navigate("/admin/categories");
                    setMobileMenuOpen(false);
                  }}
                >
                  Nueva categoría
                </span>
                <span
                  className="nav-link cursor-pointer py-2"
                  onClick={() => {
                    navigate("/admin/metodos-pago");
                    setMobileMenuOpen(false);
                  }}
                >
                  Métodos de pago
                </span>
                <span
                  className="nav-link cursor-pointer py-2"
                  onClick={() => {
                    navigate("/admin/ordenes");
                    setMobileMenuOpen(false);
                  }}
                >
                  Gestión de Órdenes
                </span>
              </>
            )}

            {isAuthenticated() && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="border border-[#735CDB] text-[#735CDB] px-3 py-2 rounded hover:bg-[#735CDB] hover:text-white transition mt-2"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
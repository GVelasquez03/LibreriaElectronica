import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./Navbar.css";
import { isAuthenticated, logout } from "../../services/authService";
import Swal from "sweetalert2";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = location.pathname.startsWith("/admin");

  // HOOKS CATEGORIA
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "Todas";

  //CATEGORIAS LOCALES
  const categories = [
    "Todas",
    "Terror",
    "Fantasía",
    "Romance",
    "Ciencia Ficción",
  ];


  /// PARA MANEJAR EL CERRA SESION
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

  /// PARA MANEJAR EL FILTRO POR CATEGORIA
  const handleCategoryChange = (value: string) => {
    if (value === "Todas") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: value });
    }

    navigate("/"); // siempre vuelve al Home
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem 1.5rem",
        background: "#181d27ff",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/*LOGO DE LA PAGINA*/}
      <p
        style={{
          fontSize: "1.3rem",
          color: "#735CDB",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={() => navigate(isAdmin ? "/admin" : "/")}
      >
        Versora
      </p>

      {/* MENÚ */}
      {!isAdmin && (
        <div style={{ display: "flex", gap: "1rem", marginLeft: "3rem", cursor: "pointer" }}>

          {/* INICIO NAVBAR */}
          <span className="nav-link" onClick={() => navigate("/")}>
            Inicio
          </span>

          {/* CATEGORIA FILTRO NAVBAR*/}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid #735CDB",
              borderRadius: "5px",
              padding: "0.35rem 0.9rem",
              cursor: "pointer",
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} style={{ color: "black" }}>
                {cat}
              </option>
            ))}
          </select>

          {/* FILTRADO POR POPULARIDAD */}
          <span className="nav-link">Popular</span>
        </div>
      )}

      {isAdmin && (
        <div style={{ display: "flex", gap: "1rem", marginLeft: "3rem", cursor: "pointer" }}>
          <span className="nav-link" onClick={() => navigate("/admin")}>
            Inicio
          </span>
          <span className="nav-link" onClick={() => navigate("/admin/add")}>
            Agregar
          </span>
        </div>
      )}

      {/* LOGOUT */}
      {isAuthenticated() && (
        <button
          onClick={handleLogout}
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "1px solid #735CDB",
            color: "#735CDB",
            padding: "0.35rem 0.9rem",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cerrar Sesion
        </button>
      )}
    </nav>
  );
}

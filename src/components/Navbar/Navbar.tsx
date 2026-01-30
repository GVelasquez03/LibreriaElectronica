import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./Navbar.css";
import { isAuthenticated, logout } from "../../services/authService";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../services/CategoryService";

export default function Navbar() {

  // NAVEGACION Y PARAMETROS
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");

  // LEEMOS los params para que el Select sepa qué mostrar
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "";

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      // Mapeamos solo el nombre porque tu lógica actual usa strings
      const categoryNames = data.map((c) => c.name);
      setCategories(categoryNames);
    };

    fetchCategories();
  }, []);

  // METODO PARA CERRAR SESION
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

  // METODO PARA MANEJAR EL CAMBIO DE CATEGORIA
  const handleCategoryChange = (value: string) => {
    if (value === "") {
      navigate("/");
    } else {
      navigate(`/?category=${value}`);
    }
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
      <p
        style={{ fontSize: "1.3rem", color: "#735CDB", fontWeight: "bold", cursor: "pointer" }}
        onClick={() => navigate(isAdmin ? "/admin" : "/")}
      >
        Versora
      </p>

      {!isAdmin && (
        <div style={{ display: "flex", gap: "1rem", marginLeft: "3rem", cursor: "pointer" }}>
          <span className="nav-link" onClick={() => navigate("/")}>
            Inicio
          </span>

          <select
            value={selectedCategory} // Esto se conecta con lo que lee el hook arriba
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

            {/* Opción para limpiar filtro */}
            <option value="" style={{ color: "black" }}>
              Categorias
            </option>

            {categories.map((cat) => (
              <option key={cat} value={cat} style={{ color: "black" }}>
                {cat}
              </option>
            ))}
          </select>

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
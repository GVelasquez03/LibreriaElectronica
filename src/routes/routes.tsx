import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";

// RUTAS PUBLICAS ACCESO TOTAL
import Login from "../pages/login/login";
import Home from "../pages/book/Home";
import BookDetail from "../pages/book/BookDetail";
import NotFound from "../pages/book/NotFound";

// ✅ Admin Layout y páginas
import AdminLayout from "../layouts/AdminLayout";
import AdminHome from "../pages/admin/AdminHome";
import AdminAdd from "../pages/admin/AdminAdd";
import AdminEdit from "../pages/admin/AdminEdit";
import AdminCategories from "../pages/admin/AdminCategories";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ✅ RUTAS PÚBLICAS */}
      <Route path="/" element={<Home />} />
      <Route path="/book/:id" element={<BookDetail />} />
      <Route path="/login" element={<Login />} />

      {/* RUTAS PRIVADAS ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />        {/* /admin */}
        <Route path="add" element={<AdminAdd />} />   {/* /admin/add */}
        <Route path="edit/:id" element={<AdminEdit />} /> {/* /admin/edit/1 */}
        <Route path="categories" element={<AdminCategories />} />

      </Route>

     
      {/* ✅ 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>

  );
}

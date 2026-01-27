import Navbar from "./components/Navbar/Navbar";
import AppRoutes from "./routes/routes";
import { useLocation } from "react-router-dom";


export default function App() {
  const location = useLocation();

  // Rutas donde NO queremos navbar
  const hideNavbarRoutes = ["/login"];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);
  return (
    <div>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </div>
  );
}

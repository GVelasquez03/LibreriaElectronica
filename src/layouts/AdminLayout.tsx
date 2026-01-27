import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#151515ff" }}>
      <Outlet />
    </div>
  );
}

import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { getRole, isAuthenticated } from "../services/authService";

interface Props {
    children: JSX.Element;
    requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: Props) {

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && getRole() !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

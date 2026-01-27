const TOKEN_KEY = "token";
const ROLE_KEY = "role";

export function saveSession(token: string, role: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getRole() {
    return localStorage.getItem(ROLE_KEY);
}

export function isAuthenticated() {
    return !!getToken();
}

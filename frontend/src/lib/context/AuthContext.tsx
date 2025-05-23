import { createContext, useContext, useEffect, useState } from "react";
import api from "../../services/api";
import type { AuthContextType, User } from "../types/types";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    const response = await api.post("/api/token/", { username, password });
    // Assuming response.data.user_id exists from your backend's JWT token endpoint
    const userData: User = { id: response.data.user_id, username: username };
    setUser(userData);
    setIsAuthenticated(true);
    // LINHA CRÍTICA 1: Armazena o usuário no localStorage APÓS o login bem-sucedido.
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // LINHA CRÍTICA 2: Remove o usuário do localStorage ao fazer logout.
    localStorage.removeItem('user');
    window.location.href = "/login";
  };

  useEffect(() => {
    // LINHA CRÍTICA 3: Tenta carregar o usuário do localStorage quando o componente monta.
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // Tenta fazer um refresh silencioso para validar a sessão via cookie HTTPOnly.
        api.post("/api/token/refresh/")
          .catch(() => {
            // Se o refresh falhar (token expirado/inválido), limpa e redireciona.
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('user');
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
          });
      } catch (e) {
        console.error("Falha ao analisar usuário do localStorage", e);
        localStorage.removeItem('user'); // Limpa dados corrompidos
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      // Se não há usuário no localStorage, tenta validar a sessão via cookies.
      // Se essa validação falhar, redireciona para o login.
      const validateSessionFromCookies = async () => {
        try {
          await api.post("/api/token/refresh/");
          setIsAuthenticated(true);
          // IMPORTANTE: Se a sessão for validada via cookie, mas o usuário não estava no localStorage,
          // o `user` do AuthContext ainda será `null` aqui.
          // Para que o `user` seja preenchido nesse caso, você precisaria de um endpoint no backend
          // (ex: `/api/v1/users/me/`) que retorne os detalhes do usuário logado baseado no token de acesso.
          // Como não temos esse endpoint no código atual, e o token de acesso é HttpOnly,
          // não é possível preencher o `user` automaticamente aqui sem forçar um novo login.
        } catch (error: any) {
          setIsAuthenticated(false);
          setUser(null);
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      };
      validateSessionFromCookies();
    }
  }, []); 

  if (isAuthenticated === null) {
    return <div>Verificando sessão...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
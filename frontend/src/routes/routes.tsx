import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "../lib/context/AuthContext";

// Lazy Loading das páginas
const LoginPage = lazy(() => import("../pages/LoginPage"));
const BookListPage = lazy(() => import("../pages/BookListPage")); // Nova página de listagem de livros
const BookFormPage = lazy(() => import("../pages/BookFormPage")); // Nova página de formulário de livro
const BookDetailPage = lazy(() => import("../pages/BookDetailPage")); // Nova página de detalhes do livro
const ExchangePage = lazy(() => import("../pages/ExchangePage")); // Nova página de gerenciamento de trocas


function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <div>Verificando sessão...</div>;
  }

  if (isAuthenticated === false) {
    window.location.href = "/login";
    return null;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <BookListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/books/new"
          element={
            <PrivateRoute>
              <BookFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <PrivateRoute>
              <BookDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/books/:id/edit"
          element={
            <PrivateRoute>
              <BookFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/exchanges"
          element={
            <PrivateRoute>
              <ExchangePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
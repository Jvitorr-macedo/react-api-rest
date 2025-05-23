export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

// Tipo para o formulário de Produto (mantido para compatibilidade)
export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  image_url: string;
};

// Tipos para Usuário
export type User = {
  id: number;
  username: string;
};

// Tipo para Livro
export type Book = {
  id: number;
  title: string;
  author: string;
  description: string;
  isbn?: string | null;
  owner: User; // O proprietário do livro
  image_url?: string | null;
  created_at: string;
};

// Tipo para o formulário de Livro
export type BookFormData = {
  title: string;
  author: string;
  description: string;
  isbn?: string;
  image_url?: string;
};

// Tipo para Troca
export type Exchange = {
  id: number;
  offered_book: Book;
  requested_book: Book;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
};

// Tipo para o formulário de Troca (para iniciar uma troca)
export type ExchangeFormData = {
  offered_book_id: number;
  requested_book_id: number;
};

// Tipo para Avaliação
export type Rating = {
  id: number;
  book: Book;
  user: User;
  score: number; // 1 a 5
  comment?: string | null;
  created_at: string;
};

// Tipo para o formulário de Avaliação
export type RatingFormData = {
  book_id: number;
  score: number;
  comment?: string;
};

// Tipo para Recomendação
export type Recommendation = {
  id: number;
  user: User;
  recommended_book: Book;
  message?: string | null;
  created_at: string;
};

// Tipo para o formulário de Recomendação
export type RecommendationFormData = {
  recommended_book_id: number;
  message?: string;
};

// Tipo de resposta de paginação da API (usado com React Query)
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// Tipo para autenticação
export type AuthContextType = {
  isAuthenticated: boolean | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null; // Adiciona o usuário logado ao contexto
};

export type LoginFormInputs = {
  username: string;
  password: string;
};
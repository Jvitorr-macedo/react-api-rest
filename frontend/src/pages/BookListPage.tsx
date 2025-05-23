import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Book, PaginatedResponse } from "../lib/types/types";

function BookListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery<PaginatedResponse<Book>>({
    queryKey: ["books", page, searchQuery],
    queryFn: () => {
      const url = `/api/v1/books/?page=${page}${searchQuery ? `&search=${searchQuery}` : ""}`;
      return api.get(url).then(res => res.data);
    },
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // Resetar para a primeira página ao pesquisar
  };

  if (isLoading) return <p className="text-center mt-10">Carregando livros...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Erro ao carregar os livros.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Livros Disponíveis</h1>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/books/new")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Cadastrar Novo Livro
        </button>
        <input
          type="text"
          placeholder="Buscar por título ou autor..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded text-gray-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.results.map((book: Book) => (
          <div 
            key={book.id} 
            className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer flex flex-col h-full"
            onClick={() => navigate(`/books/${book.id}`)}
          >
            {book.image_url && (
              <img src={book.image_url} alt={book.title} className="w-full h-40 object-cover rounded mb-4" />
            )}
            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">Autor: {book.author}</p>
            <p className="text-gray-600 dark:text-gray-300 flex-grow overflow-hidden text-ellipsis line-clamp-3 mt-2">
              {book.description}
            </p>
            <p className="font-bold mt-4">Proprietário: {book.owner.username}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!data?.next}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default BookListPage;
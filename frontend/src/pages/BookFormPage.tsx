import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import type { BookFormData } from "../lib/types/types";
import api from "../services/api";

const schema = yup.object().shape({
title: yup.string().required("Título obrigatório"),
author: yup.string().required("Autor obrigatório"),
description: yup.string().required("Descrição obrigatória"),
isbn: yup.string().optional().nullable().max(13, "ISBN deve ter no máximo 13 caracteres"),
image_url: yup.string().url("URL inválida").optional().nullable(),
});

function BookFormPage() {
const navigate = useNavigate();
const { id } = useParams();

const {
  register,
  handleSubmit,
  setValue,
  formState: { errors },
} = useForm<BookFormData>({
  resolver: yupResolver(schema),
});

useEffect(() => {
  if (id) {
    api.get(`/api/v1/books/${id}/`).then((res) => {
      const book = res.data;
      setValue("title", book.title);
      setValue("author", book.author);
      setValue("description", book.description);
      setValue("isbn", book.isbn);
      setValue("image_url", book.image_url);
    });
  }
}, [id, setValue]);

const onSubmit = async (data: BookFormData) => {
  try {
    if (id) {
      await api.put(`/api/v1/books/${id}/`, data);
    } else {
      await api.post("/api/v1/books/", data);
    }
    navigate("/");
  } catch (error) {
    alert(`Erro ao salvar livro: ${error}.`);
  }
};

return (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {id ? "Editar Livro" : "Cadastrar Novo Livro"}
      </h1>

      <input
        {...register("title")}
        placeholder="Título do Livro"
        className="text-gray-800 w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-red-500 text-sm mb-2">{errors.title?.message}</p>

      <input
        {...register("author")}
        placeholder="Autor"
        className="text-gray-800 w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-red-500 text-sm mb-2">{errors.author?.message}</p>

      <textarea
        {...register("description")}
        placeholder="Descrição"
        className="text-gray-800 w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-red-500 text-sm mb-2">{errors.description?.message}</p>

      <input
        {...register("isbn")}
        placeholder="ISBN (opcional)"
        className="text-gray-800 w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-red-500 text-sm mb-2">{errors.isbn?.message}</p>

      <input
        {...register("image_url")}
        placeholder="URL da Imagem (opcional)"
        className="text-gray-800 w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-red-500 text-sm mb-4">{errors.image_url?.message}</p>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
      >
        {id ? "Atualizar Livro" : "Cadastrar Livro"}
      </button>
    </form>
  </div>
);
}

export default BookFormPage;
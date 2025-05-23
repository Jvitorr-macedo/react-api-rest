import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import type { Book, Rating, RatingFormData, Recommendation, RecommendationFormData } from "../lib/types/types";
import { useAuth } from "../lib/context/AuthContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const ratingSchema = yup.object().shape({
score: yup.number().min(1, "Mínimo 1 estrela").max(5, "Máximo 5 estrelas").required("Pontuação obrigatória"),
comment: yup.string().optional().nullable(),
});

const recommendationSchema = yup.object().shape({
recommended_book_id: yup.number().required("Selecione um livro para recomendar"),
message: yup.string().optional().nullable(),
});

function BookDetailPage() {
const { id } = useParams();
const navigate = useNavigate();
const { user } = useAuth(); 
const queryClient = useQueryClient();

const { data: book, isLoading: isLoadingBook, error: errorBook } = useQuery<Book>({
queryKey: ["book", id],
queryFn: () => api.get(`/api/v1/books/${id}/`).then((res) => res.data),
enabled: !!id,
});

const { data: ratings, isLoading: isLoadingRatings, error: errorRatings } = useQuery<Rating[]>({
queryKey: ["ratings", id],
queryFn: () => api.get(`/api/v1/ratings/?book_id=${id}`).then((res) => res.data.results),
enabled: !!id,
});

const { data: userBooks, isLoading: isLoadingUserBooks } = useQuery<Book[]>({
queryKey: ["userBooks"],
queryFn: () => api.get(`/api/v1/books/?owner=${user?.id}`).then((res) => res.data.results),
enabled: !!user,
});

const deleteBookMutation = useMutation({
mutationFn: () => api.delete(`/api/v1/books/${id}/`),
onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["books"] });
    navigate("/");
},
onError: (error: any) => {
    // Captura o erro 403 Forbidden do backend
    if (error.response?.status === 403) {
    alert("Você não tem permissão para excluir este livro.");
    } else {
    alert(`Erro ao excluir livro: ${error}.`);
    }
},
});

const addRatingMutation = useMutation({
mutationFn: (newRating: RatingFormData) => api.post(`/api/v1/ratings/`, newRating),
onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["ratings", id] });
    alert("Avaliação adicionada com sucesso!");
    resetRatingForm();
},
onError: (error: any) => {
    if (error.response?.status === 403) {
        alert("Você precisa estar logado para avaliar um livro.");
    } else if (error.response?.data?.non_field_errors?.includes("The fields book, user must make a unique set.")) {
        alert("Você já avaliou este livro.");
    } else {
        alert(`Erro ao adicionar avaliação: ${error}.`);
    }
},
});

const addRecommendationMutation = useMutation({
mutationFn: (newRecommendation: RecommendationFormData) => api.post(`/api/v1/recommendations/`, newRecommendation),
onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    alert("Recomendação enviada com sucesso!");
    resetRecommendationForm();
},
onError: (error: any) => {
    if (error.response?.status === 403) {
    alert("Você precisa estar logado para recomendar um livro.");
    } else {
    alert(`Erro ao enviar recomendação: ${error}.`);
    }
},
});

const {
register: registerRating,
handleSubmit: handleSubmitRating,
reset: resetRatingForm,
formState: { errors: errorsRating },
} = useForm<RatingFormData>({
resolver: yupResolver(ratingSchema),
});

const {
register: registerRecommendation,
handleSubmit: handleSubmitRecommendation,
reset: resetRecommendationForm,
formState: { errors: errorsRecommendation },
} = useForm<RecommendationFormData>({
resolver: yupResolver(recommendationSchema),
});

const onSubmitRating = (data: RatingFormData) => {
if (user && id) {
    addRatingMutation.mutate({ ...data, book_id: Number(id) });
}
};

const onSubmitRecommendation = (data: RecommendationFormData) => {
if (user && id) {
    addRecommendationMutation.mutate(data);
}
};

const handleDelete = () => {
if (confirm("Tem certeza que deseja excluir este livro?")) {
    deleteBookMutation.mutate();
}
};

if (isLoadingBook || isLoadingRatings || isLoadingUserBooks)
return <p className="text-center mt-10">Carregando...</p>;

if (errorBook)
return (
    <p className="text-center mt-10 text-red-500">
    Erro ao carregar os detalhes do livro.
    </p>
);

if (!book) {
return <p className="text-center mt-10 text-red-500">Livro não encontrado.</p>;
}

return (
<div className="flex justify-center items-center min-h-screen p-4">
    <div className="w-full max-w-4xl bg-white shadow-md rounded p-8 space-y-6 text-center text-gray-800">
    <h1 className="text-3xl font-bold">Detalhes do Livro</h1>
    {book.image_url && (
        <div className="flex justify-center">
        <img
            src={book.image_url}
            alt={book.title}
            className="w-full max-w-lg h-auto object-contain rounded"
        />
        </div>
    )}
    <h2 className="text-2xl font-semibold">{book.title}</h2>
    <p className="text-gray-700">Autor: {book.author}</p>
    <p className="text-gray-700">{book.description}</p>
    {book.isbn && <p className="text-lg font-semibold">ISBN: {book.isbn}</p>}
    <p className="text-lg font-semibold">Proprietário: {book.owner.username}</p>

    {/* ALTERADO: Botões 'Editar' e 'Excluir' agora aparecem se o usuário estiver logado */}
    {user && (
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
        <button
            onClick={() => navigate(`/books/${book.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full md:w-auto"
        >
            Editar Livro
        </button>
        <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full md:w-auto"
        >
            Excluir Livro
        </button>
        </div>
    )}
    
    {user && user.id !== book.owner.id && (
        <button
            onClick={() => navigate(`/exchanges?requested_book_id=${book.id}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full md:w-auto"
        >
            Propor Troca
        </button>
    )}

    <button
        onClick={() => navigate("/")}
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded w-full md:w-auto"
    >
        Voltar para a Lista de Livros
    </button>

    <hr className="my-8" />

    {/* Seção de Avaliações */}
    <h3 className="text-2xl font-bold mb-4">Avaliações</h3>
    {ratings && ratings.length > 0 ? (
        <div className="text-left">
        {ratings.map((rating) => (
            <div key={rating.id} className="border-b pb-4 mb-4">
            <p className="font-semibold">{rating.user.username} - {"⭐".repeat(rating.score)}</p>
            {rating.comment && <p className="text-gray-700 italic">"{rating.comment}"</p>}
            <p className="text-sm text-gray-500">Em {new Date(rating.created_at).toLocaleDateString()}</p>
            </div>
        ))}
        </div>
    ) : (
        <p>Nenhuma avaliação ainda.</p>
    )}

    {user && (
        <div className="mt-8">
        <h4 className="text-xl font-bold mb-4">Adicionar sua Avaliação</h4>
        <form onSubmit={handleSubmitRating(onSubmitRating)} className="space-y-4">
            <div>
            <label htmlFor="score" className="block text-gray-700 text-sm font-bold mb-2">Pontuação:</label>
            <select
                {...registerRating("score", { valueAsNumber: true })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
                <option value="">Selecione a pontuação</option>
                {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} estrela(s)</option>)}
            </select>
            <p className="text-red-500 text-sm">{errorsRating.score?.message}</p>
            </div>
            <div>
            <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">Comentário (opcional):</label>
            <textarea
                {...registerRating("comment")}
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
            </div>
            <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
            Enviar Avaliação
            </button>
        </form>
        </div>
    )}

    <hr className="my-8" />

    {/* Seção de Recomendações */}
    {user && (
        <div className="mt-8">
            <h4 className="text-xl font-bold mb-4">Recomendar este Livro</h4>
            <form onSubmit={handleSubmitRecommendation(onSubmitRecommendation)} className="space-y-4">
            <div>
                <label htmlFor="recommended_book_id" className="block text-gray-700 text-sm font-bold mb-2">Recomendar para (selecione um dos seus livros):</label>
                <select
                    {...registerRecommendation("recommended_book_id", { valueAsNumber: true })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Selecione um livro</option>
                    {userBooks?.map(b => (
                        <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                </select>
                <p className="text-red-500 text-sm">{errorsRecommendation.recommended_book_id?.message}</p>
            </div>
            <div>
                <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Mensagem (opcional):</label>
                <textarea
                {...registerRecommendation("message")}
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
            </div>
            <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Enviar Recomendação
            </button>
            </form>
        </div>
    )}

    </div>
</div>
);
}

export default BookDetailPage;
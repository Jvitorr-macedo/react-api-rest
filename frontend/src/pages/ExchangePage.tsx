import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import type { Book, Exchange, ExchangeFormData } from "../lib/types/types";
import { useAuth } from "../lib/context/AuthContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const exchangeSchema = yup.object().shape({
offered_book_id: yup.number().required("Selecione seu livro para a troca"),
requested_book_id: yup.number().required("Livro solicitado é obrigatório"),
});

function ExchangePage() {
const queryClient = useQueryClient();
const { user } = useAuth();
const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const requestedBookIdFromUrl = queryParams.get("requested_book_id");

const { data: myBooks, isLoading: isLoadingMyBooks } = useQuery<Book[]>({
queryKey: ["myBooks", user?.id],
queryFn: () => api.get(`/api/v1/books/?owner=${user?.id}`).then(res => res.data.results),
enabled: !!user,
});

const { data: requestedBook, isLoading: isLoadingRequestedBook } = useQuery<Book>({
queryKey: ["requestedBook", requestedBookIdFromUrl],
queryFn: () => api.get(`/api/v1/books/${requestedBookIdFromUrl}/`).then(res => res.data),
enabled: !!requestedBookIdFromUrl,
});

const { data: myExchanges, isLoading: isLoadingMyExchanges } = useQuery<Exchange[]>({
queryKey: ["myExchanges", user?.id],
queryFn: () => api.get(`/api/v1/exchanges/`).then(res => res.data.results),
enabled: !!user,
});

const {
register,
handleSubmit,
setValue,
formState: { errors },
} = useForm<ExchangeFormData>({
resolver: yupResolver(exchangeSchema),
});


if (requestedBookIdFromUrl && requestedBook && !isLoadingRequestedBook) {
setValue("requested_book_id", Number(requestedBookIdFromUrl));
}

const proposeExchangeMutation = useMutation({
mutationFn: (newExchange: ExchangeFormData) => api.post(`/api/v1/exchanges/`, newExchange),
onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["myExchanges"] });
    alert("Proposta de troca enviada com sucesso!");
    setValue("offered_book_id", undefined); 
},
onError: (error) => {
    alert(`Erro ao propor troca: ${error}.`);
},
});

const updateExchangeStatusMutation = useMutation({
mutationFn: ({ id, status }: { id: number; status: string }) =>
    api.patch(`/api/v1/exchanges/${id}/`, { status }),
onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["myExchanges"] });
    alert("Status da troca atualizado com sucesso!");
},
onError: (error) => {
    alert(`Erro ao atualizar status da troca: ${error}.`);
},
});

const onSubmitProposeExchange = (data: ExchangeFormData) => {
proposeExchangeMutation.mutate(data);
};

if (isLoadingMyBooks || isLoadingRequestedBook || isLoadingMyExchanges) {
return <p className="text-center mt-10">Carregando informações de troca...</p>;
}

return (
<div className="p-8">
    <h1 className="text-3xl font-bold mb-6">Gerenciar Trocas</h1>

    {requestedBook && (
    <div className="mb-8 p-6 border rounded-lg shadow-md bg-gray-50 text-gray-800">
        <h2 className="text-2xl font-bold mb-4">Propor Nova Troca para "{requestedBook.title}"</h2>
        <form onSubmit={handleSubmit(onSubmitProposeExchange)} className="space-y-4">
        <div>
            <label htmlFor="offered_book_id" className="block text-gray-700 text-sm font-bold mb-2">Seu Livro para Troca:</label>
            <select
            {...register("offered_book_id", { valueAsNumber: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
            <option value="">Selecione um dos seus livros</option>
            {myBooks?.filter(book => book.id !== requestedBook.id).map(book => (
                <option key={book.id} value={book.id}>
                {book.title} por {book.owner.username}
                </option>
            ))}
            </select>
            <p className="text-red-500 text-sm">{errors.offered_book_id?.message}</p>
        </div>
        <div>
            <label htmlFor="requested_book_id" className="block text-gray-700 text-sm font-bold mb-2">Livro Solicitado:</label>
            <input
            type="text"
            value={requestedBook.title}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 cursor-not-allowed"
            />
            <input
            type="hidden"
            {...register("requested_book_id", { valueAsNumber: true })}
            />
            <p className="text-red-500 text-sm">{errors.requested_book_id?.message}</p>
        </div>
        <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
            Propor Troca
        </button>
        </form>
    </div>
    )}

    <h2 className="text-2xl font-bold mb-4">Minhas Trocas</h2>
    {myExchanges && myExchanges.length > 0 ? (
    <div className="grid grid-cols-1 gap-4">
        {myExchanges.map((exchange) => (
        <div key={exchange.id} className="border p-4 rounded shadow bg-white text-gray-800">
            <p>
            Você ofereceu: <span className="font-semibold">{exchange.offered_book.title}</span> (de {exchange.offered_book.owner.username})
            </p>
            <p>
            Em troca de: <span className="font-semibold">{exchange.requested_book.title}</span> (de {exchange.requested_book.owner.username})
            </p>
            <p className="font-bold">Status: {exchange.status.toUpperCase()}</p>

            {exchange.status === "pending" && user?.id === exchange.requested_book.owner.id && (
            <div className="mt-4 flex space-x-2">
                <button
                onClick={() => updateExchangeStatusMutation.mutate({ id: exchange.id, status: "accepted" })}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                Aceitar
                </button>
                <button
                onClick={() => updateExchangeStatusMutation.mutate({ id: exchange.id, status: "rejected" })}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                Rejeitar
                </button>
            </div>
            )}
            {exchange.status === "accepted" && (user?.id === exchange.offered_book.owner.id || user?.id === exchange.requested_book.owner.id) && (
            <div className="mt-4">
                <button
                    onClick={() => updateExchangeStatusMutation.mutate({ id: exchange.id, status: "completed" })}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                >
                    Marcar como Concluída
                </button>
            </div>
            )}
        </div>
        ))}
    </div>
    ) : (
    <p>Você não tem nenhuma troca em andamento.</p>
    )}
</div>
);
}

export default ExchangePage;
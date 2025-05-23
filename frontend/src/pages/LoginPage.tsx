import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useAuth } from "../lib/context/AuthContext";
import type { LoginFormInputs } from "../lib/types/types";

// Schema de validação com Yup
const schema = yup.object().shape({
  username: yup.string().required("Usuário obrigatório"),
  password: yup.string().min(5, "Mínimo 5 caracteres").required("Senha obrigatória"),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.username, data.password);
      navigate("/");
    } catch (error) {
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Acessar Conta
        </h2>
  
        <input
          {...register("username")}
          placeholder="Usuário"
          className="text-gray-500 w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm mb-4">{errors.username?.message}</p>
  
        <input
          {...register("password")}
          type="password"
          placeholder="Senha"
          className="text-gray-500 w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm mb-6">{errors.password?.message}</p>
  
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
        >
          Entrar
        </button>
      </form>
    </div>
  );  
}

export default LoginPage;

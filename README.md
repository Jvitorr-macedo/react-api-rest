# 📚 Plataforma de Troca de Livros

Este repositório contém um projeto fullstack para uma **Plataforma de Troca de Livros**, desenvolvida com **Django REST Framework** no backend e **ReactJS com TypeScript** no frontend. O projeto integra autenticação segura via **JWT com HttpOnly cookies**, além de funcionalidades de avaliação e recomendação de livros.

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar a aplicação em sua máquina local.

### 📦 Estrutura de Pastas

O projeto está organizado em duas pastas principais:

/backend      # Contém a API RESTful desenvolvida com Django
/frontend     # Contém a aplicação web construída com ReactJS e TypeScript

### ✅ **Backend (Django REST Framework)**

1.  **Acesse a pasta do backend:**
    ```bash
    cd backend
    ```

2.  **Crie e ative o ambiente virtual:**
    É altamente recomendável usar um ambiente virtual para isolar as dependências do projeto.
    ```bash
    python -m venv venv
    source venv/bin/activate  # Para Linux/macOS
    # Ou no Windows (no PowerShell):
    # .\venv\Scripts\activate
    ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure o banco de dados e rode as migrações:**
    Estas etapas criarão as tabelas necessárias no seu banco de dados (SQLite por padrão).
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

5.  **Crie um superusuário:**
    Um superusuário é necessário para acessar o painel administrativo do Django (`/admin`) e gerenciar dados, além de ser o usuário inicial para testes de login.
    ```bash
    python manage.py createsuperuser
    ```

6.  **Inicie o servidor Django:**
    ```bash
    python manage.py runserver
    ```
    O backend estará disponível em `http://localhost:8000`.

### ✅ **Frontend (ReactJS + TypeScript + Vite)**

1.  **Acesse a pasta do frontend:**
    ```bash
    cd frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # Certifique-se que a biblioteca de decodificação JWT está instalada:
    npm install jwt-decode
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo chamado `.env.local` na pasta `frontend` e adicione a URL base da sua API.
    ```
    VITE_API_URL=http://localhost:8000
    ```

4.  **Inicie o servidor de desenvolvimento do frontend:**
    ```bash
    npm run dev
    ```
    O frontend estará acessível em `http://localhost:5173`.

---

## 💻 Tecnologias Utilizadas

Este projeto fullstack foi construído utilizando as seguintes tecnologias e bibliotecas:

### Backend:
* **Django:** Framework web Python de alto nível para desenvolvimento rápido.
* **Django REST Framework (DRF):** Toolkit poderoso e flexível para construir APIs web.
* **Django Simple JWT:** Autenticação baseada em JSON Web Tokens (JWT) com suporte a HttpOnly cookies.
* **DRF Spectacular:** Geração automática de documentação OpenAPI (Swagger/Redoc) para a API.
* **Django CORS Headers:** Gerenciamento de Cross-Origin Resource Sharing (CORS) para permitir requisições de domínios diferentes (frontend).
* **SQLite:** Banco de dados padrão para desenvolvimento.

### Frontend:
* **ReactJS:** Biblioteca JavaScript para construir interfaces de usuário interativas.
* **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
* **Vite:** Ferramenta de build rápida para projetos web modernos.
* **Axios:** Cliente HTTP baseado em Promises para o navegador e Node.js.
* **React Query (TanStack Query):** Biblioteca para gerenciamento de estado assíncrono, cache e sincronização de dados.
* **React Hook Form:** Biblioteca para gerenciamento de formulários no React com foco em performance e DX.
* **Yup:** Construtor de esquemas para validação de dados em formulários.
* **React Router DOM:** Biblioteca para roteamento declarativo no React.
* **jwt-decode:** Para decodificar JWTs no frontend.
* **Tailwind CSS:** Framework CSS utility-first para estilização rápida e responsiva.

---

## 🖼️ Demonstração da Aplicação

![image](https://github.com/user-attachments/assets/31bc5e38-6a1e-45e0-bcbf-c7df07334385)

Tela Inicial de como irá ficar os livros

![image-1](https://github.com/user-attachments/assets/36555a74-4dd0-44bf-b890-e4f851012954)

Cadastro do livro

![image-2](https://github.com/user-attachments/assets/3758459e-af86-4e37-ab7d-c5677064ab79)

Detalhe do Livro

![image-3](https://github.com/user-attachments/assets/99bbb743-ad5e-4b3c-bfe7-522e0c8f856b)

Fazer avaliação e recomendação


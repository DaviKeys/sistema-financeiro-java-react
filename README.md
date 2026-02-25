# 💰 Sistema de Gestão Financeira Full Stack

Um sistema completo para controle de finanças pessoais, construído com foco em segurança, performance e arquitetura em nuvem. A aplicação permite que usuários criem contas, verifiquem seus e-mails, façam login seguro e gerenciem suas receitas e despesas com um painel interativo.

🔗 **[Acesse o Sistema em Produção Aqui](https://sistema-financeiro-java-react.vercel.app/)**

---

## 🚀 Tecnologias Utilizadas

### Backend (API REST)
* **Java 17** com **Spring Boot 3**
* **Spring Security & JWT (JSON Web Tokens)** para autenticação e autorização
* **PostgreSQL** (Hospedado na nuvem via Neon Serverless)
* **Resend API** para envio de e-mails transacionais (Validação de conta em 2 etapas)
* **Maven** para gerenciamento de dependências

### Frontend
* **React** com **Vite**
* **Context API** para gerenciamento de estado
* Integração assíncrona com API via `fetch`
* Gráficos dinâmicos e suporte a Dark Mode

### Infraestrutura & Deploy
* **Render:** Hospedagem do servidor Java (Backend)
* **Vercel:** Hospedagem da interface React (Frontend)
* **Neon:** Banco de dados relacional em nuvem
* **Docker:** Pronto para conteinerização (`docker-compose.yml` incluso)

---

## ✨ Principais Funcionalidades

1.  **Autenticação Segura:** Criação de conta com criptografia de senha (BCrypt) e login via JWT.
2.  **Validação de E-mail:** Integração com a API do Resend para envio de um código de 6 dígitos em tempo real para ativar a conta do usuário.
3.  **Controle de Acesso:** Rotas da API protegidas pelo `SecurityFilterChain` e políticas de CORS estritas.
4.  **Dashboard Interativo:** Resumo de saldo, receitas e despesas com atualização imediata.
5.  **Gráficos e Filtros:** Visualização de despesas por categoria usando gráfico de pizza.
6.  **CRUD Completo:** Adição e listagem de transações financeiras com vínculo direto ao usuário logado.

---

## 🛠️ Como Rodar o Projeto Localmente

### Pré-requisitos
* Java 17+
* Node.js 18+
* PostgreSQL rodando localmente (ou via Docker)
* Chave de API do [Resend](https://resend.com/)

### Backend
1. Clone este repositório.
2. Navegue até a pasta `financeiro`.
3. Configure o arquivo `application.properties` com suas credenciais do banco de dados e sua API Key do Resend.
4. Rode a aplicação com o comando: `./mvnw spring-boot:run`

### Frontend
1. Navegue até a pasta `frontend`.
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev`

---
*Desenvolvido por Davi Chaves*

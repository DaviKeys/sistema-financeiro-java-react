# 📊 Sistema de Gestão Financeira Full Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black)

Uma aplicação Full Stack robusta para gestão de finanças pessoais, desenvolvida com o objetivo de aplicar conceitos avançados de arquitetura de software, resiliência de servidores e Experiência do Usuário (UX). 

🔗 **[Link do Projeto em Produção]**(https://sistema-financeiro-java-react.vercel.app/)

## 💻 Sobre o Projeto

O sistema permite que os usuários criem contas seguras, registrem receitas e despesas, e visualizem um dashboard interativo com o saldo atual. O foco do desenvolvimento não foi apenas entregar as funcionalidades, mas construir uma infraestrutura performática e contornar desafios reais de deploy em ambientes cloud gratuitos.

## 🏗️ Arquitetura e Tecnologias

### Frontend
* **React.js:** Construção da interface em SPA (Single Page Application).
* **Mantine UI:** Biblioteca de componentes para um design moderno, responsivo e com suporte nativo a Dark Mode.
* **Deploy:** Vercel.

### Backend
* **Java 17 & Spring Boot:** Criação de uma API RESTful estruturada e escalável.
* **Spring Security & JWT:** Autenticação e autorização seguras via tokens.
* **Deploy:** Render.

### Banco de Dados
* **[PostgreSQL (Neon DB)](https://neon.tech/):** Banco de dados relacional em nuvem, garantindo alta disponibilidade e consistência dos dados financeiros.
## 🚀 Desafios Técnicos Superados

Durante o desenvolvimento, enfrentei e solucionei problemas arquiteturais comuns em aplicações modernas:

1. **Race Conditions na Autenticação:** Refatoração do fluxo de login no React para garantir que o token JWT seja armazenado e lido de forma síncrona antes do disparo do primeiro `fetch` do Dashboard, eliminando erros `403 Forbidden` intermitentes.
2. **Alta Disponibilidade (Cold Start do Render):** Para contornar a hibernação (timeout de 15 min) do plano gratuito do Render, implementei uma rota `/api/health` no Spring Boot e configurei um Cron-job automatizado para pingar o servidor a cada 10 minutos, garantindo que a API responda instantaneamente aos usuários.
3. **Persistência de UX:** Implementação de `sessionStorage` para manter o estado dos filtros (Mês e Ano) aplicados no Dashboard. O sistema identifica a data atual no primeiro login e preserva a navegação do usuário mesmo após reloads da página, entregando uma experiência premium.
4. **Resolução de CORS e DNS:** Configuração rigorosa de cabeçalhos no Spring Boot para permitir a comunicação segura entre diferentes domínios (Vercel -> Render).

## 👨‍💻 Sobre o Desenvolvedor

Desenvolvido por **Davi Chaves**, estudante de Sistemas de Informação na Universidade Federal de Uberlândia (UFU). 
Com grande facilidade de aprendizado e força de vontade, busco sempre focar na resolução de problemas complexos de software, unindo o desenvolvimento backend (Java/Spring) com boas práticas de infraestrutura e resiliência de sistemas.

* **LinkedIn:** [Davi Chaves](https://www.linkedin.com/in/davi-chaves-92119b260/)
* **E-mail:** [davi100humberto@gmail.com]

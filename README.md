# 💰 Sistema de Gestão Financeira Full Stack

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

> Um sistema completo para controle de finanças pessoais, com Dashboard interativo, gráficos e persistência de dados em container.

## 📸 Demonstração



## 🚀 Sobre o Projeto
Este projeto foi desenvolvido como parte do meu portfólio para demonstrar habilidades em desenvolvimento **Full Stack**. O objetivo foi criar uma aplicação robusta onde o usuário pode gerenciar suas receitas e despesas, visualizar o saldo em tempo real e analisar gastos através de gráficos dinâmicos.

A aplicação resolve o problema de perda de dados utilizando **Docker** para orquestrar o banco de dados PostgreSQL, garantindo que as informações persistam mesmo após o reinício da máquina.

## 🛠️ Tecnologias Utilizadas

### Backend (API REST)
- **Java 17**: Linguagem base.
- **Spring Boot**: Framework para criação da API.
- **Spring Data JPA**: Para persistência e manipulação de dados.
- **Maven**: Gerenciamento de dependências.

### Frontend (Interface)
- **React.js + Vite**: Biblioteca para construção da interface reativa.
- **Recharts**: Biblioteca para criação de gráficos de dados.
- **Axios/Fetch API**: Para comunicação com o Backend.

### Infraestrutura & Dados
- **PostgreSQL**: Banco de dados relacional.
- **Docker & Docker Compose**: Containerização do banco de dados para fácil setup.

## ✨ Funcionalidades
- [x] **CRUD Completo**: Criar, Ler, Editar e Excluir transações.
- [x] **Dashboard Financeiro**: Cálculo automático de Saldo, Total de Receitas e Despesas.
- [x] **Gráficos Dinâmicos**: Visualização de gastos via gráfico de Pizza (Donut).
- [x] **Filtros Avançados**: Filtragem de dados por Mês e Ano.
- [x] **Persistência Real**: Dados salvos em volume Docker.

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
Tenha instalado em sua máquina:
- Java 17+
- Node.js
- Docker Desktop

### Passo a Passo

1. **Clone o repositório**
```bash
git clone [https://github.com/davichaves/sistema-financeiro.git](https://github.com/davichaves/sistema-financeiro.git)

# Sistema de Gestão de Eventos e Check-in - FADE-UFPE

Este repositório contém uma aplicação web completa para a gestão de eventos, participantes e regras de check-in, desenvolvida como parte do processo seletivo do Edital 013/2026 da FADE-UFPE. A solução foi construída utilizando tecnologias modernas de front-end, focando em usabilidade, performance e robustez técnica.

## 🚀 Tecnologias Utilizadas

A aplicação foi desenvolvida com o ecossistema React mais recente, garantindo uma base de código tipada e de fácil manutenção:

*   **React 19**: Utilização das versões mais recentes da biblioteca para UI.
*   **TypeScript**: Tipagem estática em todo o projeto para evitar erros em tempo de execução.
*   **Vite**: Ferramenta de build ultra-rápida para o desenvolvimento moderno.
*   **Tailwind CSS 4**: Estilização utilitária moderna, garantindo uma interface responsiva e limpa.
*   **Lucide React**: Conjunto de ícones leves e consistentes.
*   **React Router Dom 7**: Gerenciamento de rotas complexas e navegação protegida.
*   **Vitest & React Testing Library**: Framework de testes unitários e de integração.

## 📋 Funcionalidades Implementadas

O sistema oferece um fluxo completo para organizadores de eventos:

### 1. Autenticação Segura
*   **Login de Acesso**: Proteção de rotas através de um sistema de autenticação.
*   **Persistência de Sessão**: Armazenamento seguro de tokens no `localStorage`.
*   **Geração Dinâmica de Tokens**: Simulação de tokens JWT utilizando a `Web Crypto API` no lado do cliente.

### 2. Dashboard de Visão Geral
*   **Estatísticas em Tempo Real**: Cards informativos com o total de eventos e participantes.
*   **Próximos Eventos**: Listagem automática dos eventos ativos mais próximos da data atual.

### 3. Gestão de Eventos
*   **CRUD Completo**: Criação, edição, visualização e exclusão de eventos.
*   **Filtros Avançados**: Busca por nome, local, status e intervalo de datas.
*   **Validações de Negócio**: Impedimento de criação de eventos ativos com datas retroativas.

### 4. Gestão de Participantes
*   **Vinculação Dinâmica**: Cadastro de participantes associados a eventos existentes.
*   **Controle de Check-in**: Visualização clara do status de presença (Feito/Pendente).
*   **Busca Global**: Filtro rápido por nome, e-mail ou status de check-in.

### 5. Configuração de Regras de Check-in (Diferencial)
*   **Múltiplas Regras**: Possibilidade de definir várias regras por evento (ex: QR Code, Documento, etc).
*   **Janelas Temporais**: Configuração de minutos antes e depois do início do evento para liberação do check-in.
*   **Regras Obrigatórias vs Opcionais**: Diferenciação lógica entre requisitos de entrada.
*   **Algoritmo de Conflitos**: Sistema inteligente que detecta se duas regras obrigatórias possuem janelas de tempo que não se sobrepõem, garantindo que o check-in seja fisicamente possível.

## ✨ Diferenciais Técnicos

*   **Arquitetura Baseada em Contextos**: Uso de `Context API` para gerenciamento de estados globais (Autenticação e Notificações/Toast).
*   **Simulação de API (Mock Service)**: Camada de serviço robusta que simula latência de rede e operações assíncronas, permitindo o funcionamento completo sem um backend real.
*   **Qualidade de Código**:
    *   **Testes Automatizados**: Cobertura de testes para componentes críticos e lógica de negócio (regras de check-in).
    *   **Linting e Formatação**: Configurações rigorosas de ESLint e Prettier para manter a consistência do código.
*   **Interface Responsiva**: Design adaptável para dispositivos móveis e desktops utilizando Tailwind CSS.
*   **UX Aprimorada**: Feedback visual através de Toasts para todas as ações do usuário (sucesso, erro, avisos).

## 🛠️ Como Executar o Projeto

1.  **Clonar o repositório**:
    ```bash
    git clone https://github.com/LucasAlb1609/Edital-0132026-Fade-UFPE.git
    cd Edital-0132026-Fade-UFPE
    ```

2.  **Instalar dependências**:
    ```bash
    npm install
    ```

3.  **Executar em modo de desenvolvimento**:
    ```bash
    npm run dev
    ```

4.  **Executar testes**:
    ```bash
    npm test
    ```

5.  **Gerar build de produção**:
    ```bash
    npm run build
    ```

---
**Desenvolvido por Lucas Alberto** - 2026

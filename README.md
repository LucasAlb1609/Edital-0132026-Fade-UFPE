# Sistema de Gestão de Eventos e Check-in - FADE-UFPE

O repositório contém uma aplicação web completa para a gestão de eventos, participantes e regras de check-in, desenvolvida como parte do processo seletivo do Edital 013/2026 da FADE-UFPE.

## Tecnologias Utilizadas

A aplicação foi desenvolvida com a versão do React mais recente, visando uma base de código tipada de fácil manutenção:

*   **React 19 com Vite**: Versão mais recentes da biblioteca para UI com build rápida e otimizada.
*   **TypeScript**: Tipagem estática e segurança de código.
*   **Tailwind CSS 4**: Estilização e responsividade.
*   **Lucide React**: Conjunto de ícones leves e consistentes.
*   **Context API**: Gerenciamento de estado global para Autenticação e Toasts.
*   **React Router Dom 7**: Gerenciamento de rotas e navegação protegida.
*   **Vitest & React Testing Library**: Framework de testes unitários e de integração.
*   **ESLint & Prettier**: Padronização de código.

## Funcionalidades do Projeto

O sistema oferece um fluxo completo para organizadores de eventos:

### 1. Autenticação Segura
*   **Login de Acesso com autenticação JWT**: O token é armazenado e utilizado para proteger o acesso às rotas internas.
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

### 5. Configuração de Regras de Check-in
*   **Múltiplas Regras**: Possibilidade de definir várias regras por evento (ex: QR Code, Documento, etc).
*   **Janelas Temporais**: Configuração de minutos antes e depois do início do evento para liberação do check-in.
*   **Regras Obrigatórias vs Opcionais**: Diferenciação lógica entre requisitos de entrada.
*   **Algoritmo de Conflitos**: Sistema inteligente que detecta se duas regras obrigatórias possuem janelas de tempo que não se sobrepõem, garantindo que o check-in seja fisicamente possível.

### 6. Estratégia e Cobertura de Testes (Diferencial)
   Ferramentas Modernas: Implementação de testes utilizando Vitest (para execução rápida e compatibilidade com Vite) em conjunto com a React Testing Library.

*   Foco no Comportamento do Usuário: Testes de componentes baseados em acessibilidade e interações reais (como preenchimento de formulários e cliques), utilizando seletores semânticos (getByRole, getByLabelText) em vez       de testar detalhes de implementação interna.
*   Arquitetura de Colocation: Arquivos de teste (.test.tsx e .test.ts) posicionados exatamente na mesma pasta dos componentes que validam, facilitando a manutenção e garantindo a coesão do domínio.
*   Mocking Avançado e Isolamento: Criação de cenários de teste controlados através do isolamento de dependências. Foram criados mocks completos para a camada de API (simulando resoluções e rejeições de rede), Contextos       Globais (AuthContext e ToastContext) e roteamento (MemoryRouter).
*   Testes Unitários de Lógica de Negócio: Cobertura rigorosa de funções puras e algoritmos complexos, como a validação matemática de conflitos de horário nas regras de check-in, garantindo a integridade dos dados antes       mesmo de chegarem à interface.
*   Padrão AAA (Arrange, Act, Assert): Estruturação clara de todos os testes preparando o estado, executando a ação do usuário e validando as mudanças no DOM ou as chamadas de funções (spies).

##  Diferenciais Técnicos

*   **Arquitetura Baseada em Contextos**: Uso de `Context API` para gerenciamento de estados globais (Autenticação e Notificações/Toast).
*   **Simulação de API (Mock Service)**: Camada de serviço robusta que simula latência de rede e operações assíncronas, permitindo o funcionamento completo sem um backend real.
*   **Qualidade de Código**:
    *   **Testes Automatizados**: Cobertura de testes para componentes críticos e lógica de negócio (regras de check-in).
    *   **Linting e Formatação**: Configurações rigorosas de ESLint e Prettier para manter a consistência do código.
*   **Interface Responsiva**: Design adaptável para dispositivos móveis e desktops utilizando Tailwind CSS.
*   **UX Aprimorada**: Feedback visual através de Toasts para todas as ações do usuário (sucesso, erro, avisos).
*   **Cobertura de Testes:** Suíte de testes abrangente cobrindo lógicas de negócio (regras de check-in) e interações do usuário nos componentes (formulários, filtros e simulação de API).

##  Como Executar o Projeto?

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
   O projeto possui uma suíte de testes configurada com Vitest. Para rodar os testes e visualizar a interface gráfica, utilize o comando:

    ```bash
    npm run test -- --ui
    ```
    Ou, se preferir rodar os testes apenas no terminal de forma silenciosa:

    ```bash
    npm run test
    ```

6.  **Gerar build de produção**:
    ```bash
    npm run build
    ```

##  Credenciais de Acesso (Mocka)
   Para testar a aplicação localmente ou no ambiente de deploy, utilize as seguintes credenciais simuladas:

   E-mail: admin@eventos.pt
   Senha: 123456

---
**Desenvolvido por Lucas Albuquerque** - Março 2026

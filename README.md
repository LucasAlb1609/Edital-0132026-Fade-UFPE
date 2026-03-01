# 🎫 Painel do Organizador de Eventos

Uma aplicação web moderna e responsiva desenvolvida em React para gerenciar eventos, participantes e regras complexas de check-in. Este projeto simula um painel de administração com autenticação, validações rigorosas de estado e roteamento protegido.

🔗 **[Acesse a aplicação online aqui](#)** *(Substitua por seu link da Vercel)*

---

## 🚀 Funcionalidades Principais

* **🔐 Autenticação Simulada (Mock JWT):** Sistema de login com validação e armazenamento seguro no `localStorage`.
* **🛡️ Rotas Protegidas:** Utilização do `react-router-dom` para garantir que apenas usuários autenticados acessem o dashboard e as páginas internas.
* **📊 Dashboard Interativo:** Resumo em tempo real da quantidade de eventos e participantes cadastrados.
* **📅 Gerenciamento de Eventos (CRUD):** * Criação, edição e exclusão de eventos com filtros de pesquisa.
    * *Validação de datas:* Impede a criação de eventos "Ativos" com datas no passado.
    * *Exclusão em cascata:* Remover um evento remove automaticamente todos os seus participantes.
* **👥 Gerenciamento de Participantes (CRUD):**
    * Cadastro e controle do status de check-in.
    * *Transferência de Eventos:* Funcionalidade que permite realocar um participante para outro evento através de seleção intuitiva.
* **⚙️ Motor de Regras de Check-in (O Coração da Aplicação):**
    * Painel exclusivo para configuração de janelas de tempo de entrada (liberação e encerramento).
    * *Prevenção de Conflitos (Algoritmo):* Calcula intersecções matemáticas e impede que regras obrigatórias possuam janelas de validação incompatíveis.
    * *Garantia de Estado:* Impede a remoção ou desativação da última regra ativa.
* **🔔 UX e Feedbacks:** Sistema de Toast Notifications construído do zero, substituindo alertas nativos, além de loaders durante as simulações de requisição à API.

---

## 🌟 Diferenciais Implementados

Este projeto foi além dos requisitos básicos, incorporando as melhores práticas e ferramentas do mercado:

* **Arquitetura Modular:** Separação clara de responsabilidades (`contexts`, `components`, `pages`, `services`, `types`, `utils`).
* **TypeScript:** Tipagem estrita em toda a aplicação, abolindo o uso de `any` e prevenindo erros em tempo de compilação.
* **Testes Unitários Automatizados:** Implementação do Vitest + Testing Library. A lógica complexa de cálculo de conflito de regras foi isolada (`src/utils/checkinRules.ts`) e possui cobertura de testes automatizados.
* **Qualidade e Padronização de Código:** Integração do ESLint com Prettier para garantir que o código esteja sempre limpo, legível e formatado automaticamente.
* **Tailwind CSS v4:** Estilização moderna e 100% responsiva (Mobile-first) utilizando a versão mais recente do motor Oxide do Tailwind.
* **Deploy:** Pipeline de CI/CD configurada para produção através da Vercel.

---

## 🛠️ Tecnologias Utilizadas

* React
* TypeScript
* Vite
* Tailwind CSS v4
* React Router DOM
* Lucide React (Ícones)
* Vitest (Testes Unitários)
* ESLint + Prettier

---

## 📂 Estrutura do Projeto

```plaintext
src/
├── components/       # Componentes reaproveitáveis e Layout (MainLayout, ProtectedRoute)
├── contexts/         # Gerenciamento de Estado Global (AuthContext, ToastContext)
├── pages/            # Telas da aplicação (Login, Dashboard, Eventos, Regras, etc)
├── services/         # Mock da API e persistência de dados em memória
├── types/            # Definições de interfaces do TypeScript
└── utils/            # Funções utilitárias puras (ex: lógicas matemáticas de testes)
```

---

## ⚙️ Como Executar o Projeto Localmente
Pré-requisitos
Ter o Node.js instalado na máquina.

Passo a Passo
1. Clone o repositório:

```Bash
git clone [https://github.com/SeuUsuario/painel-eventos-organizador.git](https://github.com/SeuUsuario/painel-eventos-organizador.git)
cd painel-eventos-organizador
```

2. Instale as dependências:

```Bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```Bash
npm run dev
```

4. Acesse a aplicação:
Abra o seu navegador e acesse: http://localhost:5173

## 🔐 Credenciais de Acesso (Mock API)
Para testar a aplicação, utilize as seguintes credenciais na tela de login:

E-mail: admin@eventos.pt

Senha: 123456

## 🧪 Como Executar os Testes e Formatação
Para rodar a suíte de testes unitários (Vitest):

```Bash
npm run test
```

Para verificar erros de padronização (ESLint):

```Bash
npm run lint
```

Para formatar o código automaticamente (Prettier):

```Bash
npm run format
```

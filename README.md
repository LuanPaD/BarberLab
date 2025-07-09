## 🧱 BarberLab
BarberLab é um sistema SaaS de agendamento online para barbearias. Usuários podem escolher serviços, visualizar barbearias disponíveis e reservar horários — tudo de forma rápida e intuitiva, diretamente pelo site.

Projeto full‑stack com **Next.js**.

- 🔍 Busca por barbearias e serviços
- 📅 Agendamento com escolha de data e horário
- 📱 Design responsivo
- 🧾 Visualização de reservas
- 🔐 Login e autenticação

## 🧩 Tech Stack

[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white&style=for-the-badge)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white&style=for-the-badge)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-2.7-000000?logo=shadcnui&logoColor=white&style=for-the-badge)](https://ui.shadcn.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=blue&style=for-the-badge)](https://www.prisma.io/)

```text
🗂️ Estrutura do Projeto
`/`
├─ app/               → Páginas, rotas, actions e componentes 
├─ prisma/            → Arquivos de acesso ao banco 
├─ public/            → Arquivos estáticos (imagens, fontes etc.) 
├─ .husky/            → Hooks do Git
├─ .eslintrc.json     → Configuração do ESLint
├─ .prettierrc        → Configuração do Prettier
├─ next.config.mjs    → Configurações personalizadas do Next.js
├─ tsconfig.json      → Configurações do TypeScript
├─ package.json       → Scripts e dependências
└─ ...                → Outros arquivos de configuração
```

## 📸 Demonstrações
https://github.com/user-attachments/assets/3da5f7be-be67-4594-ab43-8a73d076399a

#### Figma
https://www.figma.com/design/KKq1t6YEm0WtAlOJbLLe5h/BarberLaB?node-id=1-9&t=ffjK4bbnBSixEejh-1

### Desktop
#### Início
![screencapture-barber-lab-vercel-app-2025-07-09-15_08_50](https://github.com/user-attachments/assets/48bbc5dc-9ea2-4257-8b2c-1cc69f2a4bd3)
#### Barbearias
![screencapture-barber-lab-vercel-app-barbershops-2025-07-09-15_11_01](https://github.com/user-attachments/assets/1fc8e1ed-6a81-48e3-ae68-05d1646265a2)
#### Agendamentos
![screencapture-barber-lab-vercel-app-bookings-2025-07-09-15_12_31](https://github.com/user-attachments/assets/fd9b32cb-677b-4918-a916-93d0c80df5c6)
#### Barbearia e Serviços
![screencapture-barber-lab-vercel-app-barbershops-8052c7e2-df2d-4966-a766-79e5f30d6c13-2025-07-09-15_13_28](https://github.com/user-attachments/assets/2e667385-1251-4e75-b58c-f03b26c098d4)


### Mobile
#### Início
![Home Page 02](https://github.com/user-attachments/assets/369fc544-64ce-4a54-b62e-5a1b0150c1ba)
#### Barbearias
![Buscar Categoria](https://github.com/user-attachments/assets/6caeff8d-31ee-4e3a-9c97-013f12772bce)
#### Agendamentos
![Agendamentos 01](https://github.com/user-attachments/assets/6a1cf25d-1219-4567-bd23-dd8e38a3e256)
![Fazer Reserva](https://github.com/user-attachments/assets/ab275df5-64cd-4871-a86b-8a643013b26c)
#### Barbearia e Serviços
![Barbearia](https://github.com/user-attachments/assets/4bbb7e82-1b25-4090-9208-cc27d71a528b)

## 🚀 Pré‑requisitos

- Node.js (v16+ recomendada)  
- pnpm (recomendado), npm, yarn ou bun
- Banco de Dados compatível com Prisma (PostgreSQL recomendado)
- Configuração do google developer console para autenticação

# 💍 Lista de Casamento Digital - Clarice & Elton

![Status do Deploy](https://img.shields.io/badge/Deploy-Vercel-success?style=for-the-badge&logo=vercel)
![Tech](https://img.shields.io/badge/Tech-Next.js%2014-black?style=for-the-badge&logo=next.js)
![Database](https://img.shields.io/badge/Database-Supabase-blueviolet?style=for-the-badge&logo=supabase)

Um sistema completo e elegante para gestão de lista de presentes e arrecadação de contribuições via PIX, desenvolvido para o casamento de Clarice e Elton. O projeto une um design minimalista com um backend robusto para garantir que a experiência dos convidados seja simples e segura.

---

## 🚀 Link do Projeto
Acesse o site oficial: [https://site-casamento-ten-pi.vercel.app/](https://site-casamento-ten-pi.vercel.app/)

---

## ✨ Funcionalidades Principais

### 🎁 Experiência do Convidado
- **Lista Interativa:** Navegação por cards de presentes com imagens e descrições.
- **Reserva Inteligente:** Sistema de trava que impede que dois convidados escolham o mesmo presente (Sincronização em tempo real).
- **Mimos em PIX:** Seção dedicada para presentes em dinheiro com função "Copiar Chave PIX".
- **Comprovantes:** Upload direto da foto do comprovante para validação dos noivos.

### 🔐 Área Administrativa (`/admin`)
- **Dashboard de Acompanhamento:** Visualização clara de quem escolheu cada item.
- **Gestão de PIX:** Tabela detalhada com nomes, valores e links diretos para os comprovantes armazenados.
- **Interface Otimizada:** Ajustes de alto contraste para facilitar a leitura em dispositivos móveis.

---

## 🛠️ Stack Técnica

| Tecnologia | Descrição |
| :--- | :--- |
| **Next.js 14** | Framework React com renderização híbrida e App Router. |
| **Tailwind CSS** | Framework CSS utilitário para design responsivo e moderno. |
| **TypeScript** | Linguagem principal para garantir segurança de tipos. |
| **Supabase** | Banco de dados PostgreSQL, Autenticação e Storage (nuvem). |
| **Framer Motion** | Biblioteca para animações de entrada e transições suaves. |
| **Vercel** | Plataforma de hospedagem com CI/CD automático via GitHub. |

---

## 🏗️ Configuração do Banco de Dados (PostgreSQL)

O esquema do banco de dados no Supabase foi desenhado da seguinte forma:

```sql
-- Tabela de Presentes
CREATE TABLE gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  selected BOOLEAN DEFAULT false,
  selected_by TEXT,
  image_url TEXT
);

-- Tabela de Contribuições PIX
CREATE TABLE pix_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

⚙️ Instalação e Execução Local
Clone o repositório:

Bash
git clone [https://github.com/eltoncelestino/site-casamento.git](https://github.com/eltoncelestino/site-casamento.git)
Instale as dependências:

Bash
npm install
Configure o arquivo .env.local:

Snippet de código
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
Inicie o projeto:

Bash
npm run dev
📜 Licença
Projeto desenvolvido para fins pessoais. Sinta-se à vontade para usar como base para outros eventos comemorativos.

Desenvolvido por Elton Celestino 🚀
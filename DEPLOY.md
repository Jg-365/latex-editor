# 📦 Deploy do LaTeX Editor para Produção

## 🏗️ Arquitetura

- **Backend**: Render.com (Docker com MiKTeX + Node.js + pdflatex)
- **Frontend**: Vercel (React/Vite + Canva SDK)

---

# 🚀 PARTE 1: Deploy do Backend (Render.com)

## Passo 1: Criar Conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em "Get Started"
3. Faça login com sua conta GitHub

## Passo 2: Fazer Push do Código

```bash
cd latex-editor
git add .
git commit -m "Preparar para deploy backend"
git push origin main
```

## Passo 3: Criar Web Service no Render

1. No dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub: `Jg-365/latex-editor`
3. Configure:
   - **Name**: `latex-backend`
   - **Region**: Oregon (Free tier)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Plan**: Free
4. Clique em **"Create Web Service"**

## Passo 4: Aguardar Deploy (10-15 min)

O Render vai:

- ✅ Instalar Ubuntu + Node.js
- ✅ Instalar MiKTeX completo
- ✅ Instalar ImageMagick + Ghostscript
- ✅ Instalar dependências npm
- ✅ Iniciar o servidor

Você verá logs em tempo real. Ao final, terá uma URL:
`https://latex-backend.onrender.com` (ou similar)

## Passo 5: Testar Backend

Abra no navegador:

```
https://seu-backend.onrender.com/api/health
```

Deve retornar:

```json
{ "status": "ok", "message": "Servidor LaTeX rodando" }
```

---

# 🌐 PARTE 2: Deploy do Frontend (Vercel)

## Passo 1: Atualizar URL do Backend

Edite `.env.production` e substitua pela URL real do seu backend:

```bash
VITE_BACKEND_URL=https://seu-backend.onrender.com
```

Commit:

```bash
git add .env.production
git commit -m "Atualizar URL do backend"
git push origin main
```

## Passo 2: Deploy via GitHub (MAIS FÁCIL)

### Passo a Passo:

1. **Seu código já está no GitHub** ✅
   - Repositório: `Jg-365/latex-editor`
   - Branch: `main`

2. **Acesse Vercel e importe o projeto**:
   - 🌐 Vá para: https://vercel.com/new
   - 📁 Clique em "Import Git Repository"
   - 🔗 Selecione: `Jg-365/latex-editor`

3. **Configure o projeto**:

   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Adicione Environment Variables** (IMPORTANTE):

   ```
   VITE_BACKEND_URL = https://seu-backend.onrender.com
   CANVA_APP_ID = AAG6GZyl4rw
   CANVA_APP_ORIGIN = https://app-aag6gzyl4rw.canva-apps.com
   CANVA_HMR_ENABLED = FALSE
   ```

5. **Clique em "Deploy"** 🚀

6. **Após o deploy, você receberá uma URL**:
   - Exemplo: `https://latex-editor-xyz.vercel.app`

7. **Teste a aplicação**:
   - Abra a URL do Vercel
   - Digite `E = mc^2`
   - Clique em "🔄 Recompilar" (com checkbox "Fundo transparente" marcado)
   - Deve aparecer a imagem renderizada!

8. **Atualize no Canva Developer Portal**:
   - 🔗 https://www.canva.com/developers/apps
   - Selecione seu app (AAG6GZyl4rw)
   - Em "App URLs", coloque: `https://latex-editor-xyz.vercel.app`
   - Salve ✅

---

# ✅ PARTE 3: Verificação e Testes

## Testar Backend Diretamente

```bash
# Health check
curl https://seu-backend.onrender.com/api/health

# Testar compilação
curl -X POST https://seu-backend.onrender.com/api/compile \
  -H "Content-Type: application/json" \
  -d '{"latex":"E = mc^2"}'
```

## Testar Frontend + Backend Integrado

1. Abra: `https://latex-editor-xyz.vercel.app`
2. Digite código TikZ:

```latex
\begin{tikzpicture}
  \draw[thick,blue] (0,0) -- (2,2);
  \node at (1,-0.5) {Teste};
\end{tikzpicture}
```

3. Marque "Fundo transparente"
4. Clique "🔄 Recompilar"
5. Deve aparecer o diagrama em alta qualidade (1200 DPI)!

---

## ⚙️ Configuração Automática de Deploy

A Vercel fará deploy automaticamente sempre que você:

- ✅ Fizer `git push` para `main`
- ✅ Criar um Pull Request (preview deploy)

---

## 🐛 Troubleshooting

### Backend não responde (500 Error)

1. Verifique logs no Render: Dashboard → latex-backend → Logs
2. Comum no primeiro deploy: aguarde instalação completa do MiKTeX (15 min)
3. Teste endpoint: `/api/check-dependencies`

### CORS Error no Frontend

- ✅ Já está configurado para aceitar `*.vercel.app` e `*.onrender.com`
- Verifique se `VITE_BACKEND_URL` está correto na Vercel

### Imagens saem em baixa qualidade

- ✅ Já está configurado para 1200 DPI + anti-aliasing
- Problema pode ser: backend não terminou de instalar MiKTeX

### Backend "dorme" (Free Plan)

- ⚠️ Render Free plan: serviço dorme após 15 min inatividade
- ⏱️ Primeira requisição após dormir: ~30 segundos
- 💡 Solução: upgrade para Starter ($7/mês) ou fazer um ping periódico

### Erro: "pdflatex not found"

- Verifique logs do Docker build
- Certifique-se de que o Dockerfile está completo
- Pode ser necessário rebuild: Dashboard → Deploy → Manual Deploy

---

## 📊 Monitoramento

Acesse: https://vercel.com/dashboard

- **Analytics**: Métricas de uso
- **Logs**: Debug de erros
- **Deployments**: Histórico

---

---

# 🎉 Pronto!

Seu **LaTeX Editor** está no ar em produção! ✨

## URLs Finais

- 🌐 **Frontend**: `https://latex-editor-xyz.vercel.app`
- 🔧 **Backend**: `https://latex-backend.onrender.com`

## Funcionalidades Completas

- ✅ **Compilação Backend**: pdflatex + MiKTeX completo
- ✅ **TikZ Diagrams**: Grafos, fluxogramas, árvores, máquinas de estado
- ✅ **Alta Qualidade**: 1200 DPI + anti-aliasing vetorial
- ✅ **Fundo Transparente**: Checkbox para remover fundo branco
- ✅ **Templates LaTeX**: Álgebra, Cálculo, Física, Química, TikZ
- ✅ **Auto-compilação**: Debounce de 1 segundo
- ✅ **Integração Canva**: Adiciona imagens diretamente ao design

## Limites Free Tier

### Render

- ✅ 750 horas/mês
- ⚠️ Dorme após 15 min inatividade
- 💾 512 MB RAM

### Vercel

- ✅ 100 GB bandwidth/mês
- ✅ Deployments ilimitados
- ✅ Preview deployments automáticos

## Deploy Automático

Ambos têm deploy automático ao fazer push:

```bash
git add .
git commit -m "Nova feature"
git push origin main
```

- ✅ Vercel: ~2 minutos
- ✅ Render: ~10 minutos

---

## 💰 Upgrade (Opcional)

### Render - Starter ($7/mês)

- ✅ Serviço sempre ativo (sem dormir)
- ✅ Mais recursos

### Vercel - Pro ($20/mês)

- ✅ Mais bandwidth
- ✅ Analytics avançado

---

## 📞 Suporte

- 📧 Render: [help.render.com](https://render.com/docs)
- 📧 Vercel: [vercel.com/support](https://vercel.com/support)

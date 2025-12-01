# 🚀 Quick Start - Backend LaTeX

## Instalação Rápida (Windows)

### 1️⃣ Instalar Pré-requisitos

```powershell
# MiKTeX (LaTeX compiler)
# Baixe e instale: https://miktex.org/download

# ImageMagick (PDF to PNG)
choco install imagemagick
# OU baixe: https://imagemagick.org/script/download.php
```

### 2️⃣ Executar Setup Automático

```powershell
.\setup-backend.bat
```

### 3️⃣ Iniciar Backend

```powershell
cd backend
npm start
```

**Aguarde a mensagem:** `✅ Backend LaTeX rodando em http://localhost:3001`

### 4️⃣ Iniciar Frontend (em outro terminal)

```powershell
npm start
```

---

## Instalação Rápida (Linux/Mac)

### 1️⃣ Instalar Pré-requisitos

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install texlive-full imagemagick

# macOS
brew install --cask mactex
brew install imagemagick
```

### 2️⃣ Executar Setup Automático

```bash
chmod +x setup-backend.sh
./setup-backend.sh
```

### 3️⃣ Iniciar Backend

```bash
cd backend
npm start
```

### 4️⃣ Iniciar Frontend (em outro terminal)

```bash
npm start
```

---

## 🧪 Testar Backend

```bash
curl -X POST http://localhost:3001/compile \
  -H "Content-Type: application/json" \
  -d '{"latex": "E = mc^2"}'
```

Deve retornar JSON com `"success": true` e imagem em base64.

---

## 🎨 Usar Diagramas TikZ

1. Abra o editor
2. Clique na aba **"✨ LaTeX & Diagramas"**
3. Clique em **"Templates de Equações"**
4. Selecione categoria **"🎨 Diagramas TikZ"**
5. Escolha um template (ex: "🔄 Grafo Direcionado")
6. Aguarde compilação automática (1-2 segundos)
7. Clique **"Adicionar ao Design"**

---

## ❓ Problemas Comuns

### Backend não inicia

```powershell
# Verificar Node.js
node --version  # Deve ser 18+

# Reinstalar dependências
cd backend
rm -rf node_modules
npm install
```

### "pdflatex: command not found"

**Windows:**

1. Abra MiKTeX Console
2. Vá em "Settings" → "Directories"
3. Adicione ao PATH: `C:\Program Files\MiKTeX\miktex\bin\x64`
4. Reinicie o terminal

**Linux/Mac:**

```bash
# Verificar instalação
which pdflatex

# Reinstalar se necessário
sudo apt-get install --reinstall texlive-full  # Linux
brew reinstall mactex  # Mac
```

### "convert: not authorized"

Edite `/etc/ImageMagick-6/policy.xml` (ou similar):

```xml
<!-- Alterar de "none" para "read|write" -->
<policy domain="coder" rights="read|write" pattern="PDF" />
```

### Preview não atualiza

Clique no botão **🔄** ao lado de "Adicionar ao Design" para recompilar manualmente.

---

## 📚 Exemplos de Código

### Equação Simples (KaTeX - sem backend)

```latex
E = mc^2
```

### Lista (Backend)

```latex
\begin{itemize}
\item Primeiro item
\item Segundo item
\end{itemize}
```

### Diagrama TikZ (Backend)

```latex
\begin{tikzpicture}
  \node[circle,draw] (A) at (0,0) {A};
  \node[circle,draw] (B) at (2,0) {B};
  \draw[->] (A) -- (B);
\end{tikzpicture}
```

### Matriz (Backend)

```latex
\begin{bmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{bmatrix}
```

---

## 🌐 Deployment

### Backend (Railway.app)

1. Criar `Dockerfile` em `backend/`:

```dockerfile
FROM node:18
RUN apt-get update && apt-get install -y texlive-full imagemagick
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

2. Deploy no Railway:

```bash
railway up
```

3. Obter URL: `https://seu-app.railway.app`

### Frontend (Vercel)

1. Configurar variável de ambiente no Vercel:

```
REACT_APP_LATEX_BACKEND=https://seu-app.railway.app
```

2. Deploy:

```bash
vercel --prod
```

---

## 🎯 Próximos Passos

- [ ] Explorar templates TikZ na categoria "🎨 Diagramas"
- [ ] Testar listas com `\begin{itemize}`
- [ ] Criar tabelas com `\begin{tabular}`
- [ ] Experimentar gráficos com PGFPlots
- [ ] Adicionar seus próprios templates em `src/data/templates.ts`

---

**Dúvidas?** Consulte `README-BACKEND.md` para documentação completa.

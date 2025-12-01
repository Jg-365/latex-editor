# 🚀 LaTeX Editor com Backend pdflatex

## Arquitetura

Este editor LaTeX possui duas formas de renderização:

1. **Cliente (KaTeX)**: Para fórmulas matemáticas simples - rápido, sem backend
2. **Backend (pdflatex)**: Para LaTeX avançado (TikZ, tabelas, listas) - compilação profissional

## Configuração do Backend

### 1. Instalar Dependências do Sistema

#### Windows

```powershell
# Instalar MiKTeX (LaTeX compiler)
# Baixe de: https://miktex.org/download

# Instalar ImageMagick (PDF→PNG)
choco install imagemagick

# Ou baixe de: https://imagemagick.org/script/download.php
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install texlive-full imagemagick
```

#### macOS

```bash
brew install --cask mactex
brew install imagemagick
```

### 2. Configurar Backend

```bash
# Entrar na pasta backend
cd backend

# Instalar dependências Node.js
npm install

# Iniciar servidor
npm start
```

O backend estará rodando em `http://localhost:3001`

### 3. Configurar Frontend

```bash
# Na raiz do projeto
cp .env.example .env

# Editar .env se necessário (já vem configurado para localhost:3001)
```

### 4. Iniciar Frontend

```bash
npm start
```

## Como Funciona

### Detecção Automática

O editor detecta automaticamente o tipo de código LaTeX:

- **Fórmulas simples** (`E=mc^2`, `\frac{a}{b}`): Usa KaTeX no cliente
- **LaTeX avançado** (`\begin{tikzpicture}`, `\begin{itemize}`): Usa backend pdflatex

### Templates TikZ

Na aba "✨ LaTeX & Diagramas", categoria "🎨 Diagramas TikZ":

- 🔄 Grafo Direcionado
- 🎨 Grafo Colorido
- 📊 Fluxograma
- 🌳 Árvore Binária
- 📐 Eixos Cartesianos
- ⭐ Formas Geométricas
- 🔢 Máquina de Estados

### Compilação Manual

Para LaTeX avançado, aparece um botão 🔄 para recompilar manualmente caso a auto-atualização falhe.

## Estrutura do Backend

```
backend/
├── server.js           # Express server com endpoint /compile
├── package.json        # Dependências (express, cors, sharp)
├── SETUP.md           # Instruções detalhadas
└── temp/              # Arquivos temporários (criado automaticamente)
```

### Endpoint API

**POST** `/compile`

```json
{
  "latex": "\\begin{tikzpicture}...\\end{tikzpicture}"
}
```

**Resposta de Sucesso:**

```json
{
  "success": true,
  "image": "base64_encoded_png_data"
}
```

**Resposta de Erro:**

```json
{
  "success": false,
  "error": "mensagem de erro"
}
```

## Pacotes LaTeX Suportados

O backend suporta **qualquer** pacote LaTeX instalado no seu sistema:

- **tikz**: Diagramas vetoriais
- **pgfplots**: Gráficos matemáticos
- **amsmath**: Equações avançadas
- **tabular**: Tabelas
- **listings**: Código-fonte formatado
- E muito mais!

## Solução de Problemas

### "Backend indisponível"

1. Verifique se o backend está rodando: `curl http://localhost:3001`
2. Confira se MiKTeX/TeX Live está instalado: `pdflatex --version`
3. Verifique ImageMagick: `convert --version`

### "pdflatex: command not found"

- **Windows**: Adicione MiKTeX ao PATH: `C:\Program Files\MiKTeX\miktex\bin\x64`
- **Linux/Mac**: Reinstale texlive/mactex

### "convert: command not found"

- **Windows**: Adicione ImageMagick ao PATH
- **Linux**: `sudo apt-get install imagemagick`
- **Mac**: `brew install imagemagick`

### Compilação lenta

A primeira compilação de um documento LaTeX pode ser lenta (5-10s) devido ao carregamento de pacotes. Compilações subsequentes são mais rápidas.

## Deployment

### Backend (Railway/Render/Heroku)

O backend precisa de:

- Node.js 18+
- TeX Live (instalar via Dockerfile)
- ImageMagick

Exemplo `Dockerfile` para backend:

```dockerfile
FROM node:18

# Instalar TeX Live e ImageMagick
RUN apt-get update && apt-get install -y \
    texlive-full \
    imagemagick \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001
CMD ["npm", "start"]
```

### Frontend (Vercel)

No Vercel, configure a variável de ambiente:

```
REACT_APP_LATEX_BACKEND=https://seu-backend.railway.app
```

## Contribuindo

Para adicionar novos templates TikZ, edite `src/data/templates.ts`:

```typescript
tikz: [
  {
    name: "🆕 Seu Template",
    latex: `\\begin{tikzpicture}
      % Seu código TikZ aqui
    \\end{tikzpicture}`,
    preview: "Descrição curta",
  },
  // ...
];
```

## Licença

MIT

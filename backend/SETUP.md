# Setup do Backend LaTeX

## Pré-requisitos

### Windows

1. **MiKTeX** (Distribuição LaTeX completa)

   ```powershell
   # Baixar de: https://miktex.org/download
   # Ou instalar via Chocolatey:
   choco install miktex
   ```

2. **Poppler Utils** (para pdftoppm)

   ```powershell
   # Baixar de: https://github.com/oschwartz10612/poppler-windows/releases
   # Extrair e adicionar ao PATH
   ```

   OU

   **ImageMagick** (alternativa)

   ```powershell
   choco install imagemagick
   ```

3. **Node.js** (já instalado)

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y texlive-full poppler-utils
```

### macOS

```bash
brew install mactex poppler
```

## Instalação

1. **Instalar dependências do Node.js:**

   ```bash
   cd backend
   npm install
   ```

2. **Verificar dependências do sistema:**

   ```bash
   npm start
   ```

   Depois acesse: http://localhost:3001/api/check-dependencies

## Executar

### Desenvolvimento:

```bash
npm run dev
```

### Produção:

```bash
npm start
```

## Testar

```bash
# Verificar health
curl http://localhost:3001/api/health

# Verificar dependências
curl http://localhost:3001/api/check-dependencies

# Compilar LaTeX
curl -X POST http://localhost:3001/api/compile-latex \
  -H "Content-Type: application/json" \
  -d '{"latex": "\\begin{tikzpicture}\\draw (0,0) circle (1);\\end{tikzpicture}"}'
```

## Pacotes LaTeX Incluídos

- **amsmath, amsfonts, amssymb**: Matemática avançada
- **tikz**: Diagramas e gráficos vetoriais
- **pgfplots**: Gráficos de funções
- **circuitikz**: Diagramas de circuitos
- **graphicx**: Inclusão de imagens
- **xcolor**: Cores avançadas

## Bibliotecas TikZ Disponíveis

- arrows, arrows.meta
- positioning
- shapes (todas as variações)
- calc
- decorations
- patterns
- automata
- trees, graphs
- chains, fit
- backgrounds, shadows

## Solução de Problemas

### "pdflatex não encontrado"

- Windows: Certifique-se de adicionar `C:\Program Files\MiKTeX\miktex\bin\x64` ao PATH
- Reinicie o terminal após instalação

### "pdftoppm não encontrado"

- Windows: Baixe Poppler e adicione ao PATH
- Ou instale ImageMagick como alternativa

### "Erro ao compilar LaTeX"

- Verifique a sintaxe do código LaTeX
- Consulte o log retornado na resposta de erro

### Timeout na compilação

- Código LaTeX muito complexo (aumentar timeout no código)
- Recursos do sistema insuficientes

## Estrutura de Diretórios

```
backend/
├── server.js          # Servidor principal
├── package.json       # Dependências Node.js
├── SETUP.md          # Este arquivo
├── temp/             # Arquivos temporários (criado automaticamente)
└── test-server.js    # Scripts de teste (opcional)
```

## Segurança

- O servidor limpa arquivos temporários automaticamente
- Timeout de 30s para compilação LaTeX
- Limite de 10MB para requisições JSON
- Arquivos mais antigos que 1 hora são deletados automaticamente

## Performance

- Compilação típica: 2-5 segundos
- Conversão PDF→PNG: 1-3 segundos
- Limpeza automática: a cada 30 minutos

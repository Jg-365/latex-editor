#!/bin/bash

echo "========================================"
echo "  LaTeX Editor - Setup Backend"
echo "========================================"
echo ""

echo "[1/4] Verificando dependências do sistema..."
echo ""

# Verificar pdflatex
if ! command -v pdflatex &> /dev/null; then
    echo "[ERRO] pdflatex não encontrado!"
    echo ""
    echo "Por favor, instale TeX Live:"
    echo "  Ubuntu/Debian: sudo apt-get install texlive-full"
    echo "  macOS: brew install --cask mactex"
    echo ""
    exit 1
fi
echo "[OK] pdflatex encontrado: $(pdflatex --version | head -n 1)"

echo ""

# Verificar ImageMagick
if ! command -v convert &> /dev/null; then
    echo "[ERRO] ImageMagick não encontrado!"
    echo ""
    echo "Por favor, instale ImageMagick:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo ""
    exit 1
fi
echo "[OK] ImageMagick encontrado: $(convert --version | head -n 1)"

echo ""
echo "[2/4] Instalando dependências do backend..."
echo ""

cd backend || exit 1

if [ ! -f "package.json" ]; then
    echo "[ERRO] Pasta backend/package.json não encontrada!"
    exit 1
fi

npm install

if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar dependências!"
    exit 1
fi

echo ""
echo "[3/4] Configurando arquivo .env..."
echo ""

cd ..

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "[OK] Arquivo .env criado"
else
    echo "[OK] Arquivo .env já existe"
fi

echo ""
echo "[4/4] Setup concluído!"
echo ""
echo "========================================"
echo "  Próximos passos:"
echo "========================================"
echo ""
echo "1. Iniciar backend:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2. Em outro terminal, iniciar frontend:"
echo "   npm start"
echo ""
echo "========================================"
echo ""

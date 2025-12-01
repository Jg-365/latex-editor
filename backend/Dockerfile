# Use Ubuntu como base para instalar MiKTeX
FROM ubuntu:22.04

# Evitar prompts interativos
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    ca-certificates \
    poppler-utils \
    imagemagick \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# Instalar Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Instalar MiKTeX
RUN wget -qO- https://miktex.org/download/key | gpg --dearmor > /usr/share/keyrings/miktex-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/miktex-keyring.gpg] https://miktex.org/download/ubuntu jammy universe" > /etc/apt/sources.list.d/miktex.list \
    && apt-get update \
    && apt-get install -y miktex \
    && rm -rf /var/lib/apt/lists/*

# Configurar MiKTeX
RUN miktexsetup finish \
    && initexmf --set-config-value=[MPM]AutoInstall=1 \
    && mpm --admin --update-db \
    && mpm --admin --update

# Instalar pacotes LaTeX essenciais
RUN mpm --admin --install amsmath \
    && mpm --admin --install amsfonts \
    && mpm --admin --install pgf \
    && mpm --admin --install xcolor \
    && mpm --admin --install standalone \
    && mpm --admin --install circuitikz

# Criar diretório da aplicação
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências do Node.js
RUN npm ci --only=production

# Copiar código do servidor
COPY server.js ./

# Criar diretório temporário
RUN mkdir -p /app/temp && chmod 777 /app/temp

# Expor porta
EXPOSE 3001

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001

# Comando para iniciar o servidor
CMD ["node", "server.js"]

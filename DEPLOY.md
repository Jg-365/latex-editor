# 🚀 Deploy do LaTeX Editor na Vercel

## Método 1: Deploy via GitHub (MAIS FÁCIL)

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
   Framework Preset: Other
   Root Directory: latex-editor
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Adicione Environment Variables** (IMPORTANTE):

   ```
   CANVA_BACKEND_HOST = (deixe em branco por enquanto)
   CANVA_APP_ID = AAG6GZyl4rw
   CANVA_APP_ORIGIN = https://app-aag6gzyl4rw.canva-apps.com
   CANVA_HMR_ENABLED = FALSE
   ```

5. **Clique em "Deploy"** 🚀

6. **Após o deploy, você receberá uma URL**:
   - Exemplo: `https://latex-editor-xyz.vercel.app`

7. **ATUALIZE a Environment Variable**:
   - Vá em: Settings → Environment Variables
   - Edite `CANVA_BACKEND_HOST` = `https://latex-editor-xyz.vercel.app`
   - Faça um novo deploy: Deployments → ... → Redeploy

8. **Atualize no Canva Developer Portal**:
   - 🔗 https://www.canva.com/developers/apps
   - Selecione seu app (AAG6GZyl4rw)
   - Em "App URLs", coloque: `https://latex-editor-xyz.vercel.app`
   - Salve ✅

---

## Método 2: Deploy via CLI

### Instalar Vercel CLI:

```bash
npm install -g vercel
```

### Login:

```bash
vercel login
```

### Preparar e Deploy:

```bash
cd C:\latex-editor\latex-editor

# Atualizar .env temporariamente
# (Mude CANVA_BACKEND_HOST para uma URL placeholder)

# Deploy
vercel --prod
```

### Após receber a URL:

1. Atualize `CANVA_BACKEND_HOST` no dashboard Vercel
2. Faça redeploy: `vercel --prod`
3. Atualize a URL no Canva Developer Portal

---

## ⚙️ Configuração Automática de Deploy

A Vercel fará deploy automaticamente sempre que você:

- ✅ Fizer `git push` para `main`
- ✅ Criar um Pull Request (preview deploy)

---

## 🐛 Troubleshooting

### Erro: "BACKEND_HOST should not be localhost"

**Solução**: Certifique-se de que `CANVA_BACKEND_HOST` nas Environment Variables da Vercel está com a URL de produção, não localhost.

### App não carrega no Canva

1. Verifique se a URL no Canva Developer Portal está correta
2. Certifique-se de que o deploy está em "Production" (não Preview)
3. Verifique os logs no dashboard Vercel

### Erro de CORS

- Certifique-se de que todas as URLs estão corretas
- Verifique se `CANVA_APP_ORIGIN` está correto

---

## 📊 Monitoramento

Acesse: https://vercel.com/dashboard

- **Analytics**: Métricas de uso
- **Logs**: Debug de erros
- **Deployments**: Histórico

---

## 🎉 Pronto!

Seu **LaTeX Editor** com aba de gráficos agora está rodando em produção! ✨

**Funcionalidades incluídas:**

- ✨ Editor LaTeX com KaTeX
- 📊 Gerador de Gráficos com Chart.js
- 🎨 Interface moderna com gradientes
- 📏 Slider de tamanho de fonte
- 🚀 Templates avançados (itemize, matrizes, casos)

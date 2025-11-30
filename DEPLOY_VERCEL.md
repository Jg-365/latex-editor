# Guia de Deploy - LaTeX Editor no Vercel

## 🚀 Deploy Rápido

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Login na Vercel

```bash
vercel login
```

### 3. Deploy

```bash
cd latex-editor
vercel
```

Siga as instruções:

- **Set up and deploy?** → Yes
- **Which scope?** → Selecione sua conta
- **Link to existing project?** → No
- **Project name?** → latex-editor (ou o nome que preferir)
- **Directory?** → ./
- **Override settings?** → No

### 4. Deploy de Produção

```bash
vercel --prod
```

## 🌐 Deploy via Dashboard Vercel

### Método Alternativo (Recomendado para GitHub):

1. **Acesse**: https://vercel.com/new
2. **Import Git Repository**: Conecte seu repositório `Jg-365/latex-editor`
3. **Configure o projeto**:
   - **Framework Preset**: Other
   - **Root Directory**: `latex-editor`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables** (adicione no dashboard):

   ```
   CANVA_FRONTEND_PORT=8080
   CANVA_BACKEND_PORT=3001
   CANVA_BACKEND_HOST=https://seu-app.vercel.app
   CANVA_APP_ID=AAG6GZyl4rw
   CANVA_APP_ORIGIN=https://app-aag6gzyl4rw.canva-apps.com
   CANVA_HMR_ENABLED=FALSE
   ```

5. **Deploy**: Clique em "Deploy"

## ⚙️ Configuração Pós-Deploy

### Atualizar URL no Canva

Após o deploy, você receberá uma URL como:

```
https://latex-editor-xyz.vercel.app
```

**Atualize no Canva Developer Portal:**

1. Acesse: https://www.canva.com/developers/apps
2. Selecione seu app (AAG6GZyl4rw)
3. Em **App URLs**, atualize:
   - **App URL**: `https://seu-app.vercel.app`
4. Salve as alterações

### Atualizar .env local

```bash
CANVA_BACKEND_HOST=https://seu-app.vercel.app
CANVA_HMR_ENABLED=FALSE
```

## 🔄 Deploy Automático

A Vercel automaticamente faz deploy quando você:

- Faz push para a branch `main`
- Cria um Pull Request (preview deploy)

## 📊 Monitoramento

Acesse o dashboard: https://vercel.com/dashboard

- **Analytics**: Veja métricas de uso
- **Logs**: Debug de erros
- **Deployments**: Histórico de deploys

## ⚡ Comandos Úteis

```bash
# Ver deployments
vercel ls

# Ver logs
vercel logs <deployment-url>

# Remover deployment
vercel rm <deployment-name>

# Abrir dashboard
vercel dashboard
```

## 🐛 Troubleshooting

### Erro de Build

```bash
# Testar build localmente
npm run build

# Verificar dist/
ls -la dist/
```

### Erro de CORS

- Certifique-se de que `CANVA_BACKEND_HOST` está correto
- Verifique as configurações de CORS no Canva Developer Portal

### App não carrega no Canva

1. Verifique se a URL no Canva Developer Portal está correta
2. Certifique-se de que o app está em produção (`vercel --prod`)
3. Verifique os logs no dashboard Vercel

## 📱 App Canva - Passos Finais

Depois do deploy na Vercel:

1. **Teste o app**:
   - Abrir Canva
   - Acessar "Apps"
   - Buscar seu app "LaTeX Editor"

2. **Submissão (Opcional)**:
   - Se quiser publicar para todos os usuários
   - Acesse Canva Developer Portal → Submit for Review

## 🎉 Pronto!

Seu LaTeX Editor agora está rodando em produção na Vercel! ✨

**URL do Deploy**: Será fornecida após executar `vercel --prod`
**Monitoramento**: https://vercel.com/dashboard

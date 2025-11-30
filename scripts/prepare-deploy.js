#!/usr/bin/env node

/**
 * Script para preparar o app para deploy na Vercel
 *
 * Este script:
 * 1. Cria um .env.production com configurações para produção
 * 2. Copia para .env temporariamente
 * 3. Executa o build
 * 4. Restaura o .env original
 */

const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

console.log("🚀 Preparando deploy para Vercel...\n");

// 1. Backup do .env atual
console.log("📦 Fazendo backup do .env...");
const envPath = path.join(__dirname, "..", ".env");
const envBackupPath = path.join(__dirname, "..", ".env.backup");

if (fs.existsSync(envPath)) {
  fs.copyFileSync(envPath, envBackupPath);
  console.log("✅ Backup criado\n");
}

// 2. Criar .env.production
console.log("📝 Criando .env de produção...");
const productionEnv = `CANVA_FRONTEND_PORT=8080
CANVA_BACKEND_PORT=3001
CANVA_BACKEND_HOST=https://your-app.vercel.app
CANVA_APP_ID=AAG6GZyl4rw
CANVA_APP_ORIGIN=https://app-aag6gzyl4rw.canva-apps.com
CANVA_HMR_ENABLED=FALSE
`;

fs.writeFileSync(envPath, productionEnv);
console.log("✅ .env de produção criado\n");

// 3. Build
console.log("🔨 Executando build...");
try {
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Build concluído com sucesso!\n");
} catch (error) {
  console.error("❌ Erro no build:", error.message);
  process.exit(1);
} finally {
  // 4. Restaurar .env original
  console.log("♻️ Restaurando .env original...");
  if (fs.existsSync(envBackupPath)) {
    fs.copyFileSync(envBackupPath, envPath);
    fs.unlinkSync(envBackupPath);
    console.log("✅ .env restaurado\n");
  }
}

console.log("🎉 Pronto para deploy!\n");
console.log("Execute: vercel --prod\n");
console.log(
  "⚠️ Lembre-se de atualizar CANVA_BACKEND_HOST com a URL da Vercel após o primeiro deploy!",
);

# 📥 Instalar ImageMagick no Windows

## Problema: Chocolatey sem permissões de admin

Se o comando `choco install imagemagick` falhar com erro de acesso negado, use a instalação manual:

## ✅ Método 1: Instalação Manual (Recomendado)

### Passo 1: Download

1. Acesse: https://imagemagick.org/script/download.php#windows
2. Baixe o instalador Windows:
   - **64-bit**: `ImageMagick-7.x.x-Q16-HDRI-x64-dll.exe`
   - **32-bit**: `ImageMagick-7.x.x-Q16-HDRI-x86-dll.exe`

### Passo 2: Instalar

1. Execute o instalador baixado
2. **IMPORTANTE**: Marque estas opções durante a instalação:
   - ✅ **"Add application directory to your system path"**
   - ✅ **"Install legacy utilities (e.g. convert)"**
   - ✅ **"Install FFmpeg"** (opcional, mas recomendado)

### Passo 3: Verificar

Abra um **novo** PowerShell (importante: novo terminal!) e teste:

```powershell
convert --version
```

Deve mostrar algo como:

```
Version: ImageMagick 7.1.x.x Q16-HDRI x64
```

### Passo 4: Reiniciar se necessário

Se o comando `convert` não for encontrado:

1. **Reinicie o computador** (para atualizar o PATH)
2. Abra novo PowerShell e teste novamente

---

## ✅ Método 2: Chocolatey com Admin

Se você tem acesso de administrador:

### Opção A: PowerShell como Admin

```powershell
# Abra PowerShell como Administrador (botão direito → "Executar como Administrador")
choco install imagemagick -y
```

### Opção B: Script Automático

Execute este script PowerShell como Admin:

```powershell
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Precisa de permissões de Administrador!"
    Start-Process powershell -Verb RunAs -ArgumentList "-NoExit", "-Command", "choco install imagemagick -y"
    exit
}
choco install imagemagick -y
```

---

## ✅ Método 3: Winget (Windows 10/11)

```powershell
winget install ImageMagick.ImageMagick
```

---

## ✅ Método 4: Scoop (Alternativa ao Chocolatey)

```powershell
# Instalar Scoop (se não tiver)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Instalar ImageMagick
scoop install imagemagick
```

---

## 🔧 Solução de Problemas

### "convert: command not found"

**Causa**: PATH não atualizado

**Solução**:

1. Reinicie o computador
2. OU adicione manualmente ao PATH:
   - Painel de Controle → Sistema → Configurações Avançadas
   - Variáveis de Ambiente
   - PATH → Adicionar: `C:\Program Files\ImageMagick-7.x.x-Q16-HDRI`

### "convert.exe: not authorized"

**Causa**: Política de segurança do ImageMagick

**Solução**: Edite `C:\Program Files\ImageMagick-7.x.x-Q16-HDRI\policy.xml`:

Encontre esta linha:

```xml
<policy domain="coder" rights="none" pattern="PDF" />
```

Altere para:

```xml
<policy domain="coder" rights="read|write" pattern="PDF" />
```

### Conflito com Windows "convert.exe"

Windows tem um comando `convert.exe` nativo (conversão de disco). Se houver conflito:

```powershell
# Use o caminho completo
& "C:\Program Files\ImageMagick-7.x.x-Q16-HDRI\convert.exe" --version

# OU use o comando moderno do ImageMagick
magick --version
magick convert input.pdf output.png
```

---

## ✅ Verificação Final

Após instalar, teste todos os comandos necessários:

```powershell
# ImageMagick versão
convert --version

# OU (versão moderna)
magick --version

# Testar conversão PDF → PNG (após instalar MiKTeX)
echo "\documentclass{article}\begin{document}Hello\end{document}" > test.tex
pdflatex test.tex
convert -density 300 test.pdf test.png
ls test.png
```

Se `test.png` foi criado com sucesso, você está pronto! 🎉

---

## 🚀 Próximos Passos

Após instalar ImageMagick e MiKTeX:

```powershell
# Voltar ao setup
.\setup-backend.bat

# OU manual:
cd backend
npm install
npm start
```

---

## 📞 Ainda com problemas?

1. **Verifique se MiKTeX está instalado**: `pdflatex --version`
2. **Reinicie o computador** para atualizar variáveis de ambiente
3. **Use instalação manual** do site oficial (mais confiável que Chocolatey)
4. **Confira o PATH**: `$env:PATH -split ';' | Select-String ImageMagick`

---

**Nota**: A instalação manual é mais confiável que Chocolatey para ImageMagick no Windows!

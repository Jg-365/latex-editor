const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const { promisify } = require("util");

const execPromise = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

// Adicionar MiKTeX ao PATH do processo se existir
const miktexPath =
  "C:\\Users\\Dr José Clerton\\AppData\\Local\\Programs\\MiKTeX\\miktex\\bin\\x64";
if (process.env.PATH && !process.env.PATH.includes("MiKTeX")) {
  process.env.PATH = `${miktexPath};${process.env.PATH}`;
  console.log("✅ MiKTeX adicionado ao PATH do processo");
}

// Configurações CORS para produção
const allowedOrigins = [
  "http://localhost:8080",
  "https://app-aag6gzyl4rw.canva-apps.com",
  /\.vercel\.app$/,
  /\.onrender\.com$/,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requisições sem origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      // Verificar se a origin está na lista permitida
      const isAllowed = allowedOrigins.some((allowed) => {
        if (typeof allowed === "string") return allowed === origin;
        return allowed.test(origin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));

// Ignorar requisições de favicon para evitar avisos CSP
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Rota raiz informativa
app.get("/", (req, res) => {
  res.json({
    name: "LaTeX Compiler API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      compile: "POST /compile",
      health: "GET /api/health",
      dependencies: "GET /api/check-dependencies",
    },
    message:
      "Backend LaTeX está funcionando! Use POST /compile para compilar LaTeX.",
  });
});

// Diretório temporário para compilação
const TEMP_DIR = path.join(__dirname, "temp");

// Criar diretório temp se não existir
(async () => {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
    console.log("📁 Diretório temporário criado");
  } catch (error) {
    console.error("Erro ao criar diretório:", error);
  }
})();

// Limpar arquivos antigos (mais de 1 hora)
async function cleanOldFiles() {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      const stats = await fs.stat(filePath);

      if (now - stats.mtimeMs > 3600000) {
        // 1 hora
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error("Erro ao limpar arquivos:", error);
  }
}

// Limpar a cada 30 minutos
setInterval(cleanOldFiles, 1800000);

// Template LaTeX completo
function createLatexDocument(content, packages = []) {
  const defaultPackages = [
    "amsmath",
    "amsfonts",
    "amssymb",
    "tikz",
    "pgfplots",
    "circuitikz",
    "graphicx",
    "xcolor",
  ];

  const allPackages = [...new Set([...defaultPackages, ...packages])];
  const packageLines = allPackages
    .map((pkg) => `\\usepackage{${pkg}}`)
    .join("\n");

  return `\\documentclass[border=10pt]{standalone}
${packageLines}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}

% Bibliotecas TikZ
\\usetikzlibrary{
  arrows,
  arrows.meta,
  positioning,
  shapes,
  shapes.geometric,
  shapes.multipart,
  calc,
  decorations.pathmorphing,
  decorations.markings,
  patterns,
  automata,
  trees,
  graphs,
  chains,
  fit,
  backgrounds,
  shadows
}

% Configurações PGFPlots
\\pgfplotsset{compat=newest}

\\begin{document}
${content}
\\end{document}
`;
}

// Endpoint para compilar LaTeX
app.post("/api/compile", async (req, res) => {
  let { latex, packages = [], transparent = false } = req.body;

  if (!latex || typeof latex !== "string") {
    return res.status(400).json({
      error: "Código LaTeX inválido",
      message: 'O campo "latex" é obrigatório e deve ser uma string.',
    });
  }

  // Limpar o código LaTeX
  // 1. Remover emojis e caracteres Unicode problemáticos
  latex = latex.replace(/[\u{1F000}-\u{1F9FF}]/gu, "");

  // 2. Remover \begin{figure} e \end{figure} (incompatível com standalone)
  latex = latex.replace(/\\begin\{figure\}(\[.*?\])?/g, "");
  latex = latex.replace(/\\end\{figure\}/g, "");
  latex = latex.replace(/\\centering/g, "");

  // 3. Limpar espaços extras
  latex = latex.trim();

  const sessionId = Date.now() + "-" + Math.random().toString(36).substring(7);
  const texFile = path.join(TEMP_DIR, `${sessionId}.tex`);
  const pdfFile = path.join(TEMP_DIR, `${sessionId}.pdf`);
  const pngFile = path.join(TEMP_DIR, `${sessionId}.png`);
  const logFile = path.join(TEMP_DIR, `${sessionId}.log`);

  try {
    // Criar documento LaTeX completo
    const fullDocument = createLatexDocument(latex, packages);

    // Salvar para debug
    console.log("=== LaTeX Input COMPLETO ===");
    console.log(`Tamanho: ${latex.length} caracteres`);
    console.log(latex);
    console.log("=== FIM DO INPUT ===");

    await fs.writeFile(texFile, fullDocument, "utf8");

    // Compilar com pdflatex
    const pdflatexCmd = `pdflatex -interaction=nonstopmode -output-directory="${TEMP_DIR}" "${texFile}"`;

    try {
      await execPromise(pdflatexCmd, {
        cwd: TEMP_DIR,
        timeout: 30000, // 30 segundos
      });
    } catch (pdfError) {
      // Tentar ler o log para obter detalhes do erro
      let errorDetails = "Erro de compilação LaTeX";
      try {
        const logContent = await fs.readFile(logFile, "utf8");
        const errorMatch = logContent.match(/! (.+?)(?:\r?\n|$)/);
        if (errorMatch) {
          errorDetails = errorMatch[1];
        }
      } catch (logError) {
        // Log não disponível
      }

      throw new Error(errorDetails);
    }

    // Verificar se o PDF foi gerado
    try {
      await fs.access(pdfFile);
    } catch {
      throw new Error("PDF não foi gerado. Verifique a sintaxe do LaTeX.");
    }

    // Converter PDF para PNG usando pdftoppm com alta resolução
    console.log(
      "✅ PDF gerado com sucesso, convertendo para PNG em alta qualidade...",
    );

    const pngBase = path.join(TEMP_DIR, sessionId);
    // Usar 1200 DPI para máxima qualidade vetorial
    const convertCmd = `pdftoppm -png -singlefile -r 1200 -aa yes -aaVector yes "${pdfFile}" "${pngBase}"`;

    try {
      await execPromise(convertCmd, { timeout: 40000 });
      console.log(
        "✅ PNG gerado em máxima resolução (1200 DPI + anti-aliasing)",
      );
    } catch (convertError) {
      console.error("❌ Erro ao converter PDF para PNG:", convertError.message);
      throw new Error(
        "Erro ao converter PDF para PNG. pdftoppm pode não estar instalado.",
      );
    }

    // Ler PNG gerado (pdftoppm gera sessionId.png)
    let generatedPng = `${pngBase}.png`;

    try {
      await fs.access(generatedPng);
    } catch {
      throw new Error("PNG não foi gerado após conversão");
    }

    // Se fundo transparente foi solicitado, processar com ImageMagick
    if (transparent) {
      console.log("🎨 Removendo fundo branco...");
      const transparentPng = path.join(
        TEMP_DIR,
        `${sessionId}-transparent.png`,
      );
      const makeTransparentCmd = `magick "${generatedPng}" -fuzz 10% -transparent white "${transparentPng}"`;

      try {
        await execPromise(makeTransparentCmd, { timeout: 10000 });
        generatedPng = transparentPng;
        console.log("✅ Fundo removido com sucesso");
      } catch (transparentError) {
        console.log(
          "⚠️ Não foi possível remover o fundo, usando imagem original",
        );
      }
    }

    const pngBuffer = await fs.readFile(generatedPng);
    const base64Image = pngBuffer.toString("base64");
    console.log(`✅ PNG lido (${(base64Image.length / 1024).toFixed(1)} KB)`);

    // Obter dimensões da imagem
    let dimensions = null;
    try {
      const identifyCmd = `magick identify -format "%wx%h" "${generatedPng}"`;
      const { stdout } = await execPromise(identifyCmd);
      const [width, height] = stdout.trim().split("x").map(Number);
      dimensions = { width, height };
      console.log(`📐 Dimensões: ${width}x${height}px`);
    } catch (identifyError) {
      console.log("⚠️ Não foi possível obter dimensões");
    }

    // Limpar arquivos temporários
    setTimeout(async () => {
      try {
        await fs.unlink(texFile).catch(() => {});
        await fs.unlink(pdfFile).catch(() => {});
        await fs.unlink(generatedPng).catch(() => {});
        await fs.unlink(logFile).catch(() => {});
        await fs
          .unlink(path.join(TEMP_DIR, `${sessionId}.aux`))
          .catch(() => {});
      } catch (cleanError) {
        console.error("Erro ao limpar arquivos:", cleanError);
      }
    }, 5000);

    res.json({
      success: true,
      image: base64Image,
      sessionId,
      dimensions,
    });
  } catch (error) {
    // Limpar arquivos em caso de erro
    const pngBase = path.join(TEMP_DIR, sessionId);
    await fs.unlink(texFile).catch(() => {});
    await fs.unlink(pdfFile).catch(() => {});
    await fs.unlink(`${pngBase}.png`).catch(() => {});
    await fs.unlink(logFile).catch(() => {});

    console.error("Erro ao compilar LaTeX:", error);

    res.status(500).json({
      error: "Erro ao compilar LaTeX",
      message: error.message || "Erro desconhecido",
      details: error.toString(),
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Servidor LaTeX rodando",
    timestamp: new Date().toISOString(),
  });
});

// Verificar dependências
app.get("/api/check-dependencies", async (req, res) => {
  const dependencies = {
    pdflatex: false,
    pdftoppm: false,
    imagemagick: false,
  };

  // Tentar caminhos comuns do MiKTeX no Windows
  const pdflatexPaths = [
    "pdflatex",
    "C:\\Users\\Dr José Clerton\\AppData\\Local\\Programs\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe",
    "C:\\Program Files\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe",
  ];

  for (const pdflatexPath of pdflatexPaths) {
    try {
      await execPromise(`"${pdflatexPath}" --version`);
      dependencies.pdflatex = true;
      break;
    } catch {}
  }

  try {
    await execPromise("pdftoppm -v");
    dependencies.pdftoppm = true;
  } catch {}

  try {
    await execPromise("magick --version");
    dependencies.imagemagick = true;
  } catch {}

  try {
    await execPromise("convert --version");
    if (!dependencies.imagemagick) {
      dependencies.imagemagick = true;
    }
  } catch {}

  const ready =
    dependencies.pdflatex &&
    (dependencies.pdftoppm || dependencies.imagemagick);

  res.json({
    ready,
    dependencies,
    message: ready
      ? "Todas as dependências estão instaladas"
      : "Instale pdflatex e pdftoppm ou ImageMagick",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor LaTeX rodando na porta ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `📦 Verificar dependências: http://localhost:${PORT}/api/check-dependencies`,
  );
});

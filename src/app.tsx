import { Button, Rows, Text, Title } from "@canva/app-ui-kit";
import { addElementAtPoint } from "@canva/design";
import React, { useState, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import html2canvas from "html2canvas";
import { LatexPreview } from "./components/LatexPreview";
import { TemplateSelector } from "./components/TemplateSelector";
import { AutoExpandingTextarea } from "./components/AutoExpandingTextarea";
import { GraphTab } from "./components/GraphTab";
import * as styles from "./styles/app.css";
// Inline minimal HistoryPanel, HistoryItem, OptionsPanel and LatexOptions
// to avoid missing-module errors for './components/HistoryPanel' and './components/OptionsPanel'.

export type HistoryItem = {
  latex: string;
  timestamp: number;
};

export const HistoryPanel: React.FC<{
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}> = ({ history, onSelect }) => {
  if (!history || history.length === 0) return null;
  return (
    <div style={{ border: "1px solid #eee", padding: 8, borderRadius: 6 }}>
      <Text size="small" tone="secondary">
        Histórico
      </Text>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginTop: 8,
        }}
      >
        {history.map((item) => (
          <button
            key={item.timestamp}
            onClick={() => onSelect(item)}
            style={{
              width: "100%",
              padding: "8px",
              background: "transparent",
              border: "none",
              borderRadius: 6,
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {item.latex}
            </span>
            <span style={{ opacity: 0.6, marginLeft: 8, fontSize: 12 }}>
              {new Date(item.timestamp).toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export type LatexOptions = {
  fontSize: number;
  color: string;
  displayMode: boolean;
};

export const OptionsPanel: React.FC<{
  options: LatexOptions;
  onChange: (newOptions: Partial<LatexOptions>) => void;
}> = ({ options, onChange }) => {
  return (
    <div className={styles.optionsContainer}>
      <div className={styles.optionItem}>
        <label className={styles.label}>
          📏 Tamanho:{" "}
          <span className={styles.sizeValue}>{options.fontSize}px</span>
        </label>
        <input
          type="range"
          value={options.fontSize}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!Number.isNaN(n) && n > 0) onChange({ fontSize: n });
          }}
          min="12"
          max="200"
          step="1"
          className={styles.slider}
        />
        <input
          type="number"
          value={options.fontSize}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!Number.isNaN(n) && n > 0) onChange({ fontSize: n });
          }}
          placeholder="48"
          min="12"
          max="200"
          className={styles.inputSmall}
        />
      </div>

      <div className={styles.optionItem}>
        <label className={styles.label}>🎨 Cor</label>
        <input
          type="color"
          value={options.color}
          onChange={(e) => onChange({ color: e.target.value })}
          className={styles.colorPicker}
          aria-label="Color"
        />
      </div>

      <div className={styles.optionItem}>
        <label className={styles.label}>💫 Modo</label>
        <button
          className={`${styles.modeButton} ${options.displayMode ? styles.active : ""}`}
          onClick={() => onChange({ displayMode: !options.displayMode })}
        >
          {options.displayMode ? "📐 Display" : "📝 Inline"}
        </button>
      </div>
    </div>
  );
};

const BACKEND_URL =
  typeof BACKEND_HOST !== "undefined"
    ? BACKEND_HOST
    : import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export const App = () => {
  const [activeTab, setActiveTab] = useState<"latex" | "graph">("latex");
  const [latex, setLatex] = useState<string>("E = mc^2");
  const [options, setOptions] = useState<LatexOptions>({
    fontSize: 48,
    color: "#000000",
    displayMode: false,
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [compiledImage, setCompiledImage] = useState<string>("");
  const [useBackend, setUseBackend] = useState(false);
  const [transparentBackground, setTransparentBackground] = useState(false);

  // Detectar se precisa usar backend para compilação
  useEffect(() => {
    const advancedLatexPatterns =
      /\\begin\{(itemize|enumerate|description|tikzpicture|tabular|figure|align|equation|cases|pmatrix|bmatrix|vmatrix|matrix)\}|\\item\b|\\usepackage|\\documentclass/;

    if (advancedLatexPatterns.test(latex)) {
      setUseBackend(true);
      setError("");
    } else {
      setUseBackend(false);
      // Validar fórmulas simples com KaTeX
      try {
        katex.renderToString(latex, {
          displayMode: options.displayMode,
          throwOnError: true,
          trust: true,
        });
        setError("");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }
  }, [latex, options.displayMode]);

  // Compilar LaTeX avançado com backend
  const compileWithBackend = async () => {
    if (!useBackend || !latex.trim()) return;

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex, transparent: transparentBackground }),
      });

      const data = await response.json();

      if (data.success && data.image) {
        setCompiledImage(`data:image/png;base64,${data.image}`);
        setError("");
      } else {
        setError(data.error || "Erro ao compilar LaTeX");
        setCompiledImage("");
      }
    } catch (err) {
      console.error("Backend error:", err);
      setError(
        "Backend indisponível. Instale MiKTeX, ImageMagick e execute: cd backend && npm install && npm start",
      );
      setCompiledImage("");
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-compilar quando código LaTeX avançado muda
  useEffect(() => {
    if (useBackend) {
      const timer = setTimeout(() => {
        compileWithBackend();
      }, 1000); // Debounce de 1 segundo
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [latex, useBackend, transparentBackground]);

  const handleAddToDesign = async () => {
    if (error || !latex.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      let dataUrl: string;
      let imageWidth = 400;
      let imageHeight = 300;

      if (useBackend && compiledImage) {
        // Usar imagem compilada pelo backend
        dataUrl = compiledImage;

        // Obter dimensões reais da imagem
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = compiledImage;
        });
        imageWidth = img.naturalWidth;
        imageHeight = img.naturalHeight;

        // Escalar para caber no design (máximo 800px de largura)
        const maxWidth = 800;
        if (imageWidth > maxWidth) {
          const scale = maxWidth / imageWidth;
          imageWidth = maxWidth;
          imageHeight = Math.round(imageHeight * scale);
        }
      } else {
        // Renderizar com KaTeX (fórmulas simples)
        const html = katex.renderToString(latex, {
          displayMode: options.displayMode,
          throwOnError: true,
          output: "html",
        });

        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.top = "0";
        container.style.fontSize = `${options.fontSize}px`;
        container.style.color = options.color;
        container.style.padding = "40px";
        container.style.background = "transparent";
        container.innerHTML = html;
        document.body.appendChild(container);

        const canvas = await html2canvas(container, {
          backgroundColor: null,
          scale: 2,
          logging: false,
          useCORS: true,
        });

        document.body.removeChild(container);
        dataUrl = canvas.toDataURL("image/png");
        imageWidth = canvas.width;
        imageHeight = canvas.height;
      }

      // Adicionar ao design com dimensões corretas
      await addElementAtPoint({
        type: "image",
        dataUrl: dataUrl,
        altText: undefined,
        top: 0,
        left: 0,
        width: imageWidth,
        height: imageHeight,
      });

      // Adicionar ao histórico
      const newHistoryItem: HistoryItem = {
        latex: latex,
        timestamp: Date.now(),
      };
      setHistory((prev: HistoryItem[]) => [
        newHistoryItem,
        ...prev.slice(0, 9),
      ]);
    } catch (err) {
      console.error("Error adding to design:", err);
      setError("Erro ao adicionar ao design. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setLatex(template);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setLatex(item.latex);
  };

  const handleOptionsChange = (newOptions: Partial<LatexOptions>) => {
    setOptions((prev: LatexOptions) => ({ ...prev, ...newOptions }));
  };

  return (
    <div className={styles.container}>
      <Rows spacing="2u">
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === "latex" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("latex")}
          >
            ✨ LaTeX & Diagramas
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "graph" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("graph")}
          >
            📊 Gráficos
          </button>
        </div>

        {activeTab === "latex" && (
          <>
            <div className={styles.header}>
              <Title size="medium">✨ Editor LaTeX Completo</Title>
              <Text size="small" tone="tertiary">
                Equações, diagramas TikZ, tabelas, listas - qualquer código
                LaTeX!
              </Text>
            </div>

            <div className={styles.inputSection}>
              <label className={styles.inputLabel}>
                <span>📝</span> Digite seu código LaTeX:
              </label>
              <AutoExpandingTextarea
                value={latex}
                onChange={setLatex}
                placeholder="Ex: E = mc^2 ou \begin{tikzpicture}...\end{tikzpicture}"
                minRows={2}
                maxRows={12}
              />
              {useBackend && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "8px",
                  }}
                >
                  <Text size="xsmall" tone="tertiary">
                    🚀 Usando compilação backend (suporta TikZ, tabelas, etc.)
                  </Text>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={transparentBackground}
                      onChange={(e) =>
                        setTransparentBackground(e.target.checked)
                      }
                      style={{ cursor: "pointer" }}
                    />
                    <Text size="xsmall">🎨 Fundo transparente</Text>
                  </label>
                </div>
              )}
            </div>

            {error && (
              <div className={styles.error}>
                <Text size="small" tone="critical">
                  ⚠️ {error}
                </Text>
              </div>
            )}

            {useBackend && compiledImage ? (
              <div className={styles.previewContainer}>
                <img
                  src={compiledImage}
                  alt="LaTeX compilado"
                  style={{
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>
            ) : (
              <LatexPreview
                latex={latex}
                options={options}
                hasError={!!error}
              />
            )}

            {!useBackend && (
              <OptionsPanel options={options} onChange={handleOptionsChange} />
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={styles.addButton}
                onClick={handleAddToDesign}
                disabled={!!error || !latex.trim() || isProcessing}
                style={{ flex: 1 }}
              >
                <span className={styles.buttonIcon}>
                  {isProcessing ? "⏳" : "✨"}
                </span>
                <span className={styles.buttonText}>
                  {isProcessing ? "Adicionando..." : "Adicionar ao Design"}
                </span>
              </button>

              {useBackend && (
                <button
                  className={styles.addButton}
                  onClick={compileWithBackend}
                  disabled={isProcessing}
                  style={{ flex: 0, minWidth: "auto", padding: "0 20px" }}
                >
                  🔄
                </button>
              )}
            </div>

            <TemplateSelector onSelect={handleTemplateSelect} />

            {history.length > 0 && (
              <HistoryPanel history={history} onSelect={handleHistorySelect} />
            )}

            <div className={styles.footer}>
              <Text size="xsmall" tone="tertiary" alignment="center">
                {useBackend ? "Powered by pdflatex" : "Powered by KaTeX"}
              </Text>
            </div>
          </>
        )}

        {activeTab === "graph" && <GraphTab />}
      </Rows>
    </div>
  );
};

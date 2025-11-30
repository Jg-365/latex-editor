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

  // Validar LaTeX ao digitar (apenas para fórmulas simples)
  useEffect(() => {
    // Se contém comandos avançados do LaTeX, não valida com KaTeX
    const advancedLatexPatterns =
      /\\begin\{(itemize|enumerate|description|tikzpicture|tabular|figure|align|equation|cases|pmatrix|bmatrix|vmatrix|matrix)\}|\\item\b|\\usepackage|\\documentclass/;

    if (advancedLatexPatterns.test(latex)) {
      setError(""); // LaTeX avançado será validado pelo renderizador customizado
      return;
    }

    // Para fórmulas matemáticas simples, valida com KaTeX
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
  }, [latex, options.displayMode]);

  const handleAddToDesign = async () => {
    if (error || !latex.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      // Renderizar LaTeX para HTML
      const html = katex.renderToString(latex, {
        displayMode: options.displayMode,
        throwOnError: true,
        output: "html",
      });

      // Criar elemento temporário para renderizar
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

      // Usar html2canvas para capturar o elemento com todas as fontes e estilos
      const canvas = await html2canvas(container, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      });

      document.body.removeChild(container);

      // Converter canvas para PNG data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Adicionar ao design usando API atualizada com dimensões
      await addElementAtPoint({
        type: "image",
        dataUrl: dataUrl,
        altText: undefined,
        top: 0,
        left: 0,
        width: canvas.width / 2,
        height: canvas.height / 2,
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
            ✨ LaTeX
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
              <Title size="medium">✨ Editor de Equações LaTeX</Title>
              <Text size="small" tone="tertiary">
                Crie equações matemáticas profissionais para seus designs
              </Text>
            </div>

            <div className={styles.inputSection}>
              <label className={styles.inputLabel}>
                <span>📝</span> Digite sua equação LaTeX:
              </label>
              <AutoExpandingTextarea
                value={latex}
                onChange={setLatex}
                placeholder="Ex: E = mc^2 ou \frac{a}{b} ou \int_{0}^{\infty} e^{-x} dx"
                minRows={2}
                maxRows={12}
              />
            </div>

            {error && (
              <div className={styles.error}>
                <Text size="small" tone="critical">
                  ⚠️ {error}
                </Text>
              </div>
            )}

            <LatexPreview latex={latex} options={options} hasError={!!error} />

            <OptionsPanel options={options} onChange={handleOptionsChange} />

            <button
              className={styles.addButton}
              onClick={handleAddToDesign}
              disabled={!!error || !latex.trim() || isProcessing}
            >
              <span className={styles.buttonIcon}>
                {isProcessing ? "⏳" : "✨"}
              </span>
              <span className={styles.buttonText}>
                {isProcessing ? "Adicionando..." : "Adicionar ao Design"}
              </span>
            </button>

            <TemplateSelector onSelect={handleTemplateSelect} />

            {history.length > 0 && (
              <HistoryPanel history={history} onSelect={handleHistorySelect} />
            )}

            <div className={styles.footer}>
              <Text size="xsmall" tone="tertiary" alignment="center">
                Powered by KaTeX
              </Text>
            </div>
          </>
        )}

        {activeTab === "graph" && <GraphTab />}
      </Rows>
    </div>
  );
};

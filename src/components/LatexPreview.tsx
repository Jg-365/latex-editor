import React from "react";
import katex from "katex";
import * as styles from "../styles/preview.css";
import { renderAdvancedLatex } from "../utils/latexRenderer";

interface LatexPreviewProps {
  latex: string;
  options: {
    fontSize: number;
    color: string;
    displayMode: boolean;
  };
  hasError: boolean;
}

// Detecta se o LaTeX usa recursos avançados que KaTeX não suporta
const needsAdvancedLatex = (latex: string): boolean => {
  const advancedPatterns = [
    /\\begin\{(itemize|enumerate|description|tabular|cases|align|pmatrix|bmatrix|vmatrix|matrix)\}/,
    /\\item\b/,
  ];

  return advancedPatterns.some((pattern) => pattern.test(latex));
};

export const LatexPreview: React.FC<LatexPreviewProps> = ({
  latex,
  options,
  hasError,
}) => {
  const usesAdvancedLatex = needsAdvancedLatex(latex);

  const renderLatex = () => {
    if (hasError || !latex.trim()) {
      return null;
    }

    // Se usa recursos avançados de LaTeX, usa renderizador customizado
    if (usesAdvancedLatex) {
      try {
        const html = renderAdvancedLatex(latex, options);
        return (
          <div
            className={styles.preview}
            style={{
              fontSize: `${options.fontSize}px`,
              color: options.color,
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (error) {
        console.error("Error rendering advanced LaTeX:", error);
        return (
          <div
            style={{ textAlign: "center", padding: "20px", color: "#dc3545" }}
          >
            ⚠️ Erro ao renderizar LaTeX avançado
          </div>
        );
      }
    }

    // Para fórmulas matemáticas simples, usa KaTeX
    try {
      const html = katex.renderToString(latex, {
        displayMode: options.displayMode,
        throwOnError: false,
        trust: true,
      });

      return (
        <div
          className={styles.preview}
          style={{
            fontSize: `${options.fontSize}px`,
            color: options.color,
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        Pré-visualização:{" "}
        {usesAdvancedLatex && (
          <span style={{ color: "#667eea", fontWeight: 700 }}>
            ✨ LaTeX Avançado
          </span>
        )}
      </div>
      <div className={styles.box}>{renderLatex()}</div>
    </div>
  );
};

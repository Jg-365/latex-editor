import katex from "katex";

// Renderiza LaTeX avançado usando HTML/CSS
export const renderAdvancedLatex = (
  latex: string,
  options: { fontSize: number; color: string },
): string => {
  let html = latex;

  // Itemize
  if (html.includes("\\begin{itemize}")) {
    html = html.replace(
      /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
      (_, content) => {
        const items = content
          .split("\\item")
          .filter((item: string) => item.trim());
        const itemsHtml = items
          .map(
            (item: string) =>
              `<li style="margin: 8px 0; text-align: left;">${processInlineMath(item.trim())}</li>`,
          )
          .join("");
        return `<ul style="list-style-type: disc; padding-left: 20px; margin: 12px 0; text-align: left;">${itemsHtml}</ul>`;
      },
    );
  }

  // Enumerate
  if (html.includes("\\begin{enumerate}")) {
    html = html.replace(
      /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
      (_, content) => {
        const items = content
          .split("\\item")
          .filter((item: string) => item.trim());
        const itemsHtml = items
          .map(
            (item: string) =>
              `<li style="margin: 8px 0; text-align: left;">${processInlineMath(item.trim())}</li>`,
          )
          .join("");
        return `<ol style="padding-left: 20px; margin: 12px 0; text-align: left;">${itemsHtml}</ol>`;
      },
    );
  }

  // Cases (sistemas de equações)
  if (html.includes("\\begin{cases}")) {
    html = html.replace(
      /\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g,
      (_, content) => {
        const lines = content
          .split("\\\\")
          .filter((line: string) => line.trim());
        const linesHtml = lines
          .map((line: string) => {
            try {
              return katex.renderToString(line.trim(), {
                displayMode: false,
                throwOnError: false,
              });
            } catch {
              return line.trim();
            }
          })
          .join("<br>");
        return `<div style="display: inline-block; text-align: left; border-left: 2px solid currentColor; padding-left: 12px; margin: 8px 0;">${linesHtml}</div>`;
      },
    );
  }

  // Align
  if (html.includes("\\begin{align}")) {
    html = html.replace(
      /\\begin\{align\}([\s\S]*?)\\end\{align\}/g,
      (_, content) => {
        const lines = content
          .split("\\\\")
          .filter((line: string) => line.trim());
        const linesHtml = lines
          .map((line: string) => {
            const cleaned = line.replace(/&/g, "");
            try {
              return katex.renderToString(cleaned.trim(), {
                displayMode: true,
                throwOnError: false,
              });
            } catch {
              return cleaned.trim();
            }
          })
          .join("");
        return `<div style="text-align: center; margin: 12px 0;">${linesHtml}</div>`;
      },
    );
  }

  // Pmatrix, bmatrix, vmatrix
  const matrixTypes = ["pmatrix", "bmatrix", "vmatrix", "matrix"];
  matrixTypes.forEach((matrixType) => {
    if (html.includes(`\\begin{${matrixType}}`)) {
      html = html.replace(
        new RegExp(
          `\\\\begin\\{${matrixType}\\}([\\s\\S]*?)\\\\end\\{${matrixType}\\}`,
          "g",
        ),
        (_, content) => {
          const rows = content
            .split("\\\\")
            .filter((row: string) => row.trim());
          const tableRows = rows
            .map((row: string) => {
              const cells = row.split("&").map((cell: string) => {
                try {
                  return katex.renderToString(cell.trim(), {
                    displayMode: false,
                    throwOnError: false,
                  });
                } catch {
                  return cell.trim();
                }
              });
              return `<tr>${cells.map((cell) => `<td style="padding: 8px; text-align: center;">${cell}</td>`).join("")}</tr>`;
            })
            .join("");

          const brackets = {
            pmatrix: ["(", ")"],
            bmatrix: ["[", "]"],
            vmatrix: ["|", "|"],
            matrix: ["", ""],
          }[matrixType] || ["", ""];

          return `
          <div style="display: inline-flex; align-items: center; margin: 8px 4px;">
            <span style="font-size: ${options.fontSize * 1.5}px; font-weight: 300;">${brackets[0]}</span>
            <table style="border-collapse: collapse; margin: 0 4px;">
              ${tableRows}
            </table>
            <span style="font-size: ${options.fontSize * 1.5}px; font-weight: 300;">${brackets[1]}</span>
          </div>
        `;
        },
      );
    }
  });

  // Tabular
  if (html.includes("\\begin{tabular}")) {
    html = html.replace(
      /\\begin\{tabular\}\{[^}]*\}([\s\S]*?)\\end\{tabular\}/g,
      (_, content) => {
        const rows = content
          .split("\\\\")
          .filter((row: string) => row.trim() && !row.includes("\\hline"));
        const tableRows = rows
          .map((row: string) => {
            const cells = row.split("&").map((cell: string) => cell.trim());
            return `<tr>${cells.map((cell) => `<td style="border: 1px solid currentColor; padding: 8px;">${processInlineMath(cell)}</td>`).join("")}</tr>`;
          })
          .join("");
        return `<table style="border-collapse: collapse; margin: 12px auto; border: 2px solid currentColor;">${tableRows}</table>`;
      },
    );
  }

  // TikZ - Aviso que não é suportado
  if (html.includes("\\begin{tikzpicture}") || html.includes("\\begin{axis}")) {
    return `<div style="padding: 20px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; text-align: center;">
      <div style="font-size: 24px; margin-bottom: 12px;">⚠️</div>
      <div style="font-weight: 600; margin-bottom: 8px;">Gráficos TikZ/PGFPlots não suportados no browser</div>
      <div style="font-size: 14px; opacity: 0.8;">Use fórmulas matemáticas, matrizes, listas ou sistemas de equações</div>
    </div>`;
  }

  return html;
};

// Processa fórmulas matemáticas inline dentro do texto
const processInlineMath = (text: string): string => {
  // Substitui $...$ por renderização KaTeX
  return text.replace(/\$([^$]+)\$/g, (_, math) => {
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  });
};

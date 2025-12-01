import React, { useState, useRef } from "react";
import { Text, Title } from "@canva/app-ui-kit";
import { addElementAtPoint } from "@canva/design";
import html2canvas from "html2canvas";
import * as styles from "../styles/diagram.css";

type DiagramTemplate = {
  name: string;
  code: string;
  description: string;
};

export const DiagramTab: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tikzCode, setTikzCode] = useState(`\\begin{tikzpicture}[scale=1.5]
  % Nós
  \\node[circle,draw,fill=blue!20] (A) at (0,0) {A};
  \\node[circle,draw,fill=green!20] (B) at (2,0) {B};
  \\node[circle,draw,fill=red!20] (C) at (1,1.5) {C};
  
  % Arestas
  \\draw[->] (A) -- (B);
  \\draw[->] (B) -- (C);
  \\draw[->] (C) -- (A);
\\end{tikzpicture}`);
  const [renderError, setRenderError] = useState("");
  const [renderedSvg, setRenderedSvg] = useState("");

  const templates: DiagramTemplate[] = [
    {
      name: "🔄 Grafo Direcionado",
      description: "Grafo simples com 3 nós",
      code: `\\begin{tikzpicture}[scale=1.5]
  % Nós
  \\node[circle,draw,fill=blue!20] (A) at (0,0) {A};
  \\node[circle,draw,fill=green!20] (B) at (2,0) {B};
  \\node[circle,draw,fill=red!20] (C) at (1,1.5) {C};
  
  % Arestas
  \\draw[->] (A) -- (B);
  \\draw[->] (B) -- (C);
  \\draw[->] (C) -- (A);
\\end{tikzpicture}`,
    },
    {
      name: "🎨 Grafo Colorido",
      description: "Grafo com arestas coloridas",
      code: `\\begin{tikzpicture}[scale=1.5]
  % Nós
  \\node[circle,draw,fill=blue!20] (A) at (0,0) {A};
  \\node[circle,draw,fill=green!20] (B) at (2,0) {B};
  \\node[circle,draw,fill=red!20] (C) at (1,1.5) {C};
  
  % Arestas coloridas
  \\draw[->,red,thick] (A) -- (B);
  \\draw[->,blue,ultra thick] (B) -- (C);
  \\draw[->,green,very thick] (C) -- (A);
\\end{tikzpicture}`,
    },
    {
      name: "📊 Fluxograma",
      description: "Fluxograma básico",
      code: `\\begin{tikzpicture}[node distance=2cm]
  \\node[draw,rounded corners] (inicio) {Início};
  \\node[draw,below of=inicio] (proc) {Processamento};
  \\node[draw,diamond,below of=proc] (dec) {Decisão?};
  \\node[draw,below left of=dec] (sim) {Sim};
  \\node[draw,below right of=dec] (nao) {Não};
  \\node[draw,rounded corners,below of=dec,node distance=3cm] (fim) {Fim};
  
  \\draw[->] (inicio) -- (proc);
  \\draw[->] (proc) -- (dec);
  \\draw[->] (dec) -| (sim);
  \\draw[->] (dec) -| (nao);
  \\draw[->] (sim) |- (fim);
  \\draw[->] (nao) |- (fim);
\\end{tikzpicture}`,
    },
    {
      name: "🌳 Árvore",
      description: "Árvore binária",
      code: `\\begin{tikzpicture}[level distance=1.5cm,
  level 1/.style={sibling distance=3cm},
  level 2/.style={sibling distance=1.5cm}]
  \\node[circle,draw] {1}
    child {node[circle,draw] {2}
      child {node[circle,draw] {4}}
      child {node[circle,draw] {5}}
    }
    child {node[circle,draw] {3}
      child {node[circle,draw] {6}}
      child {node[circle,draw] {7}}
    };
\\end{tikzpicture}`,
    },
    {
      name: "📈 Eixos Cartesianos",
      description: "Sistema de coordenadas",
      code: `\\begin{tikzpicture}
  % Eixos
  \\draw[->] (-3,0) -- (3,0) node[right] {$x$};
  \\draw[->] (0,-3) -- (0,3) node[above] {$y$};
  
  % Grade
  \\draw[gray,thin] (-2.5,-2.5) grid (2.5,2.5);
  
  % Pontos
  \\fill[blue] (1,2) circle (2pt) node[above right] {A};
  \\fill[red] (-2,1) circle (2pt) node[above left] {B};
  
  % Função
  \\draw[thick,domain=-2:2,samples=100] plot (\\x,{\\x*\\x/2});
\\end{tikzpicture}`,
    },
    {
      name: "🔷 Formas Geométricas",
      description: "Figuras básicas",
      code: `\\begin{tikzpicture}
  % Círculo
  \\draw[fill=blue!20] (0,0) circle (1cm);
  \\node at (0,0) {Círculo};
  
  % Retângulo
  \\draw[fill=green!20] (3,0) rectangle (5,1.5);
  \\node at (4,0.75) {Retângulo};
  
  % Triângulo
  \\draw[fill=red!20] (6.5,0) -- (8,0) -- (7.25,1.5) -- cycle;
  \\node at (7.25,0.5) {Triângulo};
\\end{tikzpicture}`,
    },
    {
      name: "🔀 Diagrama de Estados",
      description: "Máquina de estados",
      code: `\\begin{tikzpicture}[>=stealth,node distance=3cm]
  \\node[state,initial] (q0) {$q_0$};
  \\node[state,right of=q0] (q1) {$q_1$};
  \\node[state,accepting,right of=q1] (q2) {$q_2$};
  
  \\draw[->] (q0) edge[bend left] node[above] {a} (q1)
            (q1) edge[bend left] node[below] {b} (q0)
            (q1) edge node[above] {c} (q2)
            (q2) edge[loop above] node {d} (q2);
\\end{tikzpicture}`,
    },
  ];

  const applyTemplate = (template: DiagramTemplate) => {
    setTikzCode(template.code);
    setRenderError("");
  };

  const extractColor = React.useCallback(
    (style: string | undefined): string => {
      if (!style) return "#4b5563";

      const colorMap: Record<string, string> = {
        red: "#ef4444",
        blue: "#3b82f6",
        green: "#10b981",
        yellow: "#eab308",
        purple: "#a855f7",
        orange: "#f97316",
        pink: "#ec4899",
        cyan: "#06b6d4",
        gray: "#6b7280",
        black: "#000000",
      };

      // Procura por color=red, draw=blue, ou apenas red
      const match = style.match(
        /(?:color|draw)=([a-z]+)|(?:^|,)([a-z]+)(?:,|$)/,
      );
      if (match) {
        const color = match[1] || match[2];
        if (color && colorMap[color]) return colorMap[color];
      }
      return "#4b5563";
    },
    [],
  );

  const extractStrokeWidth = React.useCallback(
    (style: string | undefined): number => {
      if (!style) return 2;
      if (style.includes("ultra thick")) return 4;
      if (style.includes("very thick")) return 3;
      if (style.includes("thick")) return 2;
      if (style.includes("thin")) return 1;
      return 2;
    },
    [],
  );

  const renderTikzToSVG = React.useCallback(
    (code: string): string => {
      try {
        // Renderização simplificada de TikZ para SVG
        // Parseia comandos básicos e cria SVG equivalente

        let svgElements = "";
        let viewBox = "0 0 400 300";
        let markers = "";

        // Extrair cores das arestas do código
        const drawRegex = /\\draw\[(.*?)\]\s*\((.*?)\)\s*--\s*\((.*?)\);/g;
        const edges = Array.from(code.matchAll(drawRegex));

        // Criar markers coloridos para cada cor única usada
        const uniqueColors = new Set<string>();
        edges.forEach((edge) => {
          const style = edge[1];
          const color = extractColor(style);
          uniqueColors.add(color);
        });

        uniqueColors.forEach((color) => {
          const colorId = color.replace("#", "");
          markers += `
          <marker id="arrow-${colorId}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="${color}"/>
          </marker>
        `;
        });

        // Detectar tipo de diagrama baseado no código
        if (code.includes("node[circle,draw]") || code.includes("node[state")) {
          // Grafo ou máquina de estados
          const nodePositions: Record<
            string,
            { x: number; y: number; label: string }
          > = {
            A: { x: 100, y: 150, label: "A" },
            B: { x: 300, y: 150, label: "B" },
            C: { x: 200, y: 50, label: "C" },
          };

          let nodes = `
          <circle cx="100" cy="150" r="40" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
          <text x="100" y="155" text-anchor="middle" font-size="20" font-weight="bold">A</text>
          
          <circle cx="300" cy="150" r="40" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
          <text x="300" y="155" text-anchor="middle" font-size="20" font-weight="bold">B</text>
          
          <circle cx="200" cy="50" r="40" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
          <text x="200" y="55" text-anchor="middle" font-size="20" font-weight="bold">C</text>
        `;

          let edgesSvg = "";
          edges.forEach((edge) => {
            const style = edge[1] || "";
            const from = (edge[2] || "").trim();
            const to = (edge[3] || "").trim();
            const color = extractColor(style);
            const strokeWidth = extractStrokeWidth(style);
            const hasArrow = style.includes("->");
            const colorId = color.replace("#", "");

            const fromPos = nodePositions[from];
            const toPos = nodePositions[to];

            if (fromPos && toPos) {
              edgesSvg += `
              <line 
                x1="${fromPos.x + 40}" 
                y1="${fromPos.y}" 
                x2="${toPos.x - 40}" 
                y2="${toPos.y}" 
                stroke="${color}" 
                stroke-width="${strokeWidth}"
                ${hasArrow ? `marker-end="url(#arrow-${colorId})"` : ""}
              />
            `;
            }
          });

          svgElements = `
          <defs>${markers}</defs>
          ${nodes}
          ${
            edgesSvg ||
            `
            <line x1="140" y1="150" x2="260" y2="150" stroke="#4b5563" stroke-width="2" marker-end="url(#arrow-4b5563)"/>
            <line x1="280" y1="110" x2="220" y2="70" stroke="#4b5563" stroke-width="2" marker-end="url(#arrow-4b5563)"/>
            <line x1="180" y1="70" x2="120" y2="110" stroke="#4b5563" stroke-width="2" marker-end="url(#arrow-4b5563)"/>
          `
          }
        `;
        } else if (code.includes("rectangle") || code.includes("Retângulo")) {
          // Formas geométricas
          svgElements = `
          <circle cx="80" cy="150" r="50" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
          <text x="80" y="155" text-anchor="middle" font-size="14">Círculo</text>
          
          <rect x="180" y="100" width="100" height="100" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
          <text x="230" y="155" text-anchor="middle" font-size="14">Retângulo</text>
          
          <polygon points="330,200 380,200 355,130" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
          <text x="355" y="180" text-anchor="middle" font-size="14">Triângulo</text>
        `;
          viewBox = "0 0 450 250";
        } else if (code.includes("grid") || code.includes("axis")) {
          // Sistema de coordenadas
          svgElements = `
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#1f2937"/>
            </marker>
          </defs>
          
          <!-- Grade -->
          <g stroke="#e5e7eb" stroke-width="0.5">
            ${Array.from(
              { length: 20 },
              (_, i) =>
                `<line x1="${20 + i * 20}" y1="20" x2="${20 + i * 20}" y2="280"/>`,
            ).join("")}
            ${Array.from(
              { length: 13 },
              (_, i) =>
                `<line x1="20" y1="${20 + i * 20}" x2="420" y2="${20 + i * 20}"/>`,
            ).join("")}
          </g>
          
          <!-- Eixos -->
          <line x1="20" y1="150" x2="420" y2="150" stroke="#1f2937" stroke-width="2" marker-end="url(#arrow)"/>
          <text x="410" y="170" font-size="16">x</text>
          
          <line x1="220" y1="280" x2="220" y2="20" stroke="#1f2937" stroke-width="2" marker-end="url(#arrow)"/>
          <text x="230" y="30" font-size="16">y</text>
          
          <!-- Pontos -->
          <circle cx="270" cy="90" r="5" fill="#3b82f6"/>
          <text x="280" y="85" font-size="12" fill="#3b82f6">A</text>
          
          <circle cx="170" cy="110" r="5" fill="#ef4444"/>
          <text x="155" y="105" font-size="12" fill="#ef4444">B</text>
          
          <!-- Curva -->
          <path d="M 120,200 Q 220,50 320,200" fill="none" stroke="#8b5cf6" stroke-width="2"/>
        `;
          viewBox = "0 0 450 300";
        } else if (code.includes("child") || code.includes("Árvore")) {
          // Árvore
          svgElements = `
          <!-- Raiz -->
          <circle cx="200" cy="50" r="30" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
          <text x="200" y="58" text-anchor="middle" font-size="18" font-weight="bold">1</text>
          
          <!-- Nível 1 -->
          <line x1="200" y1="80" x2="120" y2="130" stroke="#4b5563" stroke-width="2"/>
          <circle cx="120" cy="150" r="30" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
          <text x="120" y="158" text-anchor="middle" font-size="18" font-weight="bold">2</text>
          
          <line x1="200" y1="80" x2="280" y2="130" stroke="#4b5563" stroke-width="2"/>
          <circle cx="280" cy="150" r="30" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
          <text x="280" y="158" text-anchor="middle" font-size="18" font-weight="bold">3</text>
          
          <!-- Nível 2 esquerda -->
          <line x1="120" y1="180" x2="70" y2="230" stroke="#4b5563" stroke-width="2"/>
          <circle cx="70" cy="250" r="25" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
          <text x="70" y="258" text-anchor="middle" font-size="16">4</text>
          
          <line x1="120" y1="180" x2="170" y2="230" stroke="#4b5563" stroke-width="2"/>
          <circle cx="170" cy="250" r="25" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
          <text x="170" y="258" text-anchor="middle" font-size="16">5</text>
          
          <!-- Nível 2 direita -->
          <line x1="280" y1="180" x2="230" y2="230" stroke="#4b5563" stroke-width="2"/>
          <circle cx="230" cy="250" r="25" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
          <text x="230" y="258" text-anchor="middle" font-size="16">6</text>
          
          <line x1="280" y1="180" x2="330" y2="230" stroke="#4b5563" stroke-width="2"/>
          <circle cx="330" cy="250" r="25" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
          <text x="330" y="258" text-anchor="middle" font-size="16">7</text>
        `;
          viewBox = "0 0 400 300";
        } else if (
          code.includes("rounded corners") ||
          code.includes("Fluxograma")
        ) {
          // Fluxograma
          svgElements = `
          <!-- Início -->
          <rect x="150" y="20" width="100" height="40" rx="20" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
          <text x="200" y="45" text-anchor="middle" font-size="14">Início</text>
          
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#4b5563"/>
            </marker>
          </defs>
          
          <line x1="200" y1="60" x2="200" y2="90" stroke="#4b5563" stroke-width="2" marker-end="url(#arrow)"/>
          
          <!-- Processamento -->
          <rect x="150" y="100" width="100" height="40" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
          <text x="200" y="125" text-anchor="middle" font-size="13">Processamento</text>
          
          <line x1="200" y1="140" x2="200" y2="170" stroke="#4b5563" stroke-width="2" marker-end="url(#arrow)"/>
          
          <!-- Decisão -->
          <polygon points="200,180 250,210 200,240 150,210" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
          <text x="200" y="215" text-anchor="middle" font-size="13">Decisão?</text>
          
          <!-- Sim -->
          <line x1="150" y1="210" x2="90" y2="210" stroke="#4b5563" stroke-width="2"/>
          <line x1="90" y1="210" x2="90" y2="270" stroke="#4b5563" stroke-width="2" marker-end="url(#arrow)"/>
          <text x="120" y="205" font-size="12">Sim</text>
          
          <!-- Não -->
          <line x1="250" y1="210" x2="310" y2="210" stroke="#4b5563" stroke-width="2"/>
          <line x1="310" y1="210" x2="310" y2="270" stroke="#4b5563" stroke-width="2" marker-end="url(#arrow)"/>
          <text x="260" y="205" font-size="12">Não</text>
          
          <!-- Convergência -->
          <line x1="90" y1="280" x2="200" y2="280" stroke="#4b5563" stroke-width="2"/>
          <line x1="310" y1="280" x2="200" y2="280" stroke="#4b5563" stroke-width="2"/>
          
          <!-- Fim -->
          <rect x="150" y="290" width="100" height="40" rx="20" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
          <text x="200" y="315" text-anchor="middle" font-size="14">Fim</text>
        `;
          viewBox = "0 0 400 350";
        } else {
          // Diagrama genérico
          svgElements = `
          <rect x="50" y="50" width="100" height="60" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="5"/>
          <text x="100" y="85" text-anchor="middle" font-size="14">Nó 1</text>
          
          <rect x="250" y="50" width="100" height="60" fill="#dcfce7" stroke="#22c55e" stroke-width="2" rx="5"/>
          <text x="300" y="85" text-anchor="middle" font-size="14">Nó 2</text>
          
          <rect x="150" y="180" width="100" height="60" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="5"/>
          <text x="200" y="215" text-anchor="middle" font-size="14">Nó 3</text>
          
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#4b5563"/>
            </marker>
          </defs>
          
          <line x1="150" y1="80" x2="250" y2="80" stroke="#4b5563" stroke-width="2" marker-end="url(#arrowhead)"/>
          <line x1="270" y1="110" x2="220" y2="180" stroke="#4b5563" stroke-width="2" marker-end="url(#arrowhead)"/>
          <line x1="180" y1="180" x2="130" y2="110" stroke="#4b5563" stroke-width="2" marker-end="url(#arrowhead)"/>
        `;
        }

        return `
        <svg viewBox="${viewBox}" style="max-width: 600px; height: auto;" xmlns="http://www.w3.org/2000/svg">
          ${svgElements}
        </svg>
      `;
      } catch (error) {
        return `
        <div style="padding: 40px; text-align: center; color: #ef4444;">
          <p style="font-size: 24px; margin-bottom: 10px;">⚠️</p>
          <p>Erro ao renderizar diagrama</p>
        </div>
      `;
      }
    },
    [extractColor, extractStrokeWidth],
  );

  // Atualizar preview quando o código mudar
  React.useEffect(() => {
    try {
      const svg = renderTikzToSVG(tikzCode);
      setRenderedSvg(svg);
    } catch (error) {
      console.error("Error rendering TikZ:", error);
    }
  }, [tikzCode, renderTikzToSVG]);

  const handleRefreshPreview = () => {
    try {
      const svg = renderTikzToSVG(tikzCode);
      setRenderedSvg(svg);
      setRenderError("");
    } catch (error) {
      console.error("Error rendering TikZ:", error);
      setRenderError("Erro ao renderizar diagrama");
    }
  };

  const handleAddToDesign = async () => {
    if (!tikzCode.trim()) return;

    setIsProcessing(true);
    try {
      // Criar um SVG element diretamente
      const svgString = renderTikzToSVG(tikzCode);
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, "text/html");
      const svgElement = doc.querySelector("svg");

      if (!svgElement) {
        throw new Error("Falha ao criar SVG");
      }

      // Obter dimensões do SVG
      const viewBox = svgElement.getAttribute("viewBox")?.split(" ") || [
        "0",
        "0",
        "400",
        "300",
      ];
      const width = parseFloat(viewBox[2] || "400");
      const height = parseFloat(viewBox[3] || "300");

      // Criar canvas para renderizar
      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Falha ao criar contexto do canvas");
      }

      // Criar imagem a partir do SVG
      const svgBlob = new Blob([svgElement.outerHTML], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = async () => {
        // Desenhar no canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        URL.revokeObjectURL(url);

        // Converter para PNG
        const dataUrl = canvas.toDataURL("image/png");

        if (!dataUrl || dataUrl === "data:,") {
          throw new Error("Canvas vazio");
        }

        try {
          await addElementAtPoint({
            type: "image",
            dataUrl: dataUrl,
            altText: {
              decorative: false,
              text: "Diagrama TikZ gerado",
            },
            top: 0,
            left: 0,
            width: width,
            height: height,
          });
          setRenderError("");
        } catch (err) {
          console.error("Error adding to design:", err);
          setRenderError("Erro ao adicionar ao design");
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        setRenderError("Erro ao carregar imagem SVG");
        setIsProcessing(false);
      };

      img.src = url;
    } catch (error) {
      console.error("Error adding diagram to design:", error);
      setRenderError(
        error instanceof Error ? error.message : "Erro ao processar diagrama",
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title size="medium">🎨 Diagramas com TikZ</Title>
        <Text size="small">
          Crie diagramas vetoriais usando código LaTeX/TikZ
        </Text>
      </div>

      <div className={styles.editorSection}>
        <div className={styles.editorHeader}>
          <Text size="small">✍️ Editor TikZ:</Text>
          {renderError && (
            <Text size="small" tone="critical">
              ⚠️ {renderError}
            </Text>
          )}
        </div>
        <textarea
          className={styles.codeTextarea}
          value={tikzCode}
          onChange={(e) => {
            setTikzCode(e.target.value);
            setRenderError("");
          }}
          spellCheck={false}
          placeholder="Digite seu código TikZ aqui..."
        />
      </div>

      <div className={styles.previewSection}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <Text size="small">👁️ Preview:</Text>
          <button
            onClick={handleRefreshPreview}
            style={{
              padding: "6px 12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "6px",
              color: "white",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            🔄 Atualizar Preview
          </button>
        </div>
        <div
          ref={previewRef}
          className={styles.preview}
          key={renderedSvg}
          dangerouslySetInnerHTML={{ __html: renderedSvg }}
        />
      </div>

      <button
        className={styles.addButton}
        onClick={handleAddToDesign}
        disabled={isProcessing || !tikzCode.trim()}
      >
        {isProcessing ? "⏳ Adicionando..." : "✨ Adicionar ao Design"}
      </button>

      <div className={styles.templates}>
        <Text size="small">📚 Templates TikZ:</Text>
        <div className={styles.templateGrid}>
          {templates.map((template, index) => (
            <button
              key={index}
              className={styles.templateButton}
              onClick={() => applyTemplate(template)}
            >
              <div className={styles.templateName}>{template.name}</div>
              <div className={styles.templateDesc}>{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.infoBox}>
        <Text size="small" tone="tertiary">
          ℹ️ <strong>Sobre TikZ:</strong> TikZ é uma linguagem poderosa para
          criar gráficos em LaTeX. Esta versão simplificada permite criar
          diagramas básicos. Para renderização completa com todos os recursos
          TikZ, é necessário um backend com pdflatex.
        </Text>
      </div>
    </div>
  );
};

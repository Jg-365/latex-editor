import React, { useState } from "react";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { LATEX_TEMPLATES, TemplateCategory } from "../data/templates";
import * as styles from "../styles/templates.css";

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<TemplateCategory>("algebra");

  const categories: { key: TemplateCategory; label: string; emoji: string }[] =
    [
      { key: "algebra", label: "Álgebra", emoji: "📐" },
      { key: "calculus", label: "Cálculo", emoji: "∫" },
      { key: "geometry", label: "Geometria", emoji: "△" },
      { key: "statistics", label: "Estatística", emoji: "📊" },
      { key: "physics", label: "Física", emoji: "⚡" },
      { key: "chemistry", label: "Química", emoji: "⚗️" },
      { key: "symbols", label: "Símbolos", emoji: "∑" },
      { key: "advanced", label: "Avançado", emoji: "🚀" },
    ];

  const templates = LATEX_TEMPLATES[selectedCategory];

  return (
    <div className={styles.container}>
      <Rows spacing="1u">
        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className={styles.expandIcon}>{isExpanded ? "▼" : "▶"}</span>
          <span className={styles.expandText}>Templates de Equações</span>
          <span className={styles.badge}>
            {LATEX_TEMPLATES[selectedCategory].length}
          </span>
        </button>

        {isExpanded && (
          <>
            <div className={styles.categories}>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={`${styles.categoryButton} ${selectedCategory === cat.key ? styles.active : ""}`}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  <span className={styles.categoryEmoji}>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.grid}>
              {templates.map((template, index) => (
                <div
                  key={index}
                  className={styles.item}
                  onClick={() => onSelect(template.latex)}
                >
                  <div className={styles.itemName}>{template.name}</div>
                  <div className={styles.preview}>{template.preview}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </Rows>
    </div>
  );
};

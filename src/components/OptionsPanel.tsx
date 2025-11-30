import React from "react";
import { Rows, Text } from "@canva/app-ui-kit";
import styles from "../styles/options.css";

export interface LatexOptions {
  fontSize: number;
  color: string;
  displayMode: boolean;
}

interface OptionsPanelProps {
  options: LatexOptions;
  onChange: (newOptions: Partial<LatexOptions>) => void;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({
  options,
  onChange,
}) => {
  return (
    <div className={styles.container}>
      <Rows spacing="1u">
        <Text size="small" tone="tertiary">
          ⚙️ Opções de Estilo:
        </Text>

        <div className={styles.row}>
          <Text size="xsmall">Tamanho: {options.fontSize}px</Text>
          <input
            type="range"
            min="24"
            max="120"
            value={options.fontSize}
            onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
            className={styles.slider}
          />
        </div>

        <div className={styles.row}>
          <Text size="xsmall">Cor:</Text>
          <input
            type="color"
            value={options.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className={styles.colorPicker}
          />
        </div>

        <div className={styles.row}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={options.displayMode}
              onChange={(e) => onChange({ displayMode: e.target.checked })}
            />
            <Text size="xsmall">Modo Display (centralizado)</Text>
          </label>
        </div>
      </Rows>
    </div>
  );
};

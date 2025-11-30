import React from "react";
import { Rows, Text } from "@canva/app-ui-kit";
import styles from "../styles/history.css";

export interface HistoryItem {
  latex: string;
  timestamp: number;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelect,
}) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <Rows spacing="1u">
        <Text size="small" tone="tertiary">
          📜 Histórico Recente:
        </Text>
        <div className={styles.list}>
          {history.map((item, index) => (
            <div
              key={index}
              className={styles.item}
              onClick={() => onSelect(item)}
            >
              <div className={styles.latex}>{item.latex}</div>
              <div className={styles.time}>{formatTime(item.timestamp)}</div>
            </div>
          ))}
        </div>
      </Rows>
    </div>
  );
};

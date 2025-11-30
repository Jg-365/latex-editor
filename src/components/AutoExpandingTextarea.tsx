import React, { useEffect, useRef } from "react";
import * as styles from "../styles/textarea.css";

interface AutoExpandingTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
}

export const AutoExpandingTextarea: React.FC<AutoExpandingTextareaProps> = ({
  value,
  onChange,
  placeholder = "",
  minRows = 2,
  maxRows = 15,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get correct scrollHeight
    textarea.style.height = "auto";

    // Calculate new height
    const lineHeight = 24; // aproximadamente
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight,
    );

    textarea.style.height = `${newHeight}px`;
  }, [value, minRows, maxRows]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      ref={textareaRef}
      className={styles.textarea}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={minRows}
    />
  );
};

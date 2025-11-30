import React, { useState, useRef } from "react";
import { Text } from "@canva/app-ui-kit";
import { addElementAtPoint } from "@canva/design";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import * as styles from "../styles/graph.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler,
);

type ChartType = "line" | "bar" | "pie";

export const GraphTab: React.FC = () => {
  const chartRef = useRef<any>(null);
  const [chartType, setChartType] = useState<ChartType>("line");
  const [isProcessing, setIsProcessing] = useState(false);

  const [chartData, setChartData] = useState<any>({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Dados 1",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(102, 126, 234, 0.5)",
        borderColor: "rgba(102, 126, 234, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Meu Gráfico",
        font: {
          size: 18,
        },
      },
    },
    scales:
      chartType === "pie"
        ? {}
        : {
            y: {
              beginAtZero: true,
            },
          },
  };

  const handleAddToDesign = async () => {
    if (!chartRef.current) return;

    setIsProcessing(true);
    try {
      const chart = chartRef.current;
      const canvas = chart.canvas;
      const dataUrl = canvas.toDataURL("image/png");

      await addElementAtPoint({
        type: "image",
        dataUrl: dataUrl,
        altText: {
          decorative: false,
          text: "Gráfico gerado com Chart.js",
        },
        top: 0,
        left: 0,
        width: canvas.width,
        height: canvas.height,
      });
    } catch (error) {
      console.error("Error adding chart to design:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const templates = [
    {
      name: "📈 Linha Crescente",
      type: "line" as ChartType,
      data: {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
        datasets: [
          {
            label: "Vendas",
            data: [10, 25, 40, 55, 70, 85],
            backgroundColor: "rgba(102, 126, 234, 0.2)",
            borderColor: "rgba(102, 126, 234, 1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
    },
    {
      name: "📊 Barras Comparativas",
      type: "bar" as ChartType,
      data: {
        labels: ["Produto A", "Produto B", "Produto C", "Produto D"],
        datasets: [
          {
            label: "Q1",
            data: [65, 59, 80, 81],
            backgroundColor: "rgba(102, 126, 234, 0.8)",
          },
          {
            label: "Q2",
            data: [75, 69, 90, 91],
            backgroundColor: "rgba(118, 75, 162, 0.8)",
          },
        ],
      },
    },
    {
      name: "🥧 Pizza Distribuição",
      type: "pie" as ChartType,
      data: {
        labels: ["Python", "JavaScript", "Java", "C++", "Outros"],
        datasets: [
          {
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              "rgba(102, 126, 234, 0.8)",
              "rgba(118, 75, 162, 0.8)",
              "rgba(240, 147, 251, 0.8)",
              "rgba(79, 172, 254, 0.8)",
              "rgba(0, 242, 254, 0.8)",
            ],
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
    },
    {
      name: "📉 Múltiplas Séries",
      type: "line" as ChartType,
      data: {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        datasets: [
          {
            label: "Visitas",
            data: [100, 120, 140, 110, 160, 180, 150],
            borderColor: "rgb(102, 126, 234)",
            backgroundColor: "rgba(102, 126, 234, 0.2)",
            tension: 0.3,
          },
          {
            label: "Conversões",
            data: [30, 40, 45, 35, 55, 65, 50],
            borderColor: "rgb(118, 75, 162)",
            backgroundColor: "rgba(118, 75, 162, 0.2)",
            tension: 0.3,
          },
        ],
      },
    },
  ];

  const applyTemplate = (template: (typeof templates)[0]) => {
    setChartType(template.type);
    setChartData(template.data);
  };

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return <Line ref={chartRef} data={chartData} options={chartOptions} />;
      case "bar":
        return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
      case "pie":
        return <Pie ref={chartRef} data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>📊 Gerador de Gráficos</h2>
        <Text size="small">Crie gráficos profissionais com Chart.js</Text>
      </div>

      <div className={styles.controls}>
        <div className={styles.typeSelector}>
          <button
            className={`${styles.typeButton} ${chartType === "line" ? styles.active : ""}`}
            onClick={() => setChartType("line")}
          >
            📈 Linha
          </button>
          <button
            className={`${styles.typeButton} ${chartType === "bar" ? styles.active : ""}`}
            onClick={() => setChartType("bar")}
          >
            📊 Barra
          </button>
          <button
            className={`${styles.typeButton} ${chartType === "pie" ? styles.active : ""}`}
            onClick={() => setChartType("pie")}
          >
            🥧 Pizza
          </button>
        </div>
      </div>

      <div className={styles.preview}>{renderChart()}</div>

      <button
        className={styles.addButton}
        onClick={handleAddToDesign}
        disabled={isProcessing}
      >
        {isProcessing ? "⏳ Adicionando..." : "✨ Adicionar ao Design"}
      </button>

      <div className={styles.templates}>
        <Text size="small" tone="tertiary">
          📚 Templates Prontos:
        </Text>
        <div className={styles.templateGrid}>
          {templates.map((template, index) => (
            <button
              key={index}
              className={styles.templateButton}
              onClick={() => applyTemplate(template)}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

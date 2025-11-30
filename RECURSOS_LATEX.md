# 📚 Recursos LaTeX Suportados

## ✨ Recursos Básicos (KaTeX - Renderização Rápida)

- Fórmulas matemáticas: `E = mc^2`
- Frações: `\frac{a}{b}`
- Raízes: `\sqrt{x}`, `\sqrt[3]{x}`
- Potências e índices: `x^2`, `x_i`
- Integrais: `\int_{0}^{\infty} f(x) dx`
- Somatórios: `\sum_{i=1}^{n} x_i`
- Limites: `\lim_{x \to \infty} f(x)`
- Símbolos gregos: `\alpha`, `\beta`, `\theta`, `\pi`

## 🚀 Recursos Avançados (Renderização Client-Side)

### Listas

```latex
\begin{itemize}
\item Primeiro item
\item Segundo item
\item Terceiro item
\end{itemize}
```

```latex
\begin{enumerate}
\item Item 1
\item Item 2
\item Item 3
\end{enumerate}
```

### Matrizes

```latex
\begin{pmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{pmatrix}
```

**Tipos de matrizes suportados:**

- `pmatrix` - Parênteses ( )
- `bmatrix` - Colchetes [ ]
- `vmatrix` - Barras | |
- `matrix` - Sem delimitadores

### Sistemas de Equações

```latex
\begin{cases}
x + y = 5 \\
2x - y = 1
\end{cases}
```

### Equações Alinhadas

```latex
\begin{align}
(a+b)^2 &= a^2 + 2ab + b^2 \\
&= a^2 + b^2 + 2ab
\end{align}
```

### Tabelas

```latex
\begin{tabular}{|c|c|}
\hline
Coluna 1 & Coluna 2 \\
\hline
A & B \\
C & D \\
\hline
\end{tabular}
```

### ⚠️ Limitações

**Gráficos TikZ/PGFPlots não são suportados** pois requerem compilação LaTeX completa no servidor. Use os recursos avançados disponíveis acima para criar conteúdo matemático profissional!

## 📦 Funcionalidades Implementadas

**Renderização Dupla:**

- **KaTeX** - Para fórmulas matemáticas simples (rápido)
- **Renderizador Customizado** - Para LaTeX avançado (HTML/CSS)

**Recursos Avançados Suportados:**

- ✅ Listas (itemize, enumerate)
- ✅ Matrizes (pmatrix, bmatrix, vmatrix, matrix)
- ✅ Sistemas de equações (cases)
- ✅ Equações alinhadas (align)
- ✅ Tabelas (tabular)
- ✅ Fórmulas inline dentro de listas/tabelas
- ❌ Gráficos TikZ/PGFPlots (não suportado)

## 💡 Como Funciona

O editor detecta automaticamente o tipo de LaTeX:

1. **Fórmulas Simples** (`E = mc^2`) → Usa KaTeX (renderização instantânea)
2. **LaTeX Avançado** (`\begin{itemize}`) → Usa renderizador customizado (HTML/CSS)

A detecção é automática! Quando você usa comandos como `\begin{itemize}`, `\item`, ou `\begin{pmatrix}`, o sistema automaticamente renderiza usando o motor avançado.

## 🎨 Dicas

- Use a categoria **🚀 Avançado** nos templates para exemplos prontos
- A renderização é instantânea - tudo acontece no navegador!
- Combine fórmulas matemáticas KaTeX dentro de listas e tabelas
- Todas as equações são exportadas como imagens PNG de alta qualidade (2x resolução)
- O editor suporta auto-expansão do textarea (2-12 linhas)

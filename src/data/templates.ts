export type TemplateCategory =
  | "algebra"
  | "calculus"
  | "geometry"
  | "statistics"
  | "physics"
  | "chemistry"
  | "symbols"
  | "advanced";

export interface LatexTemplate {
  name: string;
  latex: string;
  preview: string;
}

export const LATEX_TEMPLATES: Record<TemplateCategory, LatexTemplate[]> = {
  algebra: [
    {
      name: "Quadrática",
      latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      preview: "x = (-b ± √(b²-4ac)) / 2a",
    },
    {
      name: "Binômio",
      latex: "(a + b)^2 = a^2 + 2ab + b^2",
      preview: "(a+b)² = a²+2ab+b²",
    },
    {
      name: "Diferença de Quadrados",
      latex: "a^2 - b^2 = (a+b)(a-b)",
      preview: "a²-b² = (a+b)(a-b)",
    },
    {
      name: "Fatoração",
      latex: "ax^2 + bx + c = a(x - x_1)(x - x_2)",
      preview: "ax²+bx+c = a(x-x₁)(x-x₂)",
    },
    {
      name: "Sistema Linear",
      latex: "\\begin{cases} ax + by = c \\\\ dx + ey = f \\end{cases}",
      preview: "Sistema 2x2",
    },
    {
      name: "Exponencial",
      latex: "a^m \\cdot a^n = a^{m+n}",
      preview: "aᵐ · aⁿ = aᵐ⁺ⁿ",
    },
    {
      name: "Logaritmo",
      latex: "\\log_a(xy) = \\log_a x + \\log_a y",
      preview: "log(xy) = log x + log y",
    },
    {
      name: "Progressão Aritmética",
      latex: "a_n = a_1 + (n-1)r",
      preview: "aₙ = a₁ + (n-1)r",
    },
    {
      name: "Progressão Geométrica",
      latex: "a_n = a_1 \\cdot q^{n-1}",
      preview: "aₙ = a₁ · qⁿ⁻¹",
    },
    {
      name: "Soma PA",
      latex: "S_n = \\frac{n(a_1 + a_n)}{2}",
      preview: "Sₙ = n(a₁+aₙ)/2",
    },
  ],

  calculus: [
    {
      name: "Derivada Potência",
      latex: "\\frac{d}{dx}x^n = nx^{n-1}",
      preview: "d/dx(xⁿ) = nxⁿ⁻¹",
    },
    {
      name: "Regra do Produto",
      latex: "(fg)' = f'g + fg'",
      preview: "(fg)' = f'g + fg'",
    },
    {
      name: "Regra do Quociente",
      latex: "\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}",
      preview: "(f/g)' = (f'g-fg')/g²",
    },
    {
      name: "Regra da Cadeia",
      latex: "\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)",
      preview: "d/dx f(g(x)) = f'(g(x))·g'(x)",
    },
    {
      name: "Integral Indefinida",
      latex: "\\int x^n dx = \\frac{x^{n+1}}{n+1} + C",
      preview: "∫xⁿdx = xⁿ⁺¹/(n+1) + C",
    },
    {
      name: "Integral Definida",
      latex: "\\int_a^b f(x)dx = F(b) - F(a)",
      preview: "∫ₐᵇ f(x)dx = F(b)-F(a)",
    },
    {
      name: "Limite",
      latex: "\\lim_{x \\to a} f(x) = L",
      preview: "lim(x→a) f(x) = L",
    },
    {
      name: "Série de Taylor",
      latex: "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n",
      preview: "f(x) = Σ fⁿ(a)(x-a)ⁿ/n!",
    },
    {
      name: "Gradiente",
      latex:
        "\\nabla f = \\frac{\\partial f}{\\partial x}\\mathbf{i} + \\frac{\\partial f}{\\partial y}\\mathbf{j}",
      preview: "∇f = ∂f/∂x i + ∂f/∂y j",
    },
    {
      name: "Divergente",
      latex:
        "\\nabla \\cdot \\mathbf{F} = \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y}",
      preview: "∇·F = ∂Fₓ/∂x + ∂Fᵧ/∂y",
    },
  ],

  geometry: [
    { name: "Pitágoras", latex: "a^2 + b^2 = c^2", preview: "a² + b² = c²" },
    { name: "Área do Círculo", latex: "A = \\pi r^2", preview: "A = πr²" },
    { name: "Circunferência", latex: "C = 2\\pi r", preview: "C = 2πr" },
    {
      name: "Área do Triângulo",
      latex: "A = \\frac{bh}{2}",
      preview: "A = bh/2",
    },
    { name: "Área da Esfera", latex: "A = 4\\pi r^2", preview: "A = 4πr²" },
    {
      name: "Volume da Esfera",
      latex: "V = \\frac{4}{3}\\pi r^3",
      preview: "V = 4πr³/3",
    },
    {
      name: "Volume do Cilindro",
      latex: "V = \\pi r^2 h",
      preview: "V = πr²h",
    },
    {
      name: "Lei dos Senos",
      latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}",
      preview: "a/sin A = b/sin B = c/sin C",
    },
    {
      name: "Lei dos Cossenos",
      latex: "c^2 = a^2 + b^2 - 2ab\\cos C",
      preview: "c² = a²+b²-2ab cos C",
    },
    {
      name: "Distância entre Pontos",
      latex: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",
      preview: "d = √((x₂-x₁)²+(y₂-y₁)²)",
    },
  ],

  statistics: [
    {
      name: "Média",
      latex: "\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i",
      preview: "x̄ = (1/n)Σxᵢ",
    },
    {
      name: "Variância",
      latex: "\\sigma^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\mu)^2",
      preview: "σ² = (1/n)Σ(xᵢ-μ)²",
    },
    {
      name: "Desvio Padrão",
      latex: "\\sigma = \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\mu)^2}",
      preview: "σ = √((1/n)Σ(xᵢ-μ)²)",
    },
    {
      name: "Combinação",
      latex: "C(n,k) = \\frac{n!}{k!(n-k)!}",
      preview: "C(n,k) = n!/(k!(n-k)!)",
    },
    {
      name: "Permutação",
      latex: "P(n,k) = \\frac{n!}{(n-k)!}",
      preview: "P(n,k) = n!/(n-k)!",
    },
    {
      name: "Distribuição Normal",
      latex:
        "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
      preview: "f(x) = (1/σ√(2π))e^(-(x-μ)²/2σ²)",
    },
    {
      name: "Probabilidade",
      latex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
      preview: "P(A∪B) = P(A)+P(B)-P(A∩B)",
    },
    {
      name: "Teorema de Bayes",
      latex: "P(A|B) = \\frac{P(B|A)P(A)}{P(B)}",
      preview: "P(A|B) = P(B|A)P(A)/P(B)",
    },
    {
      name: "Covariância",
      latex: "\\text{Cov}(X,Y) = E[(X-\\mu_X)(Y-\\mu_Y)]",
      preview: "Cov(X,Y) = E[(X-μₓ)(Y-μᵧ)]",
    },
    {
      name: "Correlação",
      latex: "\\rho = \\frac{\\text{Cov}(X,Y)}{\\sigma_X\\sigma_Y}",
      preview: "ρ = Cov(X,Y)/(σₓσᵧ)",
    },
  ],

  physics: [
    { name: "Einstein", latex: "E = mc^2", preview: "E = mc²" },
    { name: "Newton 2ª Lei", latex: "F = ma", preview: "F = ma" },
    {
      name: "Energia Cinética",
      latex: "E_k = \\frac{1}{2}mv^2",
      preview: "Eₖ = ½mv²",
    },
    { name: "Energia Potencial", latex: "E_p = mgh", preview: "Eₚ = mgh" },
    {
      name: "Lei de Coulomb",
      latex: "F = k\\frac{q_1q_2}{r^2}",
      preview: "F = k(q₁q₂)/r²",
    },
    { name: "Lei de Ohm", latex: "V = IR", preview: "V = IR" },
    {
      name: "Potência",
      latex: "P = \\frac{W}{t} = Fv",
      preview: "P = W/t = Fv",
    },
    { name: "Momentum", latex: "p = mv", preview: "p = mv" },
    {
      name: "Gravitação Universal",
      latex: "F = G\\frac{m_1m_2}{r^2}",
      preview: "F = G(m₁m₂)/r²",
    },
    { name: "Ondas", latex: "v = \\lambda f", preview: "v = λf" },
  ],

  chemistry: [
    { name: "pH", latex: "pH = -\\log[H^+]", preview: "pH = -log[H⁺]" },
    { name: "Gases Ideais", latex: "PV = nRT", preview: "PV = nRT" },
    {
      name: "Concentração Molar",
      latex: "M = \\frac{n}{V}",
      preview: "M = n/V",
    },
    {
      name: "Lei de Avogadro",
      latex: "N = n \\times N_A",
      preview: "N = n × Nₐ",
    },
    {
      name: "Entalpia",
      latex: "\\Delta H = H_{produtos} - H_{reagentes}",
      preview: "ΔH = Hₚ - Hᵣ",
    },
    {
      name: "Entropia",
      latex: "\\Delta S = \\frac{q_{rev}}{T}",
      preview: "ΔS = qᵣₑᵥ/T",
    },
    {
      name: "Energia de Gibbs",
      latex: "\\Delta G = \\Delta H - T\\Delta S",
      preview: "ΔG = ΔH - TΔS",
    },
    {
      name: "Constante de Equilíbrio",
      latex: "K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}",
      preview: "Kc = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ",
    },
    {
      name: "Velocidade de Reação",
      latex: "v = k[A]^m[B]^n",
      preview: "v = k[A]ᵐ[B]ⁿ",
    },
    {
      name: "Equação de Nernst",
      latex: "E = E^0 - \\frac{RT}{nF}\\ln Q",
      preview: "E = E⁰ - (RT/nF)ln Q",
    },
  ],

  symbols: [
    { name: "Soma", latex: "\\sum_{i=1}^{n} a_i", preview: "Σ aᵢ" },
    { name: "Produto", latex: "\\prod_{i=1}^{n} a_i", preview: "Π aᵢ" },
    { name: "Integral", latex: "\\int f(x)dx", preview: "∫ f(x)dx" },
    {
      name: "Integral Dupla",
      latex: "\\iint_D f(x,y)dA",
      preview: "∬ f(x,y)dA",
    },
    {
      name: "Derivada Parcial",
      latex: "\\frac{\\partial f}{\\partial x}",
      preview: "∂f/∂x",
    },
    { name: "Infinito", latex: "\\infty", preview: "∞" },
    { name: "Alfa", latex: "\\alpha", preview: "α" },
    { name: "Beta", latex: "\\beta", preview: "β" },
    { name: "Theta", latex: "\\theta", preview: "θ" },
    { name: "Lambda", latex: "\\lambda", preview: "λ" },
    { name: "Delta", latex: "\\Delta", preview: "Δ" },
    { name: "Sigma", latex: "\\Sigma", preview: "Σ" },
    { name: "Pi", latex: "\\pi", preview: "π" },
    { name: "Nabla", latex: "\\nabla", preview: "∇" },
    { name: "Pertence", latex: "x \\in A", preview: "x ∈ A" },
    { name: "Não Pertence", latex: "x \\notin A", preview: "x ∉ A" },
    { name: "União", latex: "A \\cup B", preview: "A ∪ B" },
    { name: "Interseção", latex: "A \\cap B", preview: "A ∩ B" },
    { name: "Maior ou Igual", latex: "a \\geq b", preview: "a ≥ b" },
    { name: "Menor ou Igual", latex: "a \\leq b", preview: "a ≤ b" },
  ],
  advanced: [
    {
      name: "Lista com Itemize",
      latex:
        "\\begin{itemize}\n\\item Primeiro item\n\\item Segundo item\n\\item Terceiro item\n\\end{itemize}",
      preview: "• Lista de itens",
    },
    {
      name: "Lista Numerada",
      latex:
        "\\begin{enumerate}\n\\item Primeiro\n\\item Segundo\n\\item Terceiro\n\\end{enumerate}",
      preview: "1. Lista numerada",
    },
    {
      name: "Matriz 3x3",
      latex:
        "\\begin{pmatrix}\na & b & c \\\\\nd & e & f \\\\\ng & h & i\n\\end{pmatrix}",
      preview: "[a b c; d e f; g h i]",
    },
    {
      name: "Sistema de Equações",
      latex: "\\begin{cases}\nx + y = 5 \\\\\n2x - y = 1\n\\end{cases}",
      preview: "{x+y=5, 2x-y=1}",
    },
    {
      name: "Equação Alinhada",
      latex:
        "\\begin{align}\n(a+b)^2 &= a^2 + 2ab + b^2 \\\\\n&= a^2 + b^2 + 2ab\n\\end{align}",
      preview: "(a+b)² = a²+2ab+b²",
    },
    {
      name: "Tabela 2x2",
      latex:
        "\\begin{tabular}{|c|c|}\n\\hline\nA & B \\\\\n\\hline\nC & D \\\\\n\\hline\n\\end{tabular}",
      preview: "┌─────┬─────┐",
    },
    {
      name: "Matriz Identidade",
      latex:
        "\\begin{bmatrix}\n1 & 0 & 0 \\\\\n0 & 1 & 0 \\\\\n0 & 0 & 1\n\\end{bmatrix}",
      preview: "[I₃]",
    },
    {
      name: "Determinante 2x2",
      latex: "\\begin{vmatrix}\na & b \\\\\nc & d\n\\end{vmatrix} = ad - bc",
      preview: "|det| = ad-bc",
    },
    {
      name: "Fração Complexa",
      latex: "\\frac{\\frac{a}{b}}{\\frac{c}{d}} = \\frac{ad}{bc}",
      preview: "(a/b)/(c/d) = ad/bc",
    },
  ],
};

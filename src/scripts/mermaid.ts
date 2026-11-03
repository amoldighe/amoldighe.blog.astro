interface MermaidAPI {
  initialize(options: Record<string, unknown>): void;
  render(
    id: string,
    text: string
  ): Promise<{ svg: string; bindFunctions?: (el: Element) => void }>;
}

let mermaidInstance: MermaidAPI | null = null;
let isRendering = false;
let pendingRender = false;
let idCounter = 0;

async function getMermaid(): Promise<MermaidAPI> {
  if (!mermaidInstance) {
    const mermaidUrl =
      "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
    const module = (await import(/* @vite-ignore */ mermaidUrl)) as {
      default: MermaidAPI;
    };
    mermaidInstance = module.default;
  }
  return mermaidInstance;
}

export async function renderMermaidDiagrams(): Promise<void> {
  // Convert any unrendered mermaid code blocks from markdown into .mermaid-diagram containers
  const codeBlocks = document.querySelectorAll<HTMLElement>(
    "pre > code.language-mermaid, pre.language-mermaid"
  );

  codeBlocks.forEach(el => {
    const rawCode = el.textContent?.trim() || "";
    if (!rawCode) return;

    const pre = el.tagName.toLowerCase() === "pre" ? el : el.parentElement;
    if (!pre) return;

    const container = document.createElement("div");
    container.className =
      "mermaid-diagram flex justify-center my-6 overflow-x-auto";
    container.setAttribute("data-code", rawCode);
    pre.replaceWith(container);
  });

  const diagrams = document.querySelectorAll<HTMLElement>(".mermaid-diagram");
  if (diagrams.length === 0) return;

  if (isRendering) {
    pendingRender = true;
    return;
  }
  isRendering = true;

  try {
    const mermaid = await getMermaid();
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    const currentTheme = isDark ? "dark" : "default";

    mermaid.initialize({
      startOnLoad: false,
      theme: currentTheme,
      securityLevel: "loose",
      fontFamily: "inherit",
    });

    for (const container of Array.from(diagrams)) {
      const code = container.getAttribute("data-code");
      if (!code) continue;

      if (container.getAttribute("data-theme-rendered") === currentTheme) {
        continue;
      }

      try {
        const id = `mermaid-${Date.now()}-${++idCounter}`;
        const { svg, bindFunctions } = await mermaid.render(id, code);
        container.innerHTML = svg;
        bindFunctions?.(container);
        container.setAttribute("data-theme-rendered", currentTheme);
      } catch {
        container.innerHTML = `<pre class="text-red-500 font-mono text-sm p-4 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-800">Error rendering Mermaid diagram:\n${code}</pre>`;
      }
    }
  } catch {
    // Silently ignore or fallback
  } finally {
    isRendering = false;
    if (pendingRender) {
      pendingRender = false;
      renderMermaidDiagrams();
    }
  }
}

if (typeof document !== "undefined") {
  // Listen for Astro View Transitions navigation
  document.addEventListener("astro:page-load", () => {
    renderMermaidDiagrams();
  });

  // Re-render when data-theme changes (light/dark mode toggle)
  const themeObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.attributeName === "data-theme") {
        renderMermaidDiagrams();
        break;
      }
    }
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // Initial trigger
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    renderMermaidDiagrams();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      renderMermaidDiagrams();
    });
  }
}

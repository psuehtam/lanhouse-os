/**
 * Regenera o documento COPEL a partir de modulos/copel/fatura.html
 *
 * Saída:
 *   - modulos/copel.html  (conteúdo embutido — funciona em file:// offline)
 *
 * Uso: node scripts/build-copel-doc.js
 */
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const fontePath = path.join(raiz, "modulos", "copel", "fatura.html");
const copelPath = path.join(raiz, "modulos", "copel.html");

const MARK_STYLES_START = "<!-- @build:copel-styles-start -->";
const MARK_STYLES_END = "<!-- @build:copel-styles-end -->";
const MARK_BODY_START = "<!-- @build:copel-body-start -->";
const MARK_BODY_END = "<!-- @build:copel-body-end -->";

const src = fs.readFileSync(fontePath, "utf8");

const styles = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
  .map((m) => m[1])
  .join("\n");

const pf1Start = src.indexOf('<div id="page-container">');
const pf2Start = src.indexOf('<div id="pf2"');
let pageBlock = "";

if (pf1Start > -1) {
  const pf1OnlyEnd = pf2Start > -1 ? pf2Start : src.indexOf("</body>");
  pageBlock = src.slice(pf1Start, pf1OnlyEnd).trim();
} else {
  const pf1OnlyStart = src.indexOf('<div id="pf1"');
  const pf1OnlyEnd = pf2Start > -1 ? pf2Start : src.indexOf("</body>");
  if (pf1OnlyStart > -1) pageBlock = src.slice(pf1OnlyStart, pf1OnlyEnd).trim();
}

if (!pageBlock) {
  console.error("Conteúdo da página não encontrado em", fontePath);
  process.exit(1);
}

const CAMPOS_POR_INDICE = {
  7: "classificacao",
  8: "tipo-fornecimento",
  9: "leitura-anterior-data",
  10: "leitura-atual-data",
  11: "num-dias",
  12: "proxima-leitura",
  13: "unidade-consumidora",
  14: "ref-mes",
  15: "vencimento-meio",
  16: "valor-header",
  17: "nome-linha",
  18: "endereco-linha1",
  19: "endereco-linha2",
  20: "cep-linha",
  21: "cidade-linha",
  22: "cpf-linha",
  126: "leitura-ant-num",
  127: "leitura-atual-num",
  129: "consumo-faturado",
  147: "data-emissao",
  149: "iluminacao-publica",
  151: "valor-total-num",
  133: "reaviso-debitos",
  135: "reaviso-linha1",
  136: "reaviso-linha2",
  137: "reaviso-linha3",
  138: "reaviso-linha4",
  139: "reaviso-titulo-ref",
  140: "reaviso-titulo-valor",
  141: "reaviso-titulo-venc",
  142: "reaviso-ref",
  143: "reaviso-valor",
  144: "reaviso-vencimento",
  145: "reaviso-rodape",
  158: "data-doc-boleto",
  161: "vencimento-boleto",
  166: "unidade-boleto",
  167: "valor-boleto1",
  168: "valor-boleto2",
  169: "boleto-nome",
  170: "boleto-cpf",
  171: "boleto-endereco",
  172: "boleto-nome2",
  173: "boleto-cpf2",
};

let idx = 0;
pageBlock = pageBlock.replace(/<div class="t([^"]*)"[^>]*>([\s\S]*?)<\/div>/g, (full, cls, inner) => {
  const campo = CAMPOS_POR_INDICE[idx] || "";
  const attr = campo ? ` data-campo="${campo}"` : "";
  const out = `<div class="t${cls}"${attr} data-idx="${idx}">${inner}</div>`;
  idx += 1;
  return out;
});

const w0Match = src.match(/\.w0\{width:([\d.]+)px/);
const h0Match = src.match(/\.h0\{height:([\d.]+)px/);
const w1Match = src.match(/\.w1\{width:([\d.]+)px/);
const h1Match = src.match(/\.h1\{height:([\d.]+)px/);
const SCREEN_W = Math.ceil(w0Match ? parseFloat(w0Match[1]) : 595.28);
const SCREEN_H = Math.ceil(h0Match ? parseFloat(h0Match[1]) : 841.89);
const IMG_W = w1Match ? parseFloat(w1Match[1]) : SCREEN_W;
const IMG_H = h1Match ? parseFloat(h1Match[1]) : SCREEN_H;

const PAGE_W_PT = 793.706667;
const PAGE_H_PT = 1122.52;
const ptToMm = (pt) => (pt * 25.4) / 72;
const printScale = 210 / ptToMm(PAGE_W_PT);
const printScaleStr = printScale.toFixed(5);
const marginBottomPt = (-(PAGE_H_PT * (1 - printScale))).toFixed(3);
const marginRightPt = (-(PAGE_W_PT * (1 - printScale))).toFixed(3);

const overridesEmbedded = `
#copel-doc #sidebar,
#copel-doc #outline {
  display: none !important;
}
@media screen {
  #copel-doc {
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    overflow: hidden !important;
    width: ${SCREEN_W}px !important;
    height: ${SCREEN_H}px !important;
    min-width: ${SCREEN_W}px !important;
    max-width: ${SCREEN_W}px !important;
    min-height: ${SCREEN_H}px !important;
    max-height: ${SCREEN_H}px !important;
  }
  #copel-doc #page-container {
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
    right: auto !important;
    bottom: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    width: ${SCREEN_W}px !important;
    height: ${SCREEN_H}px !important;
    min-width: ${SCREEN_W}px !important;
    max-width: ${SCREEN_W}px !important;
    min-height: ${SCREEN_H}px !important;
    max-height: ${SCREEN_H}px !important;
    overflow: hidden !important;
    background: #fff !important;
  }
  #copel-doc .pf.w0.h0 {
    width: ${IMG_W}px !important;
    height: ${IMG_H}px !important;
    min-width: ${IMG_W}px !important;
    max-width: ${IMG_W}px !important;
    min-height: ${IMG_H}px !important;
    max-height: ${IMG_H}px !important;
    margin: 0 !important;
    overflow: hidden !important;
  }
  #copel-doc .pc.w0.h0 {
    overflow: hidden !important;
  }
  #copel-doc .bi.x0.y0.w1.h1 {
    left: 0 !important;
    bottom: 0 !important;
    width: ${IMG_W}px !important;
    height: ${IMG_H}px !important;
  }
}
@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }
  #copel-doc {
    width: 210mm !important;
    height: 297mm !important;
    max-width: 210mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    background: #fff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  #copel-doc #page-container {
    position: relative !important;
    top: 0 !important;
    left: 0 !important;
    margin: 0 ${marginRightPt}pt ${marginBottomPt}pt 0 !important;
    padding: 0 !important;
    width: ${PAGE_W_PT}pt !important;
    height: ${PAGE_H_PT}pt !important;
    overflow: visible !important;
    background: #fff !important;
    transform: scale(${printScaleStr}) !important;
    transform-origin: top left !important;
    -webkit-transform: scale(${printScaleStr}) !important;
    -webkit-transform-origin: top left !important;
  }
  #copel-doc .pf.w0.h0 {
    margin: 0 !important;
    overflow: visible !important;
    page-break-after: always !important;
    page-break-inside: avoid !important;
  }
}
`;

const embeddedStyles = `${styles}\n${overridesEmbedded}`;

function replaceBetween(html, startMark, endMark, replacement) {
  const start = html.indexOf(startMark);
  const end = html.indexOf(endMark);
  if (start === -1 || end === -1 || end < start) {
    console.error(`Marcador não encontrado: ${startMark} / ${endMark}`);
    process.exit(1);
  }
  return html.slice(0, start) + replacement + html.slice(end + endMark.length);
}

let copelHtml = fs.readFileSync(copelPath, "utf8");
copelHtml = replaceBetween(
  copelHtml,
  MARK_STYLES_START,
  MARK_STYLES_END,
  `${MARK_STYLES_START}\n<style id="copel-doc-styles">\n${embeddedStyles}\n</style>\n${MARK_STYLES_END}`
);
copelHtml = replaceBetween(
  copelHtml,
  MARK_BODY_START,
  MARK_BODY_END,
  `${MARK_BODY_START}\n${pageBlock}\n${MARK_BODY_END}`
);
fs.writeFileSync(copelPath, copelHtml);

console.log("Atualizado:", copelPath, "(documento embutido — file:// OK)");
console.log(idx, "campos de texto |", embeddedStyles.includes(".w0{width") ? "CSS OK" : "CSS incompleto");

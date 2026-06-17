/**
 * Regenera modulos/copel/doc.html a partir de modulos/copel/fonte.html
 * Uso (dev): node scripts/build-copel-doc.js
 */
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const fontePath = path.join(__dirname, "copel", "fonte.html");
const docPath = path.join(raiz, "modulos", "copel", "doc.html");

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
  8:   "leitura-anterior-data",
  9:   "leitura-atual-data",
  10:  "num-dias",           // Nº de dias entre leituras
  11:  "proxima-leitura",    // Próxima Leitura (~30 dias depois da atual)
  12:  "unidade-consumidora",
  13:  "ref-mes",
  14:  "vencimento-meio",
  15:  "valor-header",
  16:  "nome-linha",
  17:  "endereco-linha1",
  18:  "endereco-linha2",
  19:  "cep-linha",
  20:  "cidade-linha",
  21:  "cpf-linha",
  113: "leitura-ant-num",    // Leitura anterior (ex: 7215)
  114: "leitura-atual-num",  // Leitura atual (ex: 7694)
  // 115 = Constante/Multiplicador "1" — não editável
  116: "consumo-faturado",
  122: "data-emissao",
  126: "valor-total-num",
  133: "data-doc-boleto",    // "Data do documento" no boleto (= emissão)
  136: "vencimento-boleto",  // DATA VENCIMENTO no boleto
  141: "unidade-boleto",
  142: "valor-boleto1",
  143: "valor-boleto2",
  144: "boleto-nome",
  145: "boleto-cpf",
  146: "boleto-endereco",
  147: "boleto-nome2",
  148: "boleto-cpf2",
};

let idx = 0;
pageBlock = pageBlock.replace(/<div class="t([^"]*)">([^<]*)<\/div>/g, (full, cls, text) => {
  const campo = CAMPOS_POR_INDICE[idx] || "";
  const attr = campo ? ` data-campo="${campo}"` : "";
  const out = `<div class="t${cls}"${attr} data-idx="${idx}">${text}</div>`;
  idx += 1;
  return out;
});

// PDF original (pdf2htmlEX em pt) → escala uniforme para caber em A4 (210×297 mm)
const PAGE_W_PT = 793.706667;
const PAGE_H_PT = 1122.52;
const ptToMm = (pt) => (pt * 25.4) / 72;
const printScale = 210 / ptToMm(PAGE_W_PT);
const printScaleStr = printScale.toFixed(5);
const marginBottomPt = (-(PAGE_H_PT * (1 - printScale))).toFixed(3);
const marginRightPt = (-(PAGE_W_PT * (1 - printScale))).toFixed(3);

const doc = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>COPEL — Documento</title>
<style>
${styles}
#sidebar,
#outline {
  display: none !important;
}
@media screen {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    overflow: hidden !important;
    width: 893px !important;
    height: 1263px !important;
    min-width: 893px !important;
    max-width: 893px !important;
    min-height: 1263px !important;
    max-height: 1263px !important;
  }
  #page-container {
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
    right: auto !important;
    bottom: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 893px !important;
    height: 1263px !important;
    min-width: 893px !important;
    max-width: 893px !important;
    min-height: 1263px !important;
    max-height: 1263px !important;
    overflow: hidden !important;
    background: #fff !important;
  }
  .pf.w0.h0 {
    width: 892.92px !important;
    height: 1262.835px !important;
    min-width: 892.92px !important;
    max-width: 892.92px !important;
    min-height: 1262.835px !important;
    max-height: 1262.835px !important;
    margin: 0 !important;
    overflow: hidden !important;
  }
  .pc.w0.h0 {
    overflow: hidden !important;
  }
  .bi.x0.y0.w1.h1 {
    left: 0 !important;
    bottom: 0 !important;
    width: 892.92px !important;
    height: 1262.835px !important;
  }
}
@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 210mm !important;
    height: 297mm !important;
    max-width: 210mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    background: #fff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  #page-container {
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
  .pf.w0.h0 {
    margin: 0 !important;
    overflow: visible !important;
    page-break-after: always !important;
    page-break-inside: avoid !important;
  }
}
</style>
</head>
<body>
${pageBlock}
</body>
</html>`;

fs.writeFileSync(docPath, doc);
console.log("Gerado:", docPath);
console.log(idx, "campos de texto |", doc.includes(".w0{width") ? "CSS OK" : "CSS incompleto");

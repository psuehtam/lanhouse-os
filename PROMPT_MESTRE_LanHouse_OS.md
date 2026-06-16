# PROMPT MESTRE — LanHouse OS: Sistema Web Offline Modular

> **Como usar este prompt:** Copie tudo abaixo da linha divisória e cole em um novo chat com qualquer IA (Claude, ChatGPT, Gemini, etc.). O contexto completo está embutido. Você pode pausar a geração a qualquer momento e retomar em um novo chat colando este mesmo prompt.

---

## CONTEXTO DO PROJETO

Você é um engenheiro de software sênior especializado em aplicações web offline (client-side only). Você foi contratado para construir um **sistema utilitário modular** para uma funcionária de Lan House chamada **[NOME_DA_NAMORADA]** — substitua pelo nome real antes de usar.

O sistema se chama **LanHouse OS** e vai rodar inteiramente no navegador, sem servidor, sem internet, sem banco de dados externo. Ela abre uma pasta no computador, dá dois cliques em `index.html`, e o sistema abre.

---

## REQUISITOS INEGOCIÁVEIS

1. **100% Offline.** Zero dependências de CDN externo em produção. Se usar uma biblioteca (ex: jsPDF, html2canvas), o arquivo `.js` deve estar salvo localmente dentro do projeto.
2. **Sem servidor local.** Nada de Node.js, Python, Apache, PHP ou qualquer processo rodando em background. Tudo é HTML + CSS + JS puro.
3. **Persistência com LocalStorage.** Configurações fixas (nome da lan house, endereço, CNPJ/CPF, etc.) são salvas no `localStorage` para não precisar digitar toda vez.
4. **Impressão limpa via `window.print()`.** Cada módulo que gera um documento deve ter estilos `@media print` que escondem TODOS os elementos de UI (menus, botões, cabeçalhos do sistema) e exibem apenas o conteúdo do documento formatado em A4.
5. **Stack:** HTML5 + CSS3 puro + JavaScript Vanilla (ES6+). Sem frameworks (React, Vue, Angular). Sem TypeScript.

---

## ARQUITETURA ESCOLHIDA: OPÇÃO B — MULTI-PÁGINAS LOCAL

**Por que esta e não a SPA (Arquivo Único)?**
- Cada módulo é um arquivo `.html` independente → um bug em um módulo nunca quebra os outros.
- Para adicionar um novo módulo, basta criar um novo arquivo `.html` e adicionar um link no `index.html`. É literalmente copiar, colar e adaptar.
- Cada arquivo pode ter seus próprios estilos e scripts sem conflito de nomes ou escopo.
- Mais fácil de depurar: o console do navegador mostra erros apenas do arquivo aberto.

### Estrutura de Pastas do Projeto

```
LanHouseOS/
│
├── index.html                  ← Dashboard principal (menu de navegação)
├── config.html                 ← Página de configurações (dados da Lan House)
│
├── modulos/
│   ├── curriculo.html          ← Módulo 1: Gerador de Currículo
│   ├── recibo.html             ← Módulo 2: Gerador de Recibo (a ser implementado depois)
│   └── [modulo_futuro].html    ← Módulo N: qualquer nova ferramenta
│
├── assets/
│   ├── css/
│   │   └── global.css          ← Estilos compartilhados (tema, cores, componentes)
│   ├── js/
│   │   └── storage.js          ← Utilitários de LocalStorage compartilhados
│   └── libs/
│       └── [bibliotecas.js]    ← Ex: jsPDF salvo localmente (se necessário)
│
└── README.txt                  ← Instruções de uso para a funcionária
```

---

## O QUE VOCÊ DEVE GERAR AGORA

Siga esta ordem exata. Gere um arquivo de cada vez e aguarde confirmação antes de prosseguir para o próximo, a menos que seja instruído diferente.

---

### PASSO 1 — `assets/css/global.css`

Crie o arquivo de estilos globais com:

- **Tema visual:** Interface limpa e profissional em tons escuros (`#1a1a2e` fundo principal, `#16213e` cards, `#e94560` cor de destaque/acento) com texto claro. Lembre que isso é uma ferramenta de trabalho usada o dia inteiro — priorize legibilidade e conforto visual acima de beleza.
- **Variáveis CSS (custom properties)** para todas as cores, fontes e espaçamentos. Exemplo:
  ```css
  :root {
    --cor-fundo: #1a1a2e;
    --cor-card: #16213e;
    --cor-acento: #e94560;
    --cor-texto: #eaeaea;
    --cor-texto-suave: #a0a0b0;
    --fonte-sistema: 'Segoe UI', Arial, sans-serif;
    --raio-borda: 8px;
    --sombra-card: 0 4px 15px rgba(0,0,0,0.3);
  }
  ```
- **Reset básico** (box-sizing, margin, padding).
- **Classes utilitárias reutilizáveis:**
  - `.btn` (botão padrão), `.btn-primario`, `.btn-perigo`, `.btn-sucesso`
  - `.card` (container com fundo escuro e borda sutil)
  - `.campo-form` (label + input/textarea em coluna)
  - `.grid-2`, `.grid-3` (layouts de grid)
  - `.alerta-info`, `.alerta-sucesso`, `.alerta-erro`
- **Regra global `@media print`** que esconde `.no-print` e garante fundo branco na impressão.

---

### PASSO 2 — `assets/js/storage.js`

Crie um módulo JavaScript com funções utilitárias para o LocalStorage:

```javascript
// Exemplo da interface esperada — implemente com tratamento de erros
const LanHouseStorage = {
  // Salva configurações da Lan House
  salvarConfig(dados) { ... },
  
  // Recupera configurações (retorna objeto com defaults se não existir)
  carregarConfig() { ... },
  
  // Salva dados genéricos por chave de módulo
  salvar(chave, dados) { ... },
  
  // Carrega dados por chave (retorna null se não existir)
  carregar(chave) { ... },
  
  // Lista todos os registros salvos com um prefixo (ex: "recibo_")
  listar(prefixo) { ... },
  
  // Remove um registro
  remover(chave) { ... }
};
```

O objeto de configuração padrão (`defaults`) deve conter:
```javascript
{
  nomeLanHouse: "Lan House",
  endereco: "",
  telefone: "",
  cpfCnpj: "",
  nomeAtendente: "",
  corTema: "#e94560"
}
```

---

### PASSO 3 — `config.html`

Crie a página de configurações com:

- Link para `../assets/css/global.css` e `../assets/js/storage.js`
- Formulário com campos para: Nome da Lan House, Endereço Completo, Telefone, CPF/CNPJ, Nome da Atendente Padrão
- Botão **"Salvar Configurações"** que chama `LanHouseStorage.salvarConfig()` e exibe uma mensagem de confirmação inline (sem `alert()`)
- Ao carregar a página, preencher os campos automaticamente com os dados já salvos
- Link de voltar para o dashboard (`index.html`)
- **Não precisa de `@media print`** — esta página nunca é impressa

---

### PASSO 4 — `index.html` (Dashboard Principal)

Crie o painel principal com:

- Cabeçalho com o nome **"LanHouse OS"** e, ao lado, o nome da Lan House (carregado do localStorage em tempo real via JS)
- Grade de cards de navegação, um para cada módulo disponível. Cada card deve ter:
  - Um ícone SVG inline (simples, temático)
  - Nome do módulo
  - Breve descrição de uma linha
  - Botão/link que abre `modulos/[nome].html`
- Cards presentes no MVP:
  1. **Gerador de Currículo** → `modulos/curriculo.html`
  2. **Gerador de Recibo** → `modulos/recibo.html` *(marcar como "Em breve" com visual desabilitado se o arquivo não existir ainda)*
- Card especial no rodapé/canto: **"⚙ Configurações"** → `config.html`
- Rodapé discreto com: `"LanHouse OS v1.0 — Sistema Offline"`
- **Não precisa de `@media print`**

---

### PASSO 5 — `modulos/curriculo.html` (Módulo 1 — Gerador de Currículo)

Este é o módulo mais complexo do MVP. Implemente com atenção total.

#### 5.1 — Interface de Edição (visível na tela, oculta na impressão)

Painel lateral ou superior (classe `no-print`) com seções colapsáveis/em abas:

- **Dados Pessoais:** Nome completo, Profissão/Cargo desejado, Telefone, E-mail, Cidade/UF, LinkedIn (opcional)
- **Objetivo Profissional:** Textarea (máx. 3 linhas sugeridas)
- **Experiência Profissional:** Sistema dinâmico para adicionar/remover experiências. Cada item tem: Empresa, Cargo, Período (de/até), Descrição das atividades. Botão **"+ Adicionar Experiência"**
- **Formação Acadêmica:** Sistema dinâmico. Cada item: Instituição, Curso, Nível (Médio/Técnico/Superior/Pós), Período
- **Habilidades:** Campo de texto livre ou tags (ex: "Excel, Atendimento ao Cliente, Digitação")
- **Cursos Extras:** Opcional. Sistema dinâmico: Nome do curso, Instituição, Carga horária

Botões de ação (`no-print`):
- **"👁 Pré-visualizar"** — rola a página até o preview
- **"🖨 Imprimir / Salvar PDF"** — chama `window.print()`
- **"💾 Salvar Rascunho"** — salva o formulário no localStorage com chave `curriculo_rascunho`
- **"📂 Carregar Rascunho"** — recupera os dados salvos
- **"🗑 Limpar Tudo"** — limpa o formulário após confirmação

#### 5.2 — Preview do Currículo (visível sempre, formatado para A4)

Container com classe `.preview-curriculo` que renderiza em tempo real conforme o usuário preenche os campos (via `input` e `change` events).

**Layout do currículo impresso:**
```
┌─────────────────────────────────────────────┐
│  [NOME COMPLETO — grande, bold]             │
│  [Profissão/Cargo] | [Cidade/UF]            │
│  [Telefone] | [E-mail] | [LinkedIn]         │
├─────────────────────────────────────────────┤
│  OBJETIVO PROFISSIONAL                      │
│  [texto do objetivo]                        │
├─────────────────────────────────────────────┤
│  EXPERIÊNCIA PROFISSIONAL                   │
│  [Cargo] — [Empresa]            [Período]   │
│  [Descrição das atividades]                 │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│  [próxima experiência...]                   │
├─────────────────────────────────────────────┤
│  FORMAÇÃO ACADÊMICA                         │
│  [Curso] — [Instituição]        [Período]   │
├─────────────────────────────────────────────┤
│  HABILIDADES                                │
│  [habilidade 1] • [habilidade 2] • ...     │
├─────────────────────────────────────────────┤
│  CURSOS E CERTIFICAÇÕES (se preenchido)     │
│  [Nome do curso] — [Instituição] [Horas]   │
└─────────────────────────────────────────────┘
```

#### 5.3 — CSS de Impressão (`@media print`) obrigatório

```css
@media print {
  /* Esconder absolutamente tudo que não é o currículo */
  body > *:not(#area-impressao) { display: none !important; }
  
  #area-impressao {
    display: block !important;
    width: 210mm;
    min-height: 297mm;
    margin: 0;
    padding: 15mm 20mm;
    font-family: 'Georgia', serif;
    font-size: 11pt;
    color: #000;
    background: #fff;
  }
  
  /* Seções do currículo com separação limpa */
  .secao-curriculo { margin-bottom: 12pt; }
  .secao-titulo {
    font-size: 10pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1.5pt;
    border-bottom: 0.5pt solid #000;
    margin-bottom: 6pt;
    padding-bottom: 2pt;
  }
  
  /* Forçar quebra de página se necessário */
  .quebra-pagina { page-break-before: always; }
  
  @page {
    size: A4;
    margin: 0;
  }
}
```

#### 5.4 — Comportamento JavaScript

- Todo o formulário deve atualizar o preview em tempo real.
- Os campos dinâmicos (experiências, formações, cursos) devem usar delegação de eventos no container pai, não em cada item individual.
- O rascunho salvo deve incluir **todos** os campos dinâmicos como arrays de objetos.
- Ao recarregar um rascunho, recriar os itens dinâmicos no DOM antes de preencher.

---

### PASSO 6 — `README.txt`

Gere um arquivo de texto simples (sem markdown) com instruções para a funcionária:

```
LANHOUSE OS — Guia Rápido
===========================

COMO ABRIR O SISTEMA:
1. Abra a pasta "LanHouseOS" 
2. Dê dois cliques em "index.html"
3. O sistema abrirá no navegador

PRIMEIRA VEZ:
- Clique em "Configurações"
- Preencha os dados da Lan House
- Clique em "Salvar"
- Pronto! Esses dados são lembrados automaticamente

PARA IMPRIMIR OU SALVAR EM PDF:
- Use o botão "Imprimir / Salvar PDF" dentro de cada módulo
- Na janela de impressão, escolha "Salvar como PDF" na lista de impressoras

ATENÇÃO:
- Não mova ou renomeie as pastas internas
- Os dados ficam salvos no navegador deste computador
- Se limpar o histórico/cache do navegador, os rascunhos salvos são apagados
```

---

## GUIA DO DESENVOLVEDOR: COMO ADICIONAR UM NOVO MÓDULO

> Esta seção deve ser incluída como comentário no `index.html` E gerada como resposta separada pelo assistente. É o "manual de expansão" do sistema.

### Para adicionar, por exemplo, um "Módulo de Contrato de Serviço":

**Passo 1 — Copiar o template base**
```
Copie o arquivo: modulos/curriculo.html
Renomeie para:   modulos/contrato.html
```

**Passo 2 — Editar o novo arquivo**
Abra `modulos/contrato.html` e:
- Troque o `<title>` de "Gerador de Currículo" para "Gerador de Contrato"
- Limpe os campos do formulário e substitua pelos campos do contrato
- Ajuste o layout do preview para o layout do contrato
- Mantenha a estrutura de `@media print` — só ajuste o conteúdo interno

**Passo 3 — Registrar no Dashboard**
Abra `index.html` e copie um dos `<div class="card-modulo">` existentes:
```html
<!-- COPIE ESTE BLOCO E COLE ABAIXO DO ÚLTIMO MÓDULO -->
<div class="card-modulo">
  <div class="card-icone">📄</div>
  <h3>Gerador de Contrato</h3>
  <p>Crie contratos de serviços simples com assinatura</p>
  <a href="modulos/contrato.html" class="btn btn-primario">Abrir</a>
</div>
```

**É só isso.** O novo módulo já está integrado ao sistema.

---

## INSTRUÇÕES FINAIS PARA A IA

1. Gere cada arquivo completo, sem cortes ou placeholders como `// resto do código aqui`.
2. Todo HTML deve ser válido e ter `<!DOCTYPE html>`, `<html lang="pt-BR">`, `<meta charset="UTF-8">` e `<meta name="viewport">`.
3. Use comentários `<!-- SEÇÃO: Nome -->` em blocos relevantes do HTML para facilitar manutenção futura.
4. Use comentários `/* === SEÇÃO === */` no CSS para separar grupos de regras.
5. Use comentários `// --- MÓDULO: Nome ---` no JavaScript para separar funcionalidades.
6. Após gerar todos os arquivos, liste um resumo com: arquivos criados, estrutura de pastas final e próximos módulos sugeridos para implementar.
7. Não use `alert()`, `confirm()` ou `prompt()` nativos do browser — implemente feedbacks visuais inline (classes CSS de estado).
8. **Importante:** Ao gerar o CSS de impressão, teste mentalmente: "Se eu chamar `window.print()` agora, o que apareceria no papel?" Apenas o documento deve aparecer.

---

*Prompt gerado por Claude (Anthropic) — Versão 1.0 — Junho 2026*
*Projeto: LanHouse OS — Sistema Offline para Lan House*

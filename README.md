# LanHouse OS

Sistema utilitário **100% offline** para uso interno de lan house. Roda direto no navegador — sem servidor, sem internet, sem instalação.

## Como usar

1. Abra a pasta do projeto
2. Dê dois cliques em **`index.html`**
3. O sistema abre no navegador

## Primeira vez / Configurações

1. Clique em **Configurações** (ícone de engrenagem)
2. Preencha os dados da Lan House
3. Clique em **Salvar Configurações**

Os dados ficam salvos no navegador automaticamente.

## Módulos disponíveis

| Módulo | Arquivo | Descrição |
|---|---|---|
| Gerador de Currículo | `modulos/curriculo.html` | Cria currículo e salva como PDF |
| Gerador de Recibo | `modulos/recibo.html` | Gera recibos de serviço |
| COPEL — Fatura | `modulos/copel.html` | Preenche comprovante de fatura COPEL |

## Imprimir / Salvar como PDF

1. Abra um módulo
2. Preencha os dados
3. Clique no botão **Imprimir comprovante**
4. Na janela do navegador, selecione **"Salvar como PDF"** na lista de destinos

## Estrutura do projeto

```
lanhouse-os/
├── index.html              → Dashboard principal
├── config.html             → Configurações da lan house
│
├── modulos/
│   ├── curriculo.html      → Módulo: Gerador de Currículo
│   ├── recibo.html         → Módulo: Gerador de Recibo
│   ├── copel.html          → Módulo: Fatura COPEL
│   └── copel/
│       └── doc.html        → Documento gerado (não editar)
│
├── assets/
│   ├── css/global.css      → Estilos compartilhados
│   ├── js/storage.js       → Utilitário de localStorage
│   └── img/                → Imagens e logos
│
├── scripts/
│   ├── build-copel-doc.js  → Regenera modulos/copel/doc.html (dev)
│   └── copel/
│       └── fonte.html      → Fonte HTML original da fatura (dev)
│
└── docs/
    ├── prompt_mestre.md    → Contexto do projeto para IA (dev)
    └── referencias/        → Imagens de referência para desenvolvimento
```

## Atenção

- Os dados ficam salvos **no navegador deste computador** via localStorage
- Limpar o histórico/cache do navegador pode apagar rascunhos salvos
- Não mova nem renomeie as pastas internas do projeto

## Desenvolvimento — Regenerar documento COPEL

Se alterar `scripts/copel/fonte.html`, rode no terminal:

```bash
node scripts/build-copel-doc.js
```

Isso atualiza `modulos/copel/doc.html` com os campos editáveis mapeados.

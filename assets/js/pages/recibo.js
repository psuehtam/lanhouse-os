/* ── LOGO PADRÃO (PNG) ── */

const LOGO_PADRAO_IMG_SRC = '../assets/img/logo_adrenalina.png';
const LOGO_IMG_STYLE = 'height:104px;width:auto;max-width:260px;display:block;object-fit:contain;';
const DEFAULT_LOGO_MARKUP = '<img src="' + LOGO_PADRAO_IMG_SRC + '" alt="" style="' + LOGO_IMG_STYLE + '" />';
let currentLogo = DEFAULT_LOGO_MARKUP;

/* ── UTILITIES ── */

  function $(id) { return document.getElementById(id); }

  function setText(id, val, fallback) {
    const el = $(id);
    if (val && val.toString().trim()) {
      el.innerHTML = escHtml(val);
    } else {
      el.innerHTML = `<span class="placeholder">${fallback || '—'}</span>`;
    }
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── CURRENCY MASK ── */

  function formatCurrency(raw) {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    const cents = parseInt(digits, 10);
    return (cents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  $('inp-valor').addEventListener('input', function () {
    const pos = this.selectionStart;
    const old = this.value;
    this.value = formatCurrency(this.value);
    // Keep cursor near end when typing
    const diff = this.value.length - old.length;
    try { this.setSelectionRange(pos + diff, pos + diff); } catch(_) {}
    update();
  });

  /* ── DATE FORMAT ── */

  function formatDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ── NÚMERO POR EXTENSO (BRL) ── */

  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
    'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  function numGrupo(n) {
    if (n === 100) return 'cem';
    let s = '';
    const c = Math.floor(n / 100);
    const r = n % 100;
    if (c > 0) s += centenas[c];
    if (c > 0 && r > 0) s += ' e ';
    if (r < 20) {
      s += unidades[r];
    } else {
      const d = Math.floor(r / 10);
      const u = r % 10;
      s += dezenas[d];
      if (u > 0) s += ' e ' + unidades[u];
    }
    return s;
  }

  function numExtenso(valor) {
    if (isNaN(valor) || valor < 0) return '';
    valor = Math.round(valor * 100) / 100;
    const reais = Math.floor(valor);
    const centavos = Math.round((valor - reais) * 100);

    let partes = [];

    if (reais === 0 && centavos === 0) return 'zero reais';

    if (reais > 0) {
      const bilhoes = Math.floor(reais / 1e9);
      const milhoes = Math.floor((reais % 1e9) / 1e6);
      const milhares = Math.floor((reais % 1e6) / 1e3);
      const resto = reais % 1e3;

      if (bilhoes > 0) partes.push(numGrupo(bilhoes) + (bilhoes === 1 ? ' bilhão' : ' bilhões'));
      if (milhoes > 0) partes.push(numGrupo(milhoes) + (milhoes === 1 ? ' milhão' : ' milhões'));
      if (milhares > 0) partes.push(numGrupo(milhares) + ' mil');
      if (resto > 0) partes.push(numGrupo(resto));

      const strReais = partes.join(' e ') + (reais === 1 ? ' real' : ' reais');
      partes = [strReais];
    }

    if (centavos > 0) {
      const strCentavos = numGrupo(centavos) + (centavos === 1 ? ' centavo' : ' centavos');
      partes.push(strCentavos);
    }

    return partes.join(' e ');
  }

  /* ── CPF / CNPJ MASK ── */

  function maskCpfCnpj(val) {
    const d = val.replace(/\D/g, '').slice(0, 14);
    if (d.length <= 11) {
      return d.replace(/(\d{3})(\d)/, '$1.$2')
              .replace(/(\d{3})(\d)/, '$1.$2')
              .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return d.replace(/(\d{2})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d)/, '$1/$2')
             .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }

  ['inp-cpf-emissor', 'inp-cpf-pagador'].forEach(id => {
    $(id).addEventListener('input', function () {
      const pos = this.selectionStart;
      const old = this.value;
      this.value = maskCpfCnpj(this.value);
      const diff = this.value.length - old.length;
      try { this.setSelectionRange(pos + diff, pos + diff); } catch(_) {}
      update();
    });
  });

  /* ── TOGGLE STATE ── */

  const state = { semNumero: false, semCpfEmissor: false, semCpfPagador: false, semLogo: false };

  function toggleSemNumero() {
    state.semNumero = !state.semNumero;
    const btn = $('toggle-numero');
    const inp = $('inp-numero');
    btn.classList.toggle('active', state.semNumero);
    btn.querySelector('.t-icon').textContent = state.semNumero ? '✓' : '◌';
    inp.disabled = state.semNumero;
    update();
  }

  function toggleLogo() {
    state.semLogo = !state.semLogo;
    const btn = $('toggle-logo');
    btn.classList.toggle('active', state.semLogo);
    btn.querySelector('.t-icon').textContent = state.semLogo ? '✓' : '◌';
    update();
  }

  function restaurarLogo() {
    $('btn-restaurar-logo').style.display = 'none';
    $('inp-logo-file').value = '';
    currentLogo = DEFAULT_LOGO_MARKUP;
    $('receipt-logo-wrap').dataset.loaded = '';
    update();
  }

  $('inp-logo-file').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      currentLogo = `<img src="${ev.target.result}" style="height:104px;width:auto;max-width:260px;display:block;object-fit:contain;" />`;
      $('btn-restaurar-logo').style.display = '';
      update();
    };
    reader.readAsDataURL(file);
    this.value = '';
  });

  function limparEmissor() {
    $('inp-emissor').value = '';
    $('inp-cpf-emissor').value = '';
    update();
  }

  function toggleCpf(lado) {
    const key = lado === 'emissor' ? 'semCpfEmissor' : 'semCpfPagador';
    state[key] = !state[key];
    const btn = $('toggle-cpf-' + lado);
    const inp = $('inp-cpf-' + lado);
    btn.classList.toggle('active', state[key]);
    btn.querySelector('.t-icon').textContent = state[key] ? '✓' : '◌';
    inp.disabled = state[key];
    update();
  }

  /* ── LIVE UPDATE ── */

  function update() {
    const numero    = $('inp-numero').value.trim();
    const data      = $('inp-data').value;
    const valor     = $('inp-valor').value.trim();
    const emissor   = $('inp-emissor').value.trim();
    const pagador   = $('inp-pagador').value.trim();
    const descricao = $('inp-descricao').value.trim();
    const cpfEmissor = $('inp-cpf-emissor').value.trim();
    const cpfPagador = $('inp-cpf-pagador').value.trim();

    // Logo
    const logoWrap = $('receipt-logo-wrap');
    if (state.semLogo) {
      logoWrap.style.display = 'none';
    } else {
      logoWrap.style.display = '';
      logoWrap.innerHTML = currentLogo;
    }

    // Número
    const metaNumero = $('meta-label-numero');
    const outNumero  = $('out-numero');
    if (state.semNumero) {
      metaNumero.style.display = 'none';
      outNumero.style.display  = 'none';
    } else {
      metaNumero.style.display = '';
      outNumero.style.display  = '';
      setText('out-numero', numero, '—');
    }

    setText('out-data', data ? formatDate(data) : '', '—');

    // Amount
    if (valor) {
      $('out-valor').textContent = 'R$ ' + valor;
      const numerico = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
      const extenso = numExtenso(numerico);
      $('out-valor-extenso').textContent = extenso ? '(' + extenso.charAt(0).toUpperCase() + extenso.slice(1) + ')' : '';
    } else {
      $('out-valor').textContent = 'R$ —';
      $('out-valor-extenso').textContent = '';
    }

    setText('out-emissor', emissor, '—');
    $('out-cpf-emissor').textContent = (!state.semCpfEmissor && cpfEmissor) ? cpfEmissor : '';

    setText('out-pagador', pagador, '—');
    $('out-cpf-pagador').textContent = (!state.semCpfPagador && cpfPagador) ? cpfPagador : '';

    // Description: preserve line breaks
    if (descricao) {
      $('out-descricao').innerHTML = escHtml(descricao).replace(/\n/g, '<br>');
    } else {
      $('out-descricao').innerHTML = '<span class="placeholder">—</span>';
    }

    // Signature label
    $('out-assinatura').textContent = emissor || 'Assinatura do Emissor';
    $('out-assinatura-cpf').textContent = (!state.semCpfEmissor && cpfEmissor) ? cpfEmissor : '';
  }

  /* ── BIND ALL INPUTS ── */

  ['inp-numero', 'inp-data', 'inp-emissor', 'inp-pagador', 'inp-descricao'].forEach(id => {
    $(id).addEventListener('input', update);
  });

  /* ── EXPORT PDF ── */

  function exportarPDF() {
    // No modo offline, o "PDF" é gerado via `Salvar como PDF` na janela de impressão.
    window.print();
  }

  /* ── SET DEFAULT DATE TO TODAY ── */

  (function init() {
    const today = new Date();
    const iso = today.toISOString().split('T')[0];
    $('inp-data').value = iso;
    $('inp-numero').value = '001';
    const cfgRaw = (function getCfgRaw() {
      try {
        return localStorage.getItem("lanhouse_config");
      } catch (_) {
        return null;
      }
    })();
    const cfg = cfgRaw ? LanHouseStorage.carregarConfig() : null;

    // Pré-preenche dados do emissor apenas quando os campos estiverem vazios.
    if (!($('inp-emissor').value || "").trim()) {
      $('inp-emissor').value = (cfg && cfg.nomeLanHouse) ? cfg.nomeLanHouse : 'Adrenalina Lan House & Informática';
    }
    if (!($('inp-cpf-emissor').value || "").trim()) {
      $('inp-cpf-emissor').value = (cfg && cfg.cpfCnpj) ? cfg.cpfCnpj : '09.389.937/0001-75';
    }

    update();
  })();
// Handlers globais (onclick no HTML)
window.$ = $;
window.toggleSemNumero = toggleSemNumero;
window.toggleLogo = toggleLogo;
window.restaurarLogo = restaurarLogo;
window.limparEmissor = limparEmissor;
window.toggleCpf = toggleCpf;
window.exportarPDF = exportarPDF;
// LanHouseStorage: utilitário 100% local para LocalStorage
// (sem dependências externas)
const LanHouseStorage = (() => {
  const KEY_CONFIG = "lanhouse_config";

  const defaults = {
    nomeLanHouse: "Lan House",
    endereco: "",
    telefone: "",
    cpfCnpj: "",
    nomeAtendente: "",
    corTema: "#e94560",
  };

  function safeParseJSON(value) {
    try {
      return JSON.parse(value);
    } catch (_) {
      return null;
    }
  }

  function carregarConfig() {
    const raw = localStorage.getItem(KEY_CONFIG);
    if (!raw) return { ...defaults };
    const parsed = safeParseJSON(raw);
    if (!parsed || typeof parsed !== "object") return { ...defaults };
    return { ...defaults, ...parsed };
  }

  function salvarConfig(dados) {
    const payload = { ...defaults, ...(dados && typeof dados === "object" ? dados : {}) };
    try {
      localStorage.setItem(KEY_CONFIG, JSON.stringify(payload));
      return true;
    } catch (_) {
      return false;
    }
  }

  function salvar(chave, dados) {
    if (!chave) return false;
    try {
      localStorage.setItem(chave, JSON.stringify(dados));
      return true;
    } catch (_) {
      return false;
    }
  }

  function carregar(chave) {
    if (!chave) return null;
    const raw = localStorage.getItem(chave);
    if (!raw) return null;
    const parsed = safeParseJSON(raw);
    return parsed === null ? null : parsed;
  }

  function listar(prefixo) {
    const resultados = [];
    const p = String(prefixo || "");
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(p)) continue;

      const raw = localStorage.getItem(k);
      const parsed = safeParseJSON(raw);
      resultados.push({
        chave: k,
        dados: parsed,
      });
    }
    return resultados;
  }

  function remover(chave) {
    if (!chave) return false;
    try {
      localStorage.removeItem(chave);
      return true;
    } catch (_) {
      return false;
    }
  }

  return {
    defaults,
    carregarConfig,
    salvarConfig,
    salvar,
    carregar,
    listar,
    remover,
  };
})();


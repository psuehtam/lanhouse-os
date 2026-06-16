// --- SEÇÃO: helpers de UI ---
const $ = (id) => document.getElementById(id);
const form = $("form-config");
const msgEstado = $("msg-estado");

function setMensagem(tipo, texto) {
  msgEstado.style.display = "block";
  msgEstado.className = "";
  if (tipo === "sucesso") msgEstado.classList.add("alerta-sucesso");
  if (tipo === "erro") msgEstado.classList.add("alerta-erro");
  if (tipo === "info") msgEstado.classList.add("alerta-info");
  msgEstado.textContent = texto;
}

function preencherFormulario(config) {
  $("nomeLanHouse").value = config.nomeLanHouse || "";
  $("endereco").value = config.endereco || "";
  $("telefone").value = config.telefone || "";
  $("cpfCnpj").value = config.cpfCnpj || "";
  $("nomeAtendente").value = config.nomeAtendente || "";
  $("corTema").value = config.corTema || "#e94560";
  document.documentElement.style.setProperty("--cor-acento", $("corTema").value);
}

const configAtual = LanHouseStorage.carregarConfig();
preencherFormulario(configAtual);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const dados = {
    nomeLanHouse: $("nomeLanHouse").value.trim(),
    endereco: $("endereco").value.trim(),
    telefone: $("telefone").value.trim(),
    cpfCnpj: $("cpfCnpj").value.trim(),
    nomeAtendente: $("nomeAtendente").value.trim(),
    corTema: $("corTema").value,
  };

  const ok = LanHouseStorage.salvarConfig(dados);
  if (ok) {
    setMensagem("sucesso", "Configurações salvas com sucesso.");
  } else {
    setMensagem("erro", "Não foi possível salvar as configurações no navegador.");
  }
});

$("btn-restaurar").addEventListener("click", () => {
  preencherFormulario(LanHouseStorage.defaults);
  setMensagem("info", "Valores de exemplo restaurados. Clique em Salvar para persistir.");
});

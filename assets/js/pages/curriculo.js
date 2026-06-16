// --- SEÇÃO: helpers ---
      const $ = (id) => document.getElementById(id);

      const areaUI = $("area-ui");
      const areaImpressao = $("area-impressao");

      const msgEstado = $("msg-estado");
      const modal = $("modal-confirmar");
      const modalCancelar = $("modal-cancelar");
      const modalConfirmar = $("modal-confirmar-btn");

      function mostrarMsg(tipo, texto) {
        msgEstado.style.display = "block";
        msgEstado.className = "";
        if (tipo === "sucesso") msgEstado.classList.add("alerta-sucesso");
        if (tipo === "erro") msgEstado.classList.add("alerta-erro");
        if (tipo === "info") msgEstado.classList.add("alerta-info");
        msgEstado.textContent = texto;
      }

      function mostrarModalConfirmarLimpeza() {
        modal.style.display = "flex";
      }
      function fecharModal() {
        modal.style.display = "none";
      }

      function normalizarTextoLivre(valor) {
        return String(valor || "").replace(/\s+/g, " ").trim();
      }

      function normalizarMultilinha(valor) {
        return String(valor || "").replace(/\r\n/g, "\n").trim();
      }

      function splitHabilidades(valor) {
        return String(valor || "")
          .split(/[,;\n]/g)
          .map((s) => s.trim())
          .filter(Boolean);
      }

      function renderQuebras(texto) {
        const t = String(texto || "").trim();
        if (!t) return "";
        return t
          .split("\n")
          .map((line) => `<div>${escapeHtml(line)}</div>`)
          .join("");
      }

      function escapeHtml(str) {
        return String(str)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      // --- SEÇÃO: criação de itens dinâmicos (Experiências/Formações/Cursos) ---
      function criarBlocoExperiencia(data) {
        const wrapper = document.createElement("div");
        wrapper.style.border = "1px solid var(--cor-borda)";
        wrapper.style.borderRadius = "var(--raio-borda-sm)";
        wrapper.style.padding = "12px";
        wrapper.style.marginBottom = "12px";
        wrapper.setAttribute("data-tipo", "experiencia");

        wrapper.innerHTML = `
          <div class="grid-2" style="gap: 12px;">
            <div class="campo-form">
              <label>Empresa</label>
              <input class="exp-empresa" type="text" value="${escapeHtml(data?.empresa || "")}" placeholder="Nome da empresa" />
            </div>
            <div class="campo-form">
              <label>Cargo</label>
              <input class="exp-cargo" type="text" value="${escapeHtml(data?.cargo || "")}" placeholder="Cargo exercido" />
            </div>
          </div>

          <div class="grid-2" style="gap: 12px; margin-top: 10px;">
            <div class="campo-form">
              <label>Período (de)</label>
              <input class="exp-de" type="text" value="${escapeHtml(data?.periodoDe || "")}" placeholder="Ex: 2021" />
            </div>
            <div class="campo-form">
              <label>Período (até)</label>
              <input class="exp-ate" type="text" value="${escapeHtml(data?.periodoAte || "")}" placeholder="Ex: 2023" />
            </div>
          </div>

          <div class="campo-form" style="margin-top: 10px;">
            <label>Descrição das atividades</label>
            <textarea class="exp-descricao" rows="3" placeholder="O que você fazia?">${escapeHtml(data?.descricao || "")}</textarea>
          </div>

          <div style="margin-top: 10px; display:flex; justify-content:flex-end;">
            <button type="button" class="btn btn-perigo" data-remove-experiencia="1">Remover</button>
          </div>
        `;
        return wrapper;
      }

      function criarBlocoFormacao(data) {
        const wrapper = document.createElement("div");
        wrapper.style.border = "1px solid var(--cor-borda)";
        wrapper.style.borderRadius = "var(--raio-borda-sm)";
        wrapper.style.padding = "12px";
        wrapper.style.marginBottom = "12px";
        wrapper.setAttribute("data-tipo", "formacao");

        wrapper.innerHTML = `
          <div class="grid-2" style="gap: 12px;">
            <div class="campo-form">
              <label>Curso</label>
              <input class="form-curso" type="text" value="${escapeHtml(data?.curso || "")}" placeholder="Ex: Técnico em Informática" />
            </div>
            <div class="campo-form">
              <label>Instituição</label>
              <input class="form-inst" type="text" value="${escapeHtml(data?.instituicao || "")}" placeholder="Ex: Escola X" />
            </div>
          </div>

          <div class="grid-2" style="gap: 12px; margin-top: 10px;">
            <div class="campo-form">
              <label>Nível</label>
              <select class="form-nivel">
                <option value="" ${!data?.nivel ? "selected" : ""}>Selecione...</option>
                <option value="Médio/Técnico" ${data?.nivel === "Médio/Técnico" ? "selected" : ""}>Médio/Técnico</option>
                <option value="Superior" ${data?.nivel === "Superior" ? "selected" : ""}>Superior</option>
                <option value="Pós" ${data?.nivel === "Pós" ? "selected" : ""}>Pós</option>
              </select>
            </div>
            <div class="campo-form">
              <label>Período</label>
              <input class="form-periodo" type="text" value="${escapeHtml(data?.periodo || "")}" placeholder="Ex: 2018 - 2020" />
            </div>
          </div>

          <div style="margin-top: 10px; display:flex; justify-content:flex-end;">
            <button type="button" class="btn btn-perigo" data-remove-formacao="1">Remover</button>
          </div>
        `;
        return wrapper;
      }

      function criarBlocoCursoExtra(data) {
        const wrapper = document.createElement("div");
        wrapper.style.border = "1px solid var(--cor-borda)";
        wrapper.style.borderRadius = "var(--raio-borda-sm)";
        wrapper.style.padding = "12px";
        wrapper.style.marginBottom = "12px";
        wrapper.setAttribute("data-tipo", "curso-extra");

        wrapper.innerHTML = `
          <div class="grid-2" style="gap: 12px;">
            <div class="campo-form">
              <label>Nome do curso</label>
              <input class="curso-nome" type="text" value="${escapeHtml(data?.nomeCurso || "")}" placeholder="Ex: Excel Avançado" />
            </div>
            <div class="campo-form">
              <label>Instituição</label>
              <input class="curso-inst" type="text" value="${escapeHtml(data?.instituicao || "")}" placeholder="Ex: Senai" />
            </div>
          </div>

          <div class="campo-form" style="margin-top: 10px;">
            <label>Carga horária</label>
            <input class="curso-carga" type="text" value="${escapeHtml(data?.cargaHoraria || "")}" placeholder="Ex: 40h" />
          </div>

          <div style="margin-top: 10px; display:flex; justify-content:flex-end;">
            <button type="button" class="btn btn-perigo" data-remove-curso-extra="1">Remover</button>
          </div>
        `;
        return wrapper;
      }

      // --- SEÇÃO: áreas dinâmicas ---
      const listaExperiencias = $("lista-experiencias");
      const listaFormacoes = $("lista-formacoes");
      const listaCursosExtras = $("lista-cursos-extras");

      function obterEstadoDoFormulario() {
        const personal = {
          nomeCompleto: normalizarTextoLivre($("inp-nome").value),
          profissaoCargo: normalizarTextoLivre($("inp-profissao").value),
          cidadeUf: normalizarTextoLivre($("inp-cidadeUf").value),
          telefone: normalizarTextoLivre($("inp-telefone").value),
          email: normalizarTextoLivre($("inp-email").value),
          linkedin: normalizarTextoLivre($("inp-linkedin").value),
        };

        const objetivo = normalizarMultilinha($("inp-objetivo").value);

        const experiencias = Array.from(listaExperiencias.querySelectorAll('[data-tipo="experiencia"]')).map((el) => ({
          empresa: el.querySelector(".exp-empresa")?.value || "",
          cargo: el.querySelector(".exp-cargo")?.value || "",
          periodoDe: el.querySelector(".exp-de")?.value || "",
          periodoAte: el.querySelector(".exp-ate")?.value || "",
          descricao: el.querySelector(".exp-descricao")?.value || "",
        }));

        const formacoes = Array.from(listaFormacoes.querySelectorAll('[data-tipo="formacao"]')).map((el) => ({
          instituicao: el.querySelector(".form-inst")?.value || "",
          curso: el.querySelector(".form-curso")?.value || "",
          nivel: el.querySelector(".form-nivel")?.value || "",
          periodo: el.querySelector(".form-periodo")?.value || "",
        }));

        const habilidades = $("inp-habilidades").value || "";

        const cursosExtras = Array.from(listaCursosExtras.querySelectorAll('[data-tipo="curso-extra"]')).map((el) => ({
          nomeCurso: el.querySelector(".curso-nome")?.value || "",
          instituicao: el.querySelector(".curso-inst")?.value || "",
          cargaHoraria: el.querySelector(".curso-carga")?.value || "",
        }));

        return { personal, objetivo, experiencias, formacoes, habilidades, cursosExtras };
      }

      function atualizarPreview() {
        const state = obterEstadoDoFormulario();

        $("prev-nome").textContent = state.personal.nomeCompleto || "—";
        $("prev-profissao").textContent = state.personal.profissaoCargo
          ? `${state.personal.profissaoCargo}`
          : "Profissão/Cargo";
        $("prev-cidadeUf").textContent = state.personal.cidadeUf ? state.personal.cidadeUf : "";

        const telefone = state.personal.telefone ? `Telefone: ${state.personal.telefone}` : "";
        const email = state.personal.email ? `E-mail: ${state.personal.email}` : "";
        const linkedin = state.personal.linkedin ? `LinkedIn: ${state.personal.linkedin}` : "";
        $("prev-telefone").textContent = telefone;
        $("prev-email").textContent = email;
        $("prev-linkedin").textContent = linkedin;

        $("prev-objetivo").innerHTML = state.objetivo
          ? state.objetivo.split("\n").map((line) => escapeHtml(line)).join("<br/>")
          : "—";

        // Experiências
        const prevExp = [];
        if (state.experiencias.length) {
          state.experiencias.forEach((item, idx) => {
            const cargoEmpresa = [item.cargo, item.empresa].filter(Boolean).join(" — ");
            const periodo = [item.periodoDe, item.periodoAte].filter(Boolean).join(" até ");

            const desc = item.descricao ? normalizarMultilinha(item.descricao) : "";
            prevExp.push(`
              <div class="prev-item">
                <div style="font-weight:700; margin-bottom: 3pt;">${escapeHtml(cargoEmpresa || `Experiência ${idx + 1}`)}</div>
                <div style="font-size: 10pt; margin-bottom: 4pt; color: rgba(0,0,0,0.75);">${escapeHtml(periodo)}</div>
                <div style="font-size: 10.5pt;">${desc ? desc.split("\n").map((l) => escapeHtml(l)).join("<br/>") : ""}</div>
              </div>
              ${idx < state.experiencias.length - 1 ? '<div class="quebra-linha" style="margin: 8pt 0; border-top: 1px dashed rgba(0,0,0,0.35);"></div>' : ""}
            `);
          });
        } else {
          prevExp.push(`<div style="color: rgba(0,0,0,0.65);">—</div>`);
        }
        $("prev-experiencias").innerHTML = prevExp.join("");

        // Formações
        const prevForm = [];
        if (state.formacoes.length) {
          state.formacoes.forEach((f, idx) => {
            const titulo = [f.curso, f.instituicao].filter(Boolean).join(" — ");
            const meta = [f.nivel, f.periodo].filter(Boolean).join(" | ");
            prevForm.push(`
              <div style="margin-bottom: 6pt;">
                <div style="font-weight:700;">${escapeHtml(titulo || `Formação ${idx + 1}`)}</div>
                <div style="font-size:10pt; color: rgba(0,0,0,0.75);">${escapeHtml(meta)}</div>
              </div>
            `);
          });
        } else {
          prevForm.push(`<div style="color: rgba(0,0,0,0.65);">—</div>`);
        }
        $("prev-formacoes").innerHTML = prevForm.join("");

        // Habilidades
        const habilidades = splitHabilidades(state.habilidades);
        $("prev-habilidades").textContent = habilidades.length ? habilidades.join(" • ") : "—";

        // Cursos extras
        const cursos = state.cursosExtras.filter((c) => (c.nomeCurso || "").trim() || (c.instituicao || "").trim());
        if (cursos.length) {
          $("secao-prev-cursos").style.display = "";
          $("prev-cursos").innerHTML = cursos
            .map((c) => {
              const base = [c.nomeCurso, c.instituicao].filter(Boolean).join(" — ");
              const carga = c.cargaHoraria ? ` ${c.cargaHoraria}` : "";
              return `<div style="margin-bottom: 6pt;"><div style="font-weight:700;">${escapeHtml(base)}</div><div style="font-size:10pt; color: rgba(0,0,0,0.75);">${escapeHtml(carga)}</div></div>`;
            })
            .join("");
        } else {
          $("secao-prev-cursos").style.display = "none";
          $("prev-cursos").innerHTML = "";
        }
      }

      // --- SEÇÃO: atualização via delegação de eventos ---
      function atualizarPreviewDebounced() {
        clearTimeout(atualizarPreviewDebounced._t);
        atualizarPreviewDebounced._t = setTimeout(atualizarPreview, 80);
      }

      const containersDeEdicao = [listaExperiencias, listaFormacoes, listaCursosExtras, areaUI];

      containersDeEdicao.forEach((container) => {
        if (!container) return;
        container.addEventListener("input", (e) => {
          if (!e.target) return;
          // Só reagimos a inputs/textareas/selects para reduzir ruído.
          const tag = (e.target.tagName || "").toLowerCase();
          if (tag === "input" || tag === "textarea" || tag === "select") atualizarPreviewDebounced();
        });
        container.addEventListener("change", (e) => {
          if (!e.target) return;
          const tag = (e.target.tagName || "").toLowerCase();
          if (tag === "input" || tag === "textarea" || tag === "select") atualizarPreviewDebounced();
        });
      });

      // Remoções com delegação
      listaExperiencias.addEventListener("click", (e) => {
        const btn = e.target.closest('button[data-remove-experiencia="1"]');
        if (!btn) return;
        btn.closest('[data-tipo="experiencia"]').remove();
        atualizarPreview();
      });

      listaFormacoes.addEventListener("click", (e) => {
        const btn = e.target.closest('button[data-remove-formacao="1"]');
        if (!btn) return;
        btn.closest('[data-tipo="formacao"]').remove();
        atualizarPreview();
      });

      listaCursosExtras.addEventListener("click", (e) => {
        const btn = e.target.closest('button[data-remove-curso-extra="1"]');
        if (!btn) return;
        btn.closest('[data-tipo="curso-extra"]').remove();
        atualizarPreview();
      });

      // Adições
      $("btn-adicionar-experiencia").addEventListener("click", () => {
        listaExperiencias.appendChild(criarBlocoExperiencia({}));
        atualizarPreview();
      });

      $("btn-adicionar-formacao").addEventListener("click", () => {
        listaFormacoes.appendChild(criarBlocoFormacao({}));
        atualizarPreview();
      });

      $("btn-adicionar-curso-extra").addEventListener("click", () => {
        listaCursosExtras.appendChild(criarBlocoCursoExtra({}));
        atualizarPreview();
      });

      // --- SEÇÃO: rascunhos ---
      $("btn-salvar-rascunho").addEventListener("click", () => {
        const state = obterEstadoDoFormulario();
        const payload = state;
        const ok = LanHouseStorage.salvar("curriculo_rascunho", payload);
        if (ok) {
          mostrarMsg("sucesso", "Rascunho salvo. Você pode carregar depois.");
        } else {
          mostrarMsg("erro", "Falha ao salvar o rascunho no navegador.");
        }
      });

      $("btn-carregar-rascunho").addEventListener("click", () => {
        const raw = LanHouseStorage.carregar("curriculo_rascunho");
        if (!raw) {
          mostrarMsg("info", "Nenhum rascunho encontrado para este módulo.");
          return;
        }

        // Recria itens dinâmicos antes de preencher valores (contrato do prompt).
        listaExperiencias.innerHTML = "";
        listaFormacoes.innerHTML = "";
        listaCursosExtras.innerHTML = "";

        const state = raw;

        // Personal
        $("inp-nome").value = state.personal?.nomeCompleto || "";
        $("inp-profissao").value = state.personal?.profissaoCargo || "";
        $("inp-cidadeUf").value = state.personal?.cidadeUf || "";
        $("inp-telefone").value = state.personal?.telefone || "";
        $("inp-email").value = state.personal?.email || "";
        $("inp-linkedin").value = state.personal?.linkedin || "";

        // Objetivo/Habilidades
        $("inp-objetivo").value = state.objetivo || "";
        $("inp-habilidades").value = state.habilidades || "";

        // Experiências
        const exps = Array.isArray(state.experiencias) ? state.experiencias : [];
        exps.forEach((item) => listaExperiencias.appendChild(criarBlocoExperiencia(item)));

        // Formações
        const forms = Array.isArray(state.formacoes) ? state.formacoes : [];
        forms.forEach((item) => listaFormacoes.appendChild(criarBlocoFormacao(item)));

        // Cursos Extras
        const cursos = Array.isArray(state.cursosExtras) ? state.cursosExtras : [];
        cursos.forEach((item) => listaCursosExtras.appendChild(criarBlocoCursoExtra(item)));

        atualizarPreview();
        mostrarMsg("sucesso", "Rascunho carregado com sucesso.");
      });

      // --- SEÇÃO: Limpar Tudo (sem confirm/alert nativo) ---
      $("btn-limpar").addEventListener("click", () => mostrarModalConfirmarLimpeza());
      modalCancelar.addEventListener("click", () => fecharModal());
      modalConfirmar.addEventListener("click", () => {
        fecharModal();

        // Zerar campos simples
        $("inp-nome").value = "";
        $("inp-profissao").value = "";
        $("inp-cidadeUf").value = "";
        $("inp-telefone").value = "";
        $("inp-email").value = "";
        $("inp-linkedin").value = "";
        $("inp-objetivo").value = "";
        $("inp-habilidades").value = "";

        // Remover itens dinâmicos
        listaExperiencias.innerHTML = "";
        listaFormacoes.innerHTML = "";
        listaCursosExtras.innerHTML = "";

        // Remover rascunho salvo
        LanHouseStorage.remover("curriculo_rascunho");
        atualizarPreview();
        mostrarMsg("sucesso", "Tudo limpo.");
      });

      // --- SEÇÃO: Ações de preview/print ---
      $("btn-preview").addEventListener("click", () => {
        areaImpressao.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      $("btn-imprimir").addEventListener("click", () => {
        window.print();
      });
// Ajuste visual inicial (pré-preenchimento pode ser feito no futuro).
      atualizarPreview();
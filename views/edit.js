// Espera a que todo el DOM se cargue antes de ejecutar cualquier código
document.addEventListener("DOMContentLoaded", () => {
  // Obtiene el tbody de la tabla donde están listados los usuarios
  const tbody = document.getElementById("tbody");
  if (!tbody) return;

  // Eventos dentro del tbody (clics en botones Editar, Guardar, Cancelar)
  tbody.addEventListener("click", async (e) => {
    const btn = e.target; // el botón que fue clickeado

    /* -------------------- EDITAR -------------------- */
    if (btn.classList.contains("editBtn")) {
      const tr = btn.closest("tr"); // fila correspondiente
      const id = tr.dataset.id;     // id del usuario desde el dataset

      const tdNombre = tr.querySelector(".td-nombre");
      const tdCorreo = tr.querySelector(".td-correo");
      const tdActions = tr.querySelector(".td-actions");

      const nombreActual = tdNombre.innerText.trim();
      const correoActual = tdCorreo.innerText.trim();

      tdNombre.dataset.original = nombreActual;
      tdCorreo.dataset.original = correoActual;

      tdNombre.innerHTML = `<input type="text" class="browser-default" id="editName" value="${escapeHtml(nombreActual)}">`;
      tdCorreo.innerHTML = `<input type="email" class="browser-default" id="editEmail" value="${escapeHtml(correoActual)}">`;

      tdActions.innerHTML = `
        <button class="btn-small green saveBtn">Guardar</button>
        <button class="btn-small grey cancelBtn">Cancelar</button>
      `;

      const nameInput = tr.querySelector('#editName');
      if (nameInput) {
        nameInput.focus();
        nameInput.select();
      }
    }

    /* -------------------- CANCELAR -------------------- */
    if (btn.classList.contains("cancelBtn")) {
      const tr = btn.closest("tr");
      const id = tr.dataset.id;

      const tdNombre = tr.querySelector(".td-nombre");
      const tdCorreo = tr.querySelector(".td-correo");
      const tdActions = tr.querySelector(".td-actions");

      const originalName = tdNombre.dataset.original ?? tdNombre.innerText.trim();
      const originalEmail = tdCorreo.dataset.original ?? tdCorreo.innerText.trim();

      tdNombre.innerHTML = `<span class="text">${escapeHtml(originalName)}</span>`;
      tdCorreo.innerHTML = `<span class="text">${escapeHtml(originalEmail)}</span>`;

      tdNombre.dataset.original = originalName;
      tdCorreo.dataset.original = originalEmail;

      tdActions.innerHTML = `
        <button class="btn-small blue editBtn">Editar</button>
        <a href="/delete/${encodeURIComponent(id)}" class="btn-small red deleteBtn" onclick="return confirm('¿Eliminar este usuario?');">Eliminar</a>
      `;
    }

    /* -------------------- GUARDAR -------------------- */
    if (btn.classList.contains("saveBtn")) {
      const tr = btn.closest("tr");
      const id = tr.dataset.id;

      const nameInputEl = tr.querySelector("#editName");
      const emailInputEl = tr.querySelector("#editEmail");
      const newName = (nameInputEl?.value ?? "").trim();
      const newEmail = (emailInputEl?.value ?? "").trim();

      if (!newName || !newEmail) {
        window.M && M.toast 
          ? M.toast({ html: "Nombre y correo requeridos" }) 
          : alert("Nombre y correo requeridos");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Guardando...";

      try {
        const res = await fetch(`/update/${encodeURIComponent(id)}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ name: newName, email: newEmail })
        });

        const data = await safeJson(res);

        if (res.ok && data && data.ok !== false) {
          const tdNombre = tr.querySelector(".td-nombre");
          const tdCorreo = tr.querySelector(".td-correo");
          const tdActions = tr.querySelector(".td-actions");

          tdNombre.innerHTML = `<span class="text">${escapeHtml(newName)}</span>`;
          tdCorreo.innerHTML = `<span class="text">${escapeHtml(newEmail)}</span>`;

          tdNombre.dataset.original = newName;
          tdCorreo.dataset.original = newEmail;

          tdActions.innerHTML = `
            <button class="btn-small blue editBtn">Editar</button>
            <a href="/delete/${encodeURIComponent(id)}" class="btn-small red deleteBtn" onclick="return confirm('¿Eliminar este usuario?');">Eliminar</a>
          `;

          window.M && M.toast 
            ? M.toast({ html: "Usuario actualizado", classes: "green" }) 
            : null;
        } else {
          const msg = (data && data.message) ? data.message : `Error ${res.status}`;
          window.M && M.toast 
            ? M.toast({ html: "Error al guardar: " + msg, classes: "red" }) 
            : alert("Error al guardar: " + msg);
        }
      } catch (err) {
        console.error("Error al guardar:", err);
        window.M && M.toast 
          ? M.toast({ html: "Error al guardar: " + err.message, classes: "red" }) 
          : alert("Error al guardar: " + err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = "Guardar";
      }
    }

  });

  function escapeHtml(s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  async function safeJson(resp) {
    try { return await resp.json(); } catch (e) { return null; }
  }
});

document.addEventListener("DOMContentLoaded", () => {

  const tbody = document.getElementById("tbody");
  if (!tbody) return;

  tbody.addEventListener("click", async (e) => {
    const btn = e.target;

    /* -------------------- EDITAR -------------------- */
    if (btn.classList.contains("editBtn")) {

      const tr = btn.closest("tr");
      const id = tr.dataset.id;

      const tdNombre = tr.querySelector(".td-nombre");
      const tdCorreo = tr.querySelector(".td-correo");
      const tdActions = tr.querySelector(".td-actions");

      const nombre = tdNombre.innerText.trim();
      const correo = tdCorreo.innerText.trim();

      // Guardar valores originales
      tdNombre.dataset.original = nombre;
      tdCorreo.dataset.original = correo;

      // Convertir a inputs
      tdNombre.innerHTML = `<input class="browser-default" id="editName" type="text" value="${nombre}">`;
      tdCorreo.innerHTML = `<input class="browser-default" id="editEmail" type="email" value="${correo}">`;

      tdActions.innerHTML = `
        <button class="btn-small green saveBtn">Guardar</button>
        <button class="btn-small grey cancelBtn">Cancelar</button>
      `;
    }

    /* -------------------- CANCELAR -------------------- */
    if (btn.classList.contains("cancelBtn")) {

      const tr = btn.closest("tr");
      const id = tr.dataset.id;

      const tdNombre = tr.querySelector(".td-nombre");
      const tdCorreo = tr.querySelector(".td-correo");
      const tdActions = tr.querySelector(".td-actions");

      tdNombre.innerHTML = tdNombre.dataset.original;
      tdCorreo.innerHTML = tdCorreo.dataset.original;

      tdActions.innerHTML = `
        <button class="btn-small blue editBtn">Editar</button>
        <a href="/delete/${id}" class="btn-small red">Eliminar</a>
      `;
    }

    /* -------------------- GUARDAR -------------------- */
    if (btn.classList.contains("saveBtn")) {

      const tr = btn.closest("tr");
      const id = tr.dataset.id;

      const newName = tr.querySelector("#editName").value.trim();
      const newEmail = tr.querySelector("#editEmail").value.trim();

      if (!newName || !newEmail) {
        M.toast({ html: "Nombre y correo requeridos", classes: "red" });
        return;
      }

      // Enviar actualización
      const res = await fetch(`/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail })
      });

      if (res.ok) {

        tr.querySelector(".td-nombre").innerHTML = newName;
        tr.querySelector(".td-correo").innerHTML = newEmail;

        tr.querySelector(".td-actions").innerHTML = `
          <button class="btn-small blue editBtn">Editar</button>
          <a href="/delete/${id}" class="btn-small red">Eliminar</a>
        `;

        M.toast({ html: "Actualizado", classes: "green" });

      } else {
        M.toast({ html: "Error al actualizar", classes: "red" });
      }
    }

  });

});

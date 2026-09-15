document.addEventListener("DOMContentLoaded", () => {
    const tipoUsuario = localStorage.getItem("tipo");
    const correoAdminActual = localStorage.getItem("correo");

    if (tipoUsuario !== "admin") {
        window.location.href = "../login_registro.html";
        return;
    }

    const tbody = document.getElementById("tablaUsuarios");
    const modalEditar = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
    const formEditar = document.getElementById("formEditarUsuario");

    function renderizarTabla() {
        const bd = JSON.parse(localStorage.getItem("BD_USUARIOS")) || {};
        tbody.innerHTML = "";

        for (const correo in bd) {
            const user = bd[correo];

            // Colores por rol
            let rolBadge = "bg-secondary";
            if (user.tipo === "admin") rolBadge = "bg-danger";
            else if (user.tipo === "vendedor") rolBadge = "bg-info text-dark";
            else if (user.tipo === "inventario") rolBadge = "bg-dark";
            else if (user.tipo === "compras") rolBadge = "bg-primary";
            else rolBadge = "bg-success"; // Cliente normal

            // Evitar que el admin se borre a sí mismo xd
            const btnBorrar = correo === correoAdminActual
                ? `<button class="btn btn-sm btn-outline-secondary" disabled title="No puedes borrarte a ti mismo"><i class="fa-solid fa-trash"></i></button>`
                : `<button class="btn btn-sm btn-outline-danger" onclick="borrarUsuario('${correo}')"><i class="fa-solid fa-trash"></i></button>`;

            const fila = `
                <tr>
                    <td class="ps-4 fw-bold text-muted">#${user.id}</td>
                    <td class="fw-medium">${user.nombres} ${user.apellidos}</td>
                    <td>${correo}</td>
                    <td class="text-center"><span class="badge ${rolBadge}">${user.tipo.toUpperCase()}</span></td>
                    <td class="text-center pe-4">
                        <button class="btn btn-sm btn-outline-dark me-1" onclick="abrirModal('${correo}')"><i class="fa-solid fa-pen"></i></button>
                        ${btnBorrar}
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        }
    }

    renderizarTabla();

    // Eliminar Usuario
    window.borrarUsuario = function (correo) {
        if (confirm(`¿Estás seguro de eliminar permanentemente al usuario ${correo}?`)) {
            let bd = JSON.parse(localStorage.getItem("BD_USUARIOS"));
            delete bd[correo];
            localStorage.setItem("BD_USUARIOS", JSON.stringify(bd));
            renderizarTabla();
        }
    };

    // Abrir Modal con datos
    window.abrirModal = function (correo) {
        const bd = JSON.parse(localStorage.getItem("BD_USUARIOS"));
        const user = bd[correo];

        document.getElementById("editCorreoOriginal").value = correo;
        document.getElementById("editCorreo").value = correo;
        document.getElementById("editNombres").value = user.nombres;
        document.getElementById("editApellidos").value = user.apellidos;
        document.getElementById("editRol").value = user.tipo;
        document.getElementById("editDireccion").value = user.direccion || "";

        modalEditar.show();
    };

    // Guardar Cambios Editados
    formEditar.addEventListener("submit", (e) => {
        e.preventDefault();

        let bd = JSON.parse(localStorage.getItem("BD_USUARIOS"));
        const correoOriginal = document.getElementById("editCorreoOriginal").value;
        const nuevoCorreo = document.getElementById("editCorreo").value.trim();

        // Extraer los datos del usuario actual
        let datosUsuario = bd[correoOriginal];

        datosUsuario.nombres = document.getElementById("editNombres").value.trim();
        datosUsuario.apellidos = document.getElementById("editApellidos").value.trim();
        datosUsuario.tipo = document.getElementById("editRol").value;
        datosUsuario.direccion = document.getElementById("editDireccion").value.trim();

        // Si cambió el correo, creamos la nueva llave y borramos la vieja
        if (correoOriginal !== nuevoCorreo) {
            if (bd[nuevoCorreo]) {
                alert("Error: El nuevo correo ya está en uso por otro usuario.");
                return;
            }
            bd[nuevoCorreo] = datosUsuario;
            delete bd[correoOriginal];
        } else {
            bd[correoOriginal] = datosUsuario;
        }

        localStorage.setItem("BD_USUARIOS", JSON.stringify(bd));
        modalEditar.hide();
        renderizarTabla();
    });
});
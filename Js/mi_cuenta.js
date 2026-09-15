document.addEventListener("DOMContentLoaded", () => {
    const estaIniciado = localStorage.getItem("iniciado") === "true";

    if (!estaIniciado) {
        window.location.href = "login_registro.html";
        return;
    }

    // Rescatar los datos del almacenamiento local
    const idUsuario = localStorage.getItem("idUsuario") || "---";
    let nombres = localStorage.getItem("nombres");
    let apellidos = localStorage.getItem("apellidos");
    const correo = localStorage.getItem("correo") || "Usuario Desconocido";
    const tipo = localStorage.getItem("tipo") || "usuario";

    if (!nombres || nombres === "undefined") nombres = "Nombre Desconocido";
    if (!apellidos || apellidos === "undefined") apellidos = "Apellidos Desconocidos";

    // Inyectar datos en pantalla con validación de existencia de elementos
    const elId = document.getElementById("lblIdUsuario");
    const elNombres = document.getElementById("lblNombres");
    const elApellidos = document.getElementById("lblApellidos");
    const elCorreo = document.getElementById("lblCorreo");
    const elTipo = document.getElementById("lblTipo");

    if (elId) elId.textContent = "#" + idUsuario;
    if (elNombres) elNombres.textContent = nombres;
    if (elApellidos) elApellidos.textContent = apellidos;
    if (elCorreo) elCorreo.textContent = correo;

    if (elTipo) {
        const rolVisual = tipo === "usuario" ? "CLIENTE" : tipo.toUpperCase();
        elTipo.textContent = rolVisual;
    }

    // Revelar el panel correspondiente al rol
    if (tipo === "admin") {
        document.getElementById("panelAdmin")?.classList.remove("d-none");
    } else if (tipo === "vendedor") {
        document.getElementById("panelVendedor")?.classList.remove("d-none");
    } else if (tipo === "inventario") {
        document.getElementById("panelInventario")?.classList.remove("d-none");
    } else if (tipo === "compras") {
        document.getElementById("panelCompras")?.classList.remove("d-none");
    } else {
        document.getElementById("panelComprador")?.classList.remove("d-none");
    }

    // Cerrar Sesion
    const btnCerrar = document.getElementById("btnCerrarSesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "index.html";
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const estaIniciado = localStorage.getItem("iniciado") === "true";
    const tipoUsuario = localStorage.getItem("tipo");

    if (!estaIniciado || (tipoUsuario !== "vendedor" && tipoUsuario !== "admin" && tipoUsuario !== "inventario" && tipoUsuario !== "compras")) {
        window.location.href = "../login_registro.html";
        return;
    }

    // Traer el inventario directamente desde stock.js
    const inventarioBase = obtenerInventarioCompleto();

    const tbody = document.getElementById("tablaStock");
    const buscador = document.getElementById("buscadorStock");

    // Renderizar la tabla
    function renderizarTabla(filtro = "") {
        tbody.innerHTML = "";
        const terminoBusqueda = filtro.toLowerCase().trim();

        // Filtrar productos
        const productosFiltrados = inventarioBase.filter(item =>
            item.titulo.toLowerCase().includes(terminoBusqueda)
        );

        if (productosFiltrados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center py-5 text-muted">
                        <i class="fa-solid fa-magnifying-glass-minus fs-2 mb-3"></i>
                        <br>No se encontraron productos con ese nombre.
                    </td>
                </tr>
            `;
            return;
        }

        // Crear filas
        productosFiltrados.forEach(item => {
            let badgeHtml = "";

            // Indicadores de stock
            if (item.stock <= 5) {
                badgeHtml = `<span class="badge bg-danger w-75 py-2">Crítico</span>`;
            } else if (item.stock <= 10) {
                badgeHtml = `<span class="badge bg-warning text-dark w-75 py-2">Bajo</span>`;
            } else {
                badgeHtml = `<span class="badge bg-success w-75 py-2">Óptimo</span>`;
            }

            const fila = `
                <tr>
                    <td class="ps-4 fw-semibold text-dark">${item.titulo}</td>
                    <td class="text-center">${item.stock} <span class="text-muted small">unidades</span></td>
                    <td class="text-center">${badgeHtml}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
    }

    // Renderizar todos los productos al cargar la página por primera vez
    renderizarTabla();

    // 4. bbarra de búsqueda en tiempo real
    buscador.addEventListener("input", (e) => {
        renderizarTabla(e.target.value);
    });
});
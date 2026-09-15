document.addEventListener("DOMContentLoaded", () => {
    // 1. Verificación de seguridad (Solo Inventario o Administrador)
    const estaIniciado = localStorage.getItem("iniciado") === "true";
    const tipoUsuario = localStorage.getItem("tipo");

    if (!estaIniciado || (tipoUsuario !== "inventario" && tipoUsuario !== "admin")) {
        window.location.href = "../login_registro.html";
        return;
    }

    const tbody = document.getElementById("tablaStock");
    const buscador = document.getElementById("buscadorStock");
    const alerta = document.getElementById("alertaInventario");

    // Función para renderizar la tabla
    function renderizarTabla(filtro = "") {
        // Obtenemos el inventario más reciente en cada recarga
        let inventarioBase = obtenerInventarioCompleto();
        tbody.innerHTML = "";
        const terminoBusqueda = filtro.toLowerCase().trim();

        const productosFiltrados = inventarioBase.filter(item =>
            item.titulo.toLowerCase().includes(terminoBusqueda)
        );

        if (productosFiltrados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-5 text-muted">
                        <i class="fa-solid fa-magnifying-glass-minus fs-2 mb-3"></i>
                        <br>No se encontraron productos con ese nombre.
                    </td>
                </tr>
            `;
            return;
        }

        productosFiltrados.forEach((item) => {
            // Biuscar su indice original en la BD global
            let indiceReal = inventarioBase.findIndex(p => p.titulo === item.titulo);

            let badgeHtml = "";
            if (item.stock <= 5) {
                badgeHtml = `<span class="badge bg-danger w-100 py-2">Crítico</span>`;
            } else if (item.stock <= 10) {
                badgeHtml = `<span class="badge bg-warning text-dark w-100 py-2">Bajo</span>`;
            } else {
                badgeHtml = `<span class="badge bg-success w-100 py-2">Óptimo</span>`;
            }

            const fila = `
                <tr>
                    <td class="ps-4 fw-semibold text-dark">${item.titulo}</td>
                    <td class="text-center fw-bold fs-5 text-secondary" id="stockTexto_${indiceReal}">${item.stock}</td>
                    <td class="text-center">
                        <div class="input-group input-group-sm justify-content-center mx-auto" style="max-width: 160px;">
                            <button class="btn btn-outline-secondary px-2" onclick="ajustarInput(${indiceReal}, -1)"><i class="fa-solid fa-minus"></i></button>
                            <input type="number" id="inputStock_${indiceReal}" class="form-control text-center" value="${item.stock}" min="0">
                            <button class="btn btn-outline-secondary px-2" onclick="ajustarInput(${indiceReal}, 1)"><i class="fa-solid fa-plus"></i></button>
                            <button class="btn btn-primary px-3" onclick="guardarStock(${indiceReal})" id="btnGuardar_${indiceReal}"><i class="fa-solid fa-floppy-disk"></i></button>
                        </div>
                    </td>
                    <td class="text-center pe-4">${badgeHtml}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
    }

    renderizarTabla();

    // 3. Barra de búsqueda enm si
    buscador.addEventListener("input", (e) => {
        renderizarTabla(e.target.value);
    });

    // 4. Botones + y -
    window.ajustarInput = function (indice, cantidad) {
        const input = document.getElementById(`inputStock_${indice}`);
        let valorActual = parseInt(input.value) || 0;
        let nuevoValor = valorActual + cantidad;

        if (nuevoValor < 0) nuevoValor = 0; // Evitar stock negativo
        input.value = nuevoValor;
    };

    // Guardar el nuevo stock en la BD local
    window.guardarStock = function (indice) {
        const input = document.getElementById(`inputStock_${indice}`);
        const btnGuardar = document.getElementById(`btnGuardar_${indice}`);
        let nuevoStock = parseInt(input.value);

        if (isNaN(nuevoStock) || nuevoStock < 0) {
            alert("Por favor ingresa un número válido mayor o igual a 0.");
            return;
        }

        // Recuperar y actualizar
        let inventarioActual = obtenerInventarioCompleto();
        let tituloActualizado = inventarioActual[indice].titulo;
        inventarioActual[indice].stock = nuevoStock;

        // Guardar la tabla completa en el navegador
        localStorage.setItem("BD_INVENTARIO", JSON.stringify(inventarioActual));

        // Guardado en el botón
        const iconoOriginal = btnGuardar.innerHTML;
        btnGuardar.innerHTML = `<i class="fa-solid fa-check"></i>`;
        btnGuardar.classList.replace('btn-primary', 'btn-success');

        // Mostrar alert
        alerta.innerHTML = `<i class="fa-solid fa-circle-check me-2"></i>Stock de "<strong>${tituloActualizado}</strong>" actualizado correctamente a ${nuevoStock} unidades.`;
        alerta.className = "alert alert-success d-block text-center fw-medium shadow-sm mb-4";

        setTimeout(() => {
            // Refrescar tabla con un mini delay
            renderizarTabla(buscador.value);
            alerta.classList.replace('d-block', 'd-none');
        }, 1500);
    };
});
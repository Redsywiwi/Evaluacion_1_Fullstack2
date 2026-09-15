document.addEventListener("DOMContentLoaded", () => {
    const tipoUsuario = localStorage.getItem("tipo");
    if (tipoUsuario !== "compras" && tipoUsuario !== "admin") {
        window.location.href = "../login_registro.html";
        return;
    }

    const contenedor = document.getElementById("contenedorSeguimiento");
    const alerta = document.getElementById("alertaCompras");

    // Revisar si venimos de crear un pedido exitoso
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('exito')) {
        alerta.innerHTML = `<i class="fa-solid fa-circle-check me-2"></i>Orden de compra emitida correctamente al proveedor.`;
        alerta.className = "alert alert-success d-block shadow-sm fw-medium text-center mb-4";
        setTimeout(() => alerta.classList.replace('d-block', 'd-none'), 3000);

        window.history.replaceState({}, document.title, "seguimiento_proveedores.html");
    }

    // Base de datos por defecto actualizada
    const pedidosPorDefecto = [
        {
            idOrden: "PRV-8492",
            proveedor: "Distribuidora del Libro",
            producto: "1984",
            cantidad: 15,
            fechaEmision: "10/09/2026",
            estado: "En tránsito"
        },
        {
            idOrden: "PRV-7104",
            proveedor: "Textos Académicos SA",
            producto: "Fundamentos de Programación",
            cantidad: 20,
            fechaEmision: "12/09/2026",
            estado: "En preparación"
        }
    ];

    function obtenerPedidos() {
        let bd = localStorage.getItem("BD_PEDIDOS_PROVEEDOR");
        if (!bd) {
            localStorage.setItem("BD_PEDIDOS_PROVEEDOR", JSON.stringify(pedidosPorDefecto));
            return pedidosPorDefecto;
        }
        return JSON.parse(bd);
    }

    function renderizarSeguimiento() {
        const pedidos = obtenerPedidos();
        contenedor.innerHTML = "";

        if (pedidos.length === 0) {
            contenedor.innerHTML = `<div class="col-12 text-center py-5 text-muted">No hay órdenes de compra registradas.</div>`;
            return;
        }

        pedidos.forEach((pedido, index) => {
            let configEstado = {};

            switch (pedido.estado) {
                case "En preparación":
                    configEstado = { color: "bg-warning text-dark", icono: "fa-box", progreso: "25%", colorProgreso: "bg-warning", botonTxt: "Marcar como 'En tránsito'", accion: "En tránsito" };
                    break;
                case "En tránsito":
                    configEstado = { color: "bg-primary", icono: "fa-truck-fast", progreso: "70%", colorProgreso: "bg-primary", botonTxt: "Marcar como 'Recibido'", accion: "Recibido" };
                    break;
                case "Recibido":
                    configEstado = { color: "bg-success", icono: "fa-check-double", progreso: "100%", colorProgreso: "bg-success", botonTxt: "", accion: "" };
                    break;
            }

            const botonHtml = pedido.estado !== "Recibido"
                ? `<button class="btn btn-sm btn-outline-dark mt-3 w-100" onclick="avanzarEstado(${index}, '${configEstado.accion}')">
                    <i class="fa-solid fa-arrow-right-arrow-left me-1"></i>${configEstado.botonTxt}</button>`
                : `<div class="alert alert-success m-0 mt-3 p-2 text-center small fw-bold"><i class="fa-solid fa-lock me-1"></i>Ingresado al stock global</div>`;

            const tarjeta = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card shadow-sm border-0 h-100">
                        <div class="card-header bg-white border-bottom pb-2 pt-3 d-flex justify-content-between align-items-center">
                            <span class="text-muted fw-bold small">${pedido.idOrden}</span>
                            <span class="badge ${configEstado.color}"><i class="fa-solid ${configEstado.icono} me-1"></i>${pedido.estado}</span>
                        </div>
                        <div class="card-body">
                            <h6 class="fw-bold text-primary mb-1">${pedido.proveedor}</h6>
                            <p class="mb-1 text-dark fw-medium">${pedido.producto}</p>
                            <p class="small text-muted mb-3">Cantidad solicitada: <strong>${pedido.cantidad} unid.</strong></p>
                            
                            <div class="progress mb-2" style="height: 8px;">
                                <div class="progress-bar ${configEstado.colorProgreso} progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${configEstado.progreso}"></div>
                            </div>
                            <div class="d-flex justify-content-between text-muted" style="font-size: 0.70rem;">
                                <span>Emisión: ${pedido.fechaEmision}</span>
                                <span>Destino: Bodega Central</span>
                            </div>

                            ${botonHtml}
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += tarjeta;
        });
    }

    renderizarSeguimiento();

    window.avanzarEstado = function (index, nuevoEstado) {
        let pedidos = obtenerPedidos();
        const pedidoActual = pedidos[index];

        pedidoActual.estado = nuevoEstado;

        // EJECUTA LA FUNCIÓN GLOBAL DE STOCK
        if (nuevoEstado === "Recibido") {
            if (window.aumentarStock) {
                window.aumentarStock(pedidoActual.producto, pedidoActual.cantidad);
            }

            alerta.innerHTML = `<i class="fa-solid fa-boxes-packing me-2"></i>Se han sumado <strong>${pedidoActual.cantidad}</strong> unidades de "${pedidoActual.producto}" al stock global. Puedes verificarlo en el botón superior.`;
            alerta.className = "alert alert-success d-block shadow-sm fw-medium text-center mb-4";
            setTimeout(() => alerta.classList.replace('d-block', 'd-none'), 5000);
        }

        pedidos[index] = pedidoActual;
        localStorage.setItem("BD_PEDIDOS_PROVEEDOR", JSON.stringify(pedidos));

        renderizarSeguimiento();
    };
});
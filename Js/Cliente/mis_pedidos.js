document.addEventListener("DOMContentLoaded", () => {
    // seguridad
    const estaIniciado = localStorage.getItem("iniciado") === "true";
    if (!estaIniciado) {
        window.location.href = "../login_registro.html";
        return;
    }

    // Rescatar el ID del usuario logueado
    const idUsuarioActual = localStorage.getItem("idUsuario");

    // Historial base por defecto para el ID 1
    const todosLosPedidosBase = {
        "1": [
            {
                id: "ORD-9824",
                fecha: "14/09/2026",
                estado: "Solicitado",
                items: [
                    { nombre: "Nepal - Panda Rojo", cantidad: 1 },
                    { nombre: "Abejas - Una guía para curiosos", cantidad: 1 }
                ],
                detalle: "Buscando disponibilidad con editoriales. Fecha estimada para retiro: 25/09/2026."
            },
            {
                id: "ORD-9755",
                fecha: "13/09/2026",
                estado: "En pedido",
                items: [
                    { nombre: "Catan: El juego", cantidad: 1 },
                ],
                detalle: "El libro y juego han sido solicitados al proveedor. Llegada estimada a sucursal: 18/09/2026."
            },
            {
                id: "ORD-9612",
                fecha: "10/09/2026",
                estado: "Entregado",
                items: [
                    { nombre: "1984", cantidad: 1 },
                    { nombre: "Root: El juego de rol", cantidad: 1 }
                ],
                detalle: "El pedido ha sido entregado al cliente el día 12/09/2026. Ver resumen en el correo."
            },
            {
                id: "ORD-9108",
                fecha: "01/09/2026",
                estado: "Cancelado",
                items: [
                    { nombre: "El Principito", cantidad: 1 },
                ],
                detalle: "Motivo: El pedido fue cancelado por el cliente antes del envío."
            }
        ]
    };

    // Combinar con los pedidos nuevos generados mediante la pasarela de pago
    let pedidosDinamicos = JSON.parse(localStorage.getItem('pedidosPersonalizados')) || {};

    let historialPedidos = [];
    if (pedidosDinamicos[idUsuarioActual]) {
        historialPedidos = pedidosDinamicos[idUsuarioActual].concat(todosLosPedidosBase[idUsuarioActual] || []);
    } else {
        historialPedidos = todosLosPedidosBase[idUsuarioActual] || [];
    }

    // 3. Renderizar los pedidos en el HTML
    const contenedor = document.getElementById("contenedorPedidos");
    let html = "";

    if (historialPedidos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-box-open text-muted mb-3" style="font-size: 3rem;"></i>
                <h5 class="text-muted fw-bold">No tienes pedidos recientes</h5>
                <p class="text-secondary">Tus próximas compras y reservas aparecerán aquí.</p>
                <a href="../productos.html" class="btn btn-outline-primary mt-2">Ir a la tienda</a>
            </div>
        `;
        return;
    }

    historialPedidos.forEach(pedido => {
        let colorBadge = "bg-secondary";
        let iconoEstado = "fa-circle-info";

        switch (pedido.estado) {
            case "Entregado":
                colorBadge = "bg-success";
                iconoEstado = "fa-check-circle";
                break;
            case "En pedido":
                colorBadge = "bg-primary";
                iconoEstado = "fa-truck-fast";
                break;
            case "Solicitado":
                colorBadge = "bg-warning text-dark";
                iconoEstado = "fa-clock";
                break;
            case "Cancelado":
                colorBadge = "bg-danger";
                iconoEstado = "fa-times-circle";
                break;
        }

        const listaItems = pedido.items.map(item => `<li>${item.nombre} <span class="text-muted fw-bold">x${item.cantidad}</span></li>`).join("");

        html += `
            <div class="col-12 mb-4">
                <div class="card shadow-sm border-0 border-start border-4 ${colorBadge.replace('text-dark', '').replace('bg-', 'border-')}">
                    <div class="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0 text-muted">Pedido #${pedido.id}</h6>
                        <span class="badge ${colorBadge} px-3 py-2"><i class="fa-solid ${iconoEstado} me-1"></i> ${pedido.estado}</span>
                    </div>
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-5 mb-3 mb-md-0">
                                <p class="small text-muted mb-1"><i class="fa-regular fa-calendar me-1"></i> Fecha de solicitud: ${pedido.fecha}</p>
                                <ul class="mb-0 ps-3">
                                    ${listaItems}
                                </ul>
                            </div>
                            <div class="col-md-7 border-start-md ps-md-4">
                                <p class="mb-0 text-secondary fw-medium"><i class="fa-solid fa-comment-dots me-2 text-muted"></i>${pedido.detalle}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
});
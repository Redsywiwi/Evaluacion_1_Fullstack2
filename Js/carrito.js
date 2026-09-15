document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();

    // ÚNICO evento para el botón Pagar
    const btnPagar = document.getElementById('btnPagar');
    if (btnPagar) {
        btnPagar.addEventListener('click', () => {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

            if (carrito.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }

            const estaIniciado = localStorage.getItem("iniciado") === "true";

            if (!estaIniciado) {
                alert('Debes iniciar sesión o registrarte para proceder al pago.');
                window.location.href = "login_registro.html";
            } else {
                // Redirigir correctamente a la vista de pago
                window.location.href = "pago.html";
            }
        });
    }
});

function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedor = document.getElementById('contenedorCarrito');

    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-5">
                <i class="fa-solid fa-basket-shopping text-muted mb-3" style="font-size: 3rem;"></i>
                <h5 class="text-muted">Tu carrito está vacío</h5>
                <a href="index.html" class="btn btn-outline-primary mt-3">Volver a la tienda</a>
            </div>
        `;
        document.getElementById('resumenSubtotal').textContent = '$0';
        document.getElementById('resumenTotal').textContent = '$0';
        return;
    }

    let html = '';
    let totalAcumulado = 0;

    carrito.forEach((item, index) => {
        // Limpiamos de forma segura el texto del precio (reemplazando $, todos los puntos y comas)
        let precioLimpio = parseInt(item.precio.toString().replace('$', '').replace(/\./g, '').replace(',', '')) || 0;
        let subtotalItem = precioLimpio * item.cantidad;
        totalAcumulado += subtotalItem;

        html += `
            <div class="row align-items-center mb-3 pb-3 border-bottom">
                <div class="col-3 col-sm-2 text-center">
                    <img src="${item.img}" class="img-fluid rounded shadow-sm" style="max-height: 80px; object-fit: contain;">
                </div>
                <div class="col-5 col-sm-6">
                    <h6 class="fw-bold mb-1">${item.titulo}</h6>
                    <small class="text-muted d-block mb-2">${item.precio} c/u</small>
                </div>
                <div class="col-2 text-center fw-semibold">
                    x${item.cantidad}
                </div>
                <div class="col-2 text-end">
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="eliminarDelCarrito(${index})" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;

    // Formatear el total devuelto a formato de moneda chileno
    const totalTexto = `$${totalAcumulado.toLocaleString('es-CL')}`;
    document.getElementById('resumenSubtotal').textContent = totalTexto;
    document.getElementById('resumenTotal').textContent = totalTexto;
}

// Función para eliminar ítems
window.eliminarDelCarrito = function (index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));

    renderizarCarrito();

    if (window.actualizarBadgeCarrito) {
        window.actualizarBadgeCarrito();
    }
};
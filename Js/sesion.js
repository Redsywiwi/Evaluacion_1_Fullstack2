// Función global para actualizar el contador del carrito en todas las páginas
window.actualizarBadgeCarrito = function () {
    const iconosCarrito = document.querySelectorAll('a i.fa-cart-shopping');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Sumar todas las cantidades
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    iconosCarrito.forEach(icon => {
        const link = icon.parentElement;

        // Redirigir el enlace del icono hacia la página del carrito
        link.href = 'carrito.html';

        // Buscar o crear el badge
        let badge = link.querySelector('.badge-carrito');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = "badge-carrito position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger";
            badge.style.fontSize = "0.65rem";
            link.appendChild(badge);
        }

        // Mostrar u ocultar segun haya productos
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.remove('d-none');
        } else {
            badge.classList.add('d-none');
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Botón de Sesión
    const estaIniciado = localStorage.getItem("iniciado") === "true";
    const btnAuth = document.getElementById("btnAuth");

    if (estaIniciado && btnAuth) {
        btnAuth.textContent = "Mi Cuenta";
        btnAuth.href = "mi_cuenta.html";
        btnAuth.classList.remove("btn-outline-primary");
        btnAuth.classList.add("btn-primary");
    }

    // 2. Actualizar la burbuja del carrito
    window.actualizarBadgeCarrito();
});
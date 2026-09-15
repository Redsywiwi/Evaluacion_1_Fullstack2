document.addEventListener('DOMContentLoaded', () => {
    const dataStr = localStorage.getItem('productoSeleccionado');

    if (dataStr) {
        const data = JSON.parse(dataStr);

        // Inyección de datos
        document.getElementById('productoTitulo').textContent = data.titulo;
        document.getElementById('productoPrecio').textContent = data.precio;
        document.getElementById('breadcrumbTitulo').textContent = data.titulo;
        document.getElementById('breadcrumbCategoria').textContent = data.categoria || 'Productos';
        document.getElementById('imgPrincipal').src = data.img;
        document.getElementById('thumb1').src = data.img;

        // Validar Stock
        const stockActual = obtenerStock(data.titulo);
        const stockElemento = document.getElementById('productoStock');
        const btnCarrito = document.querySelector('button.btn-primary'); // Botón de añadir

        if (stockActual === null) {
            stockElemento.className = "text-danger small fw-bold mb-3";
            stockElemento.innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Error al obtener stock`;
            if (btnCarrito) {
                btnCarrito.disabled = true;
                btnCarrito.textContent = "No disponible";
            }
        } else {
            stockElemento.className = "text-success small fw-bold mb-3";
            stockElemento.innerHTML = `<i class="fa-solid fa-box me-1"></i> Stock disponible: ${stockActual} unidades`;

            if (stockActual <= 10) {
                stockElemento.classList.remove('text-success');
                stockElemento.classList.add('text-danger');
                stockElemento.innerHTML += ` <span class="badge bg-danger ms-2">¡Últimas unidades!</span>`;
            }

            // --- AÑADIR AL CARRITO ---
            if (btnCarrito) {
                // Eliminar el alert por defecto que estaba en tu HTML
                btnCarrito.removeAttribute('onclick');

                btnCarrito.addEventListener('click', () => {
                    const cantInput = parseInt(document.getElementById('cantidad').value) || 1;

                    // Obtener carrito actual
                    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

                    // Verificar si ya hay unidades de este libro en el carrito
                    const index = carrito.findIndex(item => item.titulo === data.titulo);
                    const cantEnCarrito = index !== -1 ? carrito[index].cantidad : 0;

                    // Validar si la cantidad solicitada + la que ya tiene en el carrito supera el stock
                    if ((cantInput + cantEnCarrito) > stockActual) {
                        alert(`❌ Error: No puedes añadir ${cantInput} unidades. El stock máximo es ${stockActual} y ya tienes ${cantEnCarrito} en tu carrito.`);
                        return;
                    }

                    // Guardar o actualizar en el carrito
                    if (index !== -1) {
                        carrito[index].cantidad += cantInput;
                    } else {
                        carrito.push({
                            titulo: data.titulo,
                            precio: data.precio,
                            img: data.img,
                            cantidad: cantInput
                        });
                    }

                    localStorage.setItem('carrito', JSON.stringify(carrito));

                    // Actualizar burbuja
                    if (window.actualizarBadgeCarrito) window.actualizarBadgeCarrito();

                    // Cambiar estilo del botón temporalmente
                    const textoOriginal = btnCarrito.innerHTML;
                    btnCarrito.innerHTML = `<i class="fa-solid fa-check me-2"></i>¡Añadido!`;
                    btnCarrito.classList.replace('btn-primary', 'btn-success');

                    setTimeout(() => {
                        btnCarrito.innerHTML = textoOriginal;
                        btnCarrito.classList.replace('btn-success', 'btn-primary');
                    }, 2000);
                });
            }
        }
    } else {
        window.location.href = "index.html";
    }
});

function cambiarImagen(src) {
    document.getElementById('imgPrincipal').src = src;
}
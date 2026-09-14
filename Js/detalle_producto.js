function cambiarImagen(src) {
    document.getElementById('imgPrincipal').src = src;
}

window.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('productoSeleccionado'));
    if (data) {
        document.getElementById('productoTitulo').textContent = data.titulo;
        document.getElementById('productoPrecio').textContent = data.precio;
        document.getElementById('breadcrumbTitulo').textContent = data.titulo;
        document.getElementById('breadcrumbCategoria').textContent = data.categoria || 'Productos';

        document.getElementById('imgPrincipal').src = data.img;
        document.getElementById('thumb1').src = data.img;
        document.getElementById('thumb2').src = data.img;
        document.getElementById('thumb3').src = data.img;
    }
});
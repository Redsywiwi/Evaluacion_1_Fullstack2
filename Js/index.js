document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card').forEach(card => {
        const img = card.querySelector('.card-img-top');
        const btn = card.querySelector('button');

        const redirigir = (e) => {
            e.preventDefault();
            const titulo = card.querySelector('.card-title')?.childNodes[0]?.textContent?.trim() || 'Producto';
            const precio = card.querySelector('.text-primary')?.textContent?.trim() || '$0';
            const categoria = card.querySelector('.text-muted.small')?.textContent?.trim() || 'General';
            const imgSrc = img?.getAttribute('src') || '';

            const producto = { titulo, precio, categoria, img: imgSrc };
            localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
            window.location.href = 'detalle_producto.html';
        };

        if (img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', redirigir);
        }
        if (btn) {
            btn.addEventListener('click', redirigir);
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        const estaIniciado = localStorage.getItem("iniciado") === "true";
        const btnAuth = document.getElementById("btnAuth");

        if (estaIniciado && btnAuth) {
            btnAuth.textContent = "Mi Cuenta";
            btnAuth.href = "mi_cuenta.html";
            btnAuth.className = "btn btn-primary btn-sm"; 
        }
    });
});
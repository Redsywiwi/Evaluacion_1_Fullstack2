document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.blog-card').forEach(card => {
        const triggers = card.querySelectorAll('.noticia-trigger');

        const abrirNoticia = (e) => {
            e.preventDefault();

            const titulo = card.querySelector('h2').textContent.trim();
            const imagenSrc = card.querySelector('img').getAttribute('src');
            const categoriaBadge = card.querySelector('.badge');
            const fecha = card.querySelector('.text-muted.small').textContent.trim();
            const contenidoHTML = card.querySelector('.contenido-completo').innerHTML;


            const noticia = {
                titulo: titulo,
                imagen: imagenSrc,
                categoriaTxt: categoriaBadge.textContent,
                categoriaClase: categoriaBadge.className,
                fecha: fecha.replace('Publicado en ', '').trim(), // Limpiar fecha por si acaso
                contenido: contenidoHTML
            };

            localStorage.setItem('noticiaSeleccionada', JSON.stringify(noticia));
            window.location.href = 'detalle_noticia.html';
        };


        triggers.forEach(el => el.addEventListener('click', abrirNoticia));
    });
});
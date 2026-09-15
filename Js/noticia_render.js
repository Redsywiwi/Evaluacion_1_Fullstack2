document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar la noticia desde el LocalStorage
    const dataStr = localStorage.getItem('noticiaSeleccionada');

    if (dataStr) {
        const data = JSON.parse(dataStr);

        // Inyectar datos en el HTML
        document.getElementById('noticiaTitulo').textContent = data.titulo;
        document.getElementById('breadcrumbTitulo').textContent = data.titulo;
        document.getElementById('noticiaImagen').src = data.imagen;
        document.getElementById('noticiaFecha').innerHTML = `<i class="fa-regular fa-calendar me-1"></i> ${data.fecha}`;
        document.getElementById('noticiaCuerpo').innerHTML = data.contenido;

        const badge = document.getElementById('noticiaCategoria');
        badge.textContent = data.categoriaTxt;
        badge.className = data.categoriaClase;
    } else {
        window.location.href = "blog.html";
        return;
    }

    // 2. Comprobar sesión
    const estaIniciado = localStorage.getItem("iniciado") === "true";

    // Si no hay sesión, interrumpe y manda al login
    const requerirLogin = (e) => {
        if (!estaIniciado) {
            e.preventDefault();
            window.location.href = "login_registro.html";
        }
    };

    // 3. Rating
    let calificacionActual = 0; // Guardará cuántas estrellas seleccionó el usuario
    const estrellas = document.querySelectorAll('#starRating i');

    estrellas.forEach(star => {
        star.addEventListener('click', (e) => {
            requerirLogin(e);

            if (estaIniciado) {
                calificacionActual = parseInt(e.target.getAttribute('data-rating'));

                // Reiniciar estrellas a contorno (vacías)
                estrellas.forEach(s => {
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular');
                });

                // Pintar estrellas hasta la clickeada
                for (let i = 0; i < calificacionActual; i++) {
                    estrellas[i].classList.remove('fa-regular');
                    estrellas[i].classList.add('fa-solid');
                }
            }
        });
    });

    // 4. Comentarios
    const txtComentario = document.getElementById('txtComentario');
    const formComentario = document.getElementById('formComentario');

    // Al intentar escribir pide login
    txtComentario.addEventListener('focus', requerirLogin);

    // Al enviar el comentario
    formComentario.addEventListener('submit', (e) => {
        e.preventDefault();
        requerirLogin(e);

        if (estaIniciado) {
            const texto = txtComentario.value.trim();

            if (texto) {
                // Obtener nombres y apellidos del LocalStorage
                const nombres = localStorage.getItem('nombres') || "";
                const apellidos = localStorage.getItem('apellidos') || "";
                let autor = `${nombres} ${apellidos}`.trim();

                // Si por algún motivo están vacíos, ponemos un predeterminado
                if (!autor) autor = "Usuario Registrado";

                // Crear el código HTML de las estrellas seleccionadas para mostrarlas
                let estrellasComentario = "";
                for (let i = 1; i <= 5; i++) {
                    if (i <= calificacionActual) {
                        estrellasComentario += '<i class="fa-solid fa-star text-warning small"></i>';
                    } else {
                        estrellasComentario += '<i class="fa-regular fa-star text-warning small"></i>';
                    }
                }

                const contenedorComentarios = document.getElementById('listaComentarios');

                // Quitar el mensaje de "Sé el primero" si existe
                if (contenedorComentarios.querySelector('.text-muted.small')) {
                    contenedorComentarios.innerHTML = '';
                }

                // Crear y agregar el comentario con Nombre + Apellido + Estrellas
                const div = document.createElement('div');
                div.className = 'border-bottom pb-3 mb-3';
                div.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <div>
                            <strong><i class="fa-solid fa-user-circle text-primary me-2"></i>${autor}</strong>
                            <div class="mt-1">${estrellasComentario}</div>
                        </div>
                        <span class="text-muted small">Justo ahora</span>
                    </div>
                    <p class="mb-0 text-dark">${texto}</p>
                `;

                contenedorComentarios.prepend(div);

                // Limpiar textarea y estrellas para el siguiente comentario
                txtComentario.value = '';
                calificacionActual = 0;
                estrellas.forEach(s => {
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular');
                });
            }
        }
    });
});
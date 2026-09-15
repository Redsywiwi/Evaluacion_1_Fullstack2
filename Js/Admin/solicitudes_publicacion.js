document.addEventListener("DOMContentLoaded", () => {
    const tipoUsuario = localStorage.getItem("tipo");
    if (tipoUsuario !== "admin") {
        window.location.href = "../login_registro.html";
        return;
    }

    const contenedor = document.getElementById("contenedorSolicitudes");
    const alerta = document.getElementById("alertaSolicitudes");

    // BD x defecto
    const solicitudesPorDefecto = [
        {
            id: "PUB-1029",
            fecha: "13/09/2026",
            contacto: {
                nombres: "Cole Wehrle",
                telefono: "+56 9 1234 5678",
                correo: "colewehrle@gmail.com"
            },
            especificaciones: {
                libro: "Root - El Juego de Rol - Libro Básico",
                tapa: "Tapa dura",
                papel: "Bond blanco",
                color: "A todo color",
                tamano: "17 x 24 cm",
                ejemplares: 50,
                paginas: 254
            },
            archivos: {
                nombrePdf: "PDFs/Root - El Juego de Rol - Libro Básico (Cole Wehrle).pdf",
                observaciones: "Necesito que la encuadernación sea muy resistente y ojalá con acabado mate en la portada."
            },
            estado: "Pendiente"
        }
    ];

    function obtenerSolicitudes() {
        let bd = localStorage.getItem("BD_SOLICITUDES_PUBLICACION");
        if (!bd) {
            localStorage.setItem("BD_SOLICITUDES_PUBLICACION", JSON.stringify(solicitudesPorDefecto));
            return solicitudesPorDefecto;
        }
        return JSON.parse(bd);
    }

    function renderizarSolicitudes() {
        const solicitudes = obtenerSolicitudes();
        contenedor.innerHTML = "";

        if (solicitudes.length === 0) {
            contenedor.innerHTML = `<div class="col-12 text-center py-5 text-muted">No hay solicitudes de publicación pendientes.</div>`;
            return;
        }

        solicitudes.forEach((solicitud, index) => {
            let colorBadge = solicitud.estado === "Pendiente" ? "bg-warning text-dark" : "bg-success";
            let iconBadge = solicitud.estado === "Pendiente" ? "fa-clock" : "fa-check-double";

            // Botón de acción
            const botonHtml = solicitud.estado === "Pendiente"
                ? `<button class="btn btn-outline-success btn-sm w-100 fw-bold mt-3" onclick="marcarContactado(${index})">
                    <i class="fa-solid fa-envelope-circle-check me-2"></i>Marcar como Contactado
                   </button>`
                : `<div class="alert alert-success mt-3 mb-0 p-2 text-center small fw-bold">Cotización enviada al cliente</div>`;

            const tarjeta = `
                <div class="col-12 mb-4">
                    <div class="card shadow-sm border-0 border-start border-4 border-warning">
                        <div class="card-header bg-white border-bottom pb-2 pt-3 d-flex justify-content-between align-items-center">
                            <span class="text-muted fw-bold">Solicitud #${solicitud.id} <span class="ms-2 fw-normal small">(${solicitud.fecha})</span></span>
                            <span class="badge ${colorBadge} px-3 py-2"><i class="fa-solid ${iconBadge} me-1"></i>${solicitud.estado}</span>
                        </div>
                        <div class="card-body">
                            <div class="row g-4">
                                <!-- 1. Información de Contacto -->
                                <div class="col-md-4 border-end-md">
                                    <h6 class="fw-bold text-primary border-bottom pb-2 mb-3"><i class="fa-solid fa-address-card me-2"></i>1. Info. de Contacto</h6>
                                    <p class="mb-1 text-dark"><strong>Autor:</strong> ${solicitud.contacto.nombres}</p>
                                    <p class="mb-1 text-dark"><strong>Teléfono:</strong> ${solicitud.contacto.telefono}</p>
                                    <p class="mb-0 text-dark"><strong>Correo:</strong> <a href="mailto:${solicitud.contacto.correo}" class="text-decoration-none">${solicitud.contacto.correo}</a></p>
                                </div>
                                
                                <!-- 2. Especificaciones de Impresión -->
                                <div class="col-md-4 border-end-md">
                                    <h6 class="fw-bold text-primary border-bottom pb-2 mb-3"><i class="fa-solid fa-print me-2"></i>2. Especificaciones</h6>
                                    <p class="mb-1 fw-bold text-dark">📖 ${solicitud.especificaciones.libro}</p>
                                    <ul class="small text-muted mb-0 ps-3">
                                        <li><strong>Tapa:</strong> ${solicitud.especificaciones.tapa}</li>
                                        <li><strong>Papel:</strong> ${solicitud.especificaciones.papel}</li>
                                        <li><strong>Color:</strong> ${solicitud.especificaciones.color}</li>
                                        <li><strong>Tamaño:</strong> ${solicitud.especificaciones.tamano}</li>
                                        <li><strong>Ejemplares:</strong> ${solicitud.especificaciones.ejemplares}</li>
                                        <li><strong>Páginas por ejemplar:</strong> ${solicitud.especificaciones.paginas}</li>
                                    </ul>
                                </div>

                                <!-- 3. Archivos y Observaciones -->
                                <div class="col-md-4">
                                    <h6 class="fw-bold text-primary border-bottom pb-2 mb-3"><i class="fa-solid fa-folder-open me-2"></i>3. Archivos y Obs.</h6>
                                    <div class="bg-light p-2 rounded mb-2 border border-secondary border-opacity-25">
                                        <!-- AQUÍ ESTÁ EL CAMBIO DEL HREF Y EL TARGET -->
                                        <a href="../../${solicitud.archivos.nombrePdf}" target="_blank" class="text-decoration-none text-danger small fw-bold d-block text-truncate" title="Abrir Manuscrito">
                                            <i class="fa-solid fa-file-pdf me-2"></i>${solicitud.archivos.nombrePdf}
                                        </a>
                                    </div>
                                    <p class="small text-secondary fst-italic mb-0 bg-light p-2 rounded">
                                        " ${solicitud.archivos.observaciones} "
                                    </p>
                                    
                                    ${botonHtml}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += tarjeta;
        });
    }

    renderizarSolicitudes();

    // Cambiar el estado a revisado
    window.marcarContactado = function (index) {
        let solicitudes = obtenerSolicitudes();
        solicitudes[index].estado = "Revisado";

        localStorage.setItem("BD_SOLICITUDES_PUBLICACION", JSON.stringify(solicitudes));

        alerta.innerHTML = `<i class="fa-solid fa-check me-2"></i>El estado de la solicitud se ha actualizado.`;
        alerta.className = "alert alert-success d-block shadow-sm fw-medium text-center mb-4";
        setTimeout(() => alerta.classList.replace('d-block', 'd-none'), 3000);

        renderizarSolicitudes();
    };
});
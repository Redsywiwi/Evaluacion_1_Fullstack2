document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("publicaForm");
    const modalExito = new bootstrap.Modal(document.getElementById('modalExito'));

    // 1. Autocompletado si el usuario está logueado
    const estaIniciado = localStorage.getItem("iniciado") === "true";

    if (estaIniciado) {
        const correo = localStorage.getItem("correo") || "";
        const nombres = localStorage.getItem("nombres") || "";
        const apellidos = localStorage.getItem("apellidos") || "";

        const inputNombre = document.getElementById("nombrePublica");
        const inputCorreo = document.getElementById("correoPublica");

        if (nombres || apellidos) {
            inputNombre.value = `${nombres} ${apellidos}`.trim();
        }
        if (correo) {
            inputCorreo.value = correo;
        }
    } else {
        // Si no esta logueado, muestra alerta
        document.getElementById("alertaSesion").classList.remove("d-none");
    }

    // 2. Validación y envío del formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let esValido = true;

        // Limpiar clases de validación anteriors
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

        // Validación general de Bootstrap 
        if (!form.checkValidity()) {
            esValido = false;
        }

        // Validación específica: Mínimo 80 páginas
        const inputPaginas = document.getElementById("cantidadPaginas");
        if (inputPaginas.value && parseInt(inputPaginas.value) < 80) {
            inputPaginas.classList.add("is-invalid");
            esValido = false;
        } else if (inputPaginas.value) {
            inputPaginas.classList.add("is-valid");
        }

        // Archivo estrictamente PDF
        const inputPDF = document.getElementById("archivoPDF");
        const archivo = inputPDF.files[0];
        const pdfFeedback = document.getElementById("pdfFeedback");

        if (!archivo) {
            inputPDF.classList.add("is-invalid");
            pdfFeedback.textContent = "Debe adjuntar el archivo PDF de su libro.";
            esValido = false;
        } else if (archivo.type !== "application/pdf" && !archivo.name.toLowerCase().endsWith(".pdf")) {
            inputPDF.classList.add("is-invalid");
            pdfFeedback.textContent = "El archivo seleccionado no es válido. Solo se permiten formatos .pdf";
            esValido = false;
        } else {
            inputPDF.classList.add("is-valid");
        }

        // Validar el resto de campos
        const inputsRequeridos = form.querySelectorAll('input[required], select[required]');
        inputsRequeridos.forEach(input => {
            if (!input.classList.contains('is-invalid') && input.value.trim() !== "" && input.type !== "radio" && input.type !== "file") {
                input.classList.add('is-valid');
            }
        });

        // Si hay errores para el proceso y muestra las alertas
        if (!esValido) {
            form.classList.add('was-validated');
            return;
        }

        // ==========================================
        // 3. GUARDAR SOLICITUD EN LA BASE DE DATOS
        // ==========================================

        // Obtener textos legibles de los radio buttons
        const valTapa = document.querySelector('input[name="tapa"]:checked').value === 'blanda' ? 'Tapa blanda' : 'Tapa dura';
        const valPapel = document.querySelector('input[name="papel"]:checked').value === 'ahuesado' ? 'Bond ahuesado' : 'Bond blanco';
        const valColor = document.querySelector('input[name="color"]:checked').value === 'color' ? 'A todo color' : 'Blanco y negro';

        // Obtener texto del select de tamaño
        const selectTamano = document.getElementById('tamanoLibro');
        const valTamano = selectTamano.options[selectTamano.selectedIndex].text;

        // Solicitud
        const nuevaSolicitud = {
            id: "PUB-" + Math.floor(1000 + Math.random() * 9000),
            fecha: new Date().toLocaleDateString('es-CL'),
            contacto: {
                nombres: document.getElementById('nombrePublica').value.trim(),
                telefono: document.getElementById('telefonoPublica').value.trim(),
                correo: document.getElementById('correoPublica').value.trim()
            },
            especificaciones: {
                libro: document.getElementById('nombreLibro').value.trim(),
                tapa: valTapa,
                papel: valPapel,
                color: valColor,
                tamano: valTamano,
                ejemplares: parseInt(document.getElementById('cantidadEjemplares').value),
                paginas: parseInt(document.getElementById('cantidadPaginas').value)
            },
            archivos: {
                // Se guarda el nombre del archivo simulando la subida al servidor
                nombrePdf: document.getElementById('archivoPDF').files[0].name,
                observaciones: document.getElementById('observacionesLibro').value.trim() || "Sin observaciones adicionales."
            },
            estado: "Pendiente" // Todas las solicitudes nuevas nacen pendientes
        };

        // Leer la base de datos de solicitudes
        let bdString = localStorage.getItem("BD_SOLICITUDES_PUBLICACION");
        let bdSolicitudes = [];

        if (!bdString) {
            // Si la base de datos no existe aún, la inicializamos con el caso base
            bdSolicitudes = [
                {
                    id: "PUB-1029",
                    fecha: "13/09/2026",
                    contacto: { nombres: "Cole Wehrle", telefono: "+56 9 1234 5678", correo: "colewehrle@gmail.com" },
                    especificaciones: { libro: "Root - El Juego de Rol - Libro Básico", tapa: "Tapa dura", papel: "Bond blanco", color: "A todo color", tamano: "17 x 24 cm", ejemplares: 50, paginas: 254 },
                    archivos: { nombrePdf: "PDFs/Root - El Juego de Rol - Libro Básico (Cole Wehrle).pdf", observaciones: "Necesito que la encuadernación sea muy resistente y ojalá con acabado mate en la portada." },
                    estado: "Pendiente"
                }
            ];
        } else {
            bdSolicitudes = JSON.parse(bdString);
        }

        // Insertar la nueva solicitud al principio de la lista
        bdSolicitudes.unshift(nuevaSolicitud);

        // Guardar de vuelta en el navegador
        localStorage.setItem("BD_SOLICITUDES_PUBLICACION", JSON.stringify(bdSolicitudes));

        // 4. Éxito
        form.classList.remove('was-validated');
        form.reset();

        // Quitar estilos de validación exitosa
        form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

        // Mostrar Popup
        modalExito.show();
    });
});
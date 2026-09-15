document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactoForm");
    const inputNombre = document.getElementById("contactoNombre"); // Campo "Nombre completo"
    const inputCorreo = document.getElementById("contactoCorreo");
    const inputComentarios = document.getElementById("contactoComentarios");
    const charCount = document.getElementById("charCount");
    const alerta = document.getElementById("alertaContacto");

    // Autocompletar si hay sesión iniciada
    const estaIniciado = localStorage.getItem("iniciado") === "true";
    if (estaIniciado) {
        const correoGuardado = localStorage.getItem("correo");
        const nombreGuardado = localStorage.getItem("nombres") || "";
        const apellidoGuardado = localStorage.getItem("apellidos") || "";

        if (correoGuardado) inputCorreo.value = correoGuardado;

        // Combinamos nombre y apellido con un espacio en el medio
        if (nombreGuardado || apellidoGuardado) {
            inputNombre.value = `${nombreGuardado} ${apellidoGuardado}`.trim();
        }
    }

    // Contador de caracteres para el textarea
    inputComentarios.addEventListener("input", () => {
        charCount.textContent = inputComentarios.value.length;
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let valido = true;

        const nombre = inputNombre.value.trim();
        const correo = inputCorreo.value.trim();
        const comentarios = inputComentarios.value.trim();

        // Validar Nombre
        if (nombre === "") {
            inputNombre.classList.add("is-invalid");
            valido = false;
        } else {
            inputNombre.classList.remove("is-invalid");
            inputNombre.classList.add("is-valid");
        }

        // Validar Correo
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
        const dominioValido = dominiosPermitidos.some(dominio => correo.endsWith(dominio));

        if (!correo || !regexCorreo.test(correo) || !dominioValido) {
            inputCorreo.classList.add("is-invalid");
            valido = false;
        } else {
            inputCorreo.classList.remove("is-invalid");
            inputCorreo.classList.add("is-valid");
        }

        // Validar Comentarios
        if (comentarios === "" || comentarios.length > 500) {
            inputComentarios.classList.add("is-invalid");
            valido = false;
        } else {
            inputComentarios.classList.remove("is-invalid");
            inputComentarios.classList.add("is-valid");
        }

        if (!valido) return;

        // Exitoso
        alerta.textContent = "¡Mensaje enviado con éxito! Nos contactaremos contigo pronto.";
        alerta.className = "alert alert-success mb-4 d-block";

        form.reset();
        charCount.textContent = "0";
        document.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));

        // Restaurar autocompletado si aplica
        if (estaIniciado) {
            const correoGuardado = localStorage.getItem("correo");
            const nombreGuardado = localStorage.getItem("nombres") || "";
            const apellidoGuardado = localStorage.getItem("apellidos") || "";

            if (correoGuardado) inputCorreo.value = correoGuardado;
            if (nombreGuardado || apellidoGuardado) {
                inputNombre.value = `${nombreGuardado} ${apellidoGuardado}`.trim();
            }
        }

        setTimeout(() => {
            alerta.classList.remove("d-block");
            alerta.classList.add("d-none");
        }, 4000);
    });
});
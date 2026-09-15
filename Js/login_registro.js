const USUARIOS_POR_DEFECTO = {
    "usuario@gmail.com": {
        id: 1,
        password: "usuario",
        tipo: "usuario",
        nombres: "Usuario",
        apellidos: "Prueba 1",
        direccion: "Av. España 8, Santiago, Región Metropolitana"
    },
    "admin@profesor.duoc.cl": {
        id: 2,
        password: "admin",
        tipo: "admin",
        nombres: "Administrador",
        apellidos: "Principal",
        direccion: "Central"
    },
    "vendedor@duoc.cl": {
        id: 3,
        password: "vendedor",
        tipo: "vendedor",
        nombres: "Vendedor",
        apellidos: "Estrella",
        direccion: "Central"
    },
    "inventario@duoc.cl": {
        id: 4,
        password: "inventario",
        tipo: "inventario",
        nombres: "Encargado",
        apellidos: "De Inventario",
        direccion: "Central"
    },
    "compras@duoc.cl": {
        id: 5,
        password: "compras",
        tipo: "compras",
        nombres: "Encargado",
        apellidos: "De Compras",
        direccion: "Central"
    }
};

function obtenerUsuarios() {
    let bd = localStorage.getItem("BD_USUARIOS");
    if (!bd) {
        localStorage.setItem("BD_USUARIOS", JSON.stringify(USUARIOS_POR_DEFECTO));
        return USUARIOS_POR_DEFECTO;
    }
    return JSON.parse(bd);
}

const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mostrarSeccion(seccion) {
    document.getElementById('login').classList.remove('d-block');
    document.getElementById('login').classList.add('d-none');
    document.getElementById('registro').classList.remove('d-block');
    document.getElementById('registro').classList.add('d-none');
    document.getElementById(seccion).classList.remove('d-none');
    document.getElementById(seccion).classList.add('d-block');
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarAlerta(mensaje, tipo = "danger") {
    const alerta = document.getElementById('alertaMensaje');
    alerta.textContent = mensaje;
    alerta.className = `alert alert-${tipo} mb-4 d-block`;
    setTimeout(() => {
        alerta.classList.remove('d-block');
        alerta.classList.add('d-none');
    }, 4000);
}

window.llenarDatosTest = function (correo, password) {
    document.getElementById("loginCorreo").value = correo;
    document.getElementById("loginPassword").value = password;
    document.getElementById("loginCorreo").classList.remove("is-invalid");
    document.getElementById("loginPassword").classList.remove("is-invalid");

    const modalEl = document.getElementById("modalLlenarTest");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) {
        modalInstance.hide();
    }
};

document.addEventListener("DOMContentLoaded", function () {
    obtenerUsuarios();

    // ==========================================
    // INICIO DE SESIÓN
    // ==========================================
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();
        let valido = true;

        const inputCorreo = document.getElementById("loginCorreo");
        const inputPass = document.getElementById("loginPassword");
        const correo = inputCorreo.value.trim();
        const pass = inputPass.value.trim();

        if (!correo || correo.length > 100 || !regexCorreo.test(correo)) {
            inputCorreo.classList.add("is-invalid");
            valido = false;
        } else {
            inputCorreo.classList.remove("is-invalid");
            inputCorreo.classList.add("is-valid");
        }

        if (!pass) {
            inputPass.classList.add("is-invalid");
            valido = false;
        } else {
            inputPass.classList.remove("is-invalid");
            inputPass.classList.add("is-valid");
        }

        if (!valido) return;

        const BD_ACTUAL = obtenerUsuarios();
        const usuarioEncontrado = BD_ACTUAL[correo];

        if (usuarioEncontrado && usuarioEncontrado.password === pass) {
            localStorage.setItem("iniciado", "true");
            localStorage.setItem("idUsuario", usuarioEncontrado.id); // <-- GUARDAMOS EL ID EN SESIÓN
            localStorage.setItem("tipo", usuarioEncontrado.tipo);
            localStorage.setItem("correo", correo);
            localStorage.setItem("nombres", usuarioEncontrado.nombres);
            localStorage.setItem("apellidos", usuarioEncontrado.apellidos);

            mostrarAlerta(`¡Bienvenido! Has iniciado sesión como ${usuarioEncontrado.tipo}. Redirigiendo...`, "success");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        } else {
            mostrarAlerta("Credenciales incorrectas. Verifique correo y contraseña.");
        }
    });

    // ==========================================
    // REGISTRO
    // ==========================================
    document.getElementById("registroForm").addEventListener("submit", function (event) {
        event.preventDefault();
        let valido = true;

        const camposRequeridos = ["nombres", "apellidos", "rut", "direccion"];
        camposRequeridos.forEach(id => {
            const input = document.getElementById(id);
            if (input.value.trim() === "") {
                input.classList.add("is-invalid");
                valido = false;
            } else {
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
            }
        });

        const inputCorreo = document.getElementById("registroCorreo");
        const correo = inputCorreo.value.trim();
        const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
        const dominioValido = dominiosPermitidos.some(dominio => correo.endsWith(dominio));

        if (!correo || !regexCorreo.test(correo) || !dominioValido) {
            inputCorreo.classList.add("is-invalid");
            valido = false;
        } else {
            inputCorreo.classList.remove("is-invalid");
            inputCorreo.classList.add("is-valid");
        }

        const inputPass = document.getElementById("registroPassword");
        const inputConfirm = document.getElementById("confirmarPassword");
        const pass = inputPass.value.trim();
        const confirm = inputConfirm.value.trim();

        if (pass.length < 4 || pass.length > 10) {
            inputPass.classList.add("is-invalid");
            valido = false;
        } else {
            inputPass.classList.remove("is-invalid");
            inputPass.classList.add("is-valid");
        }

        if (pass !== confirm || confirm === "") {
            inputConfirm.classList.add("is-invalid");
            valido = false;
        } else {
            inputConfirm.classList.remove("is-invalid");
            inputConfirm.classList.add("is-valid");
        }

        if (!valido) return;

        const BD_ACTUAL = obtenerUsuarios();
        if (BD_ACTUAL[correo]) {
            inputCorreo.classList.add("is-invalid");
            mostrarAlerta("Este correo electrónico ya se encuentra registrado.", "warning");
            return;
        }

        // ID ÚNICO
        let maxId = 0;
        for (const userCorreo in BD_ACTUAL) {
            if (BD_ACTUAL[userCorreo].id > maxId) {
                maxId = BD_ACTUAL[userCorreo].id;
            }
        }
        const nuevoId = maxId + 1;

        const inputNombres = document.getElementById("nombres").value.trim();
        const inputApellidos = document.getElementById("apellidos").value.trim();

        // Registrar con el nuevo ID
        BD_ACTUAL[correo] = {
            id: nuevoId,
            password: pass,
            tipo: "usuario",
            nombres: inputNombres,
            apellidos: inputApellidos
        };

        localStorage.setItem("BD_USUARIOS", JSON.stringify(BD_ACTUAL));

        mostrarAlerta(`Cuenta creada correctamente. Tu ID de cliente es #${nuevoId}. Ahora puedes iniciar sesión.`, "success");
        document.getElementById("registroForm").reset();
        document.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));

        setTimeout(() => {
            mostrarSeccion("login");
        }, 3000);
    });
});
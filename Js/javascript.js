function mostrarSeccion(seccion) {

    const secciones = document.querySelectorAll(".seccion");

    secciones.forEach(function(elemento) {
        elemento.classList.remove("activa");
    });

    document.getElementById(seccion).classList.add("activa");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.getElementById("loginForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const correo =
            document.getElementById("loginCorreo").value;

        const password =
            document.getElementById("loginPassword").value;


        if (!validarCorreo(correo)) {

            alert("Ingrese un correo electrónico válido.");

            return;
        }


        if (password.trim() === "") {

            alert("La contraseña es obligatoria.");

            return;
        }


        alert("Inicio de sesión correcto.");
        

    }
);

document.getElementById("registroForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const correo =
            document.getElementById("registroCorreo").value;

        const password =
            document.getElementById("registroPassword").value;

        const confirmar =
            document.getElementById("confirmarPassword").value;

        const error =
            document.getElementById("errorPassword");


        if (!validarCorreo(correo)) {

            alert("Ingrese un correo electrónico válido.");

            return;
        }


        if (password !== confirmar) {

            error.textContent =
                "Las contraseñas no coinciden.";

            return;
        }


        error.textContent = "";

        alert("Cuenta creada correctamente.");

        mostrarSeccion("login");

    }
);

document.getElementById("publicaForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const paginas =
            document.getElementById("paginas").value;

        const archivo =
            document.getElementById("archivo").files[0];


        /* Validar páginas */

        if (paginas < 80) {

            alert(
                "La cantidad mínima de páginas es de 80."
            );

            return;
        }


        /* Validar PDF */

        if (!archivo) {

            alert(
                "Debe adjuntar el archivo PDF del libro."
            );

            return;
        }


        if (archivo.type !== "application/pdf") {

            alert(
                "El archivo debe estar en formato PDF."
            );

            return;
        }


        /* Mostrar confirmación */

        document
            .getElementById("popup")
            .classList.add("mostrar");

    }
);

function cerrarPopup() {

    document
        .getElementById("popup")
        .classList.remove("mostrar");

}


function validarCorreo(correo) {

    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresion.test(correo);

}
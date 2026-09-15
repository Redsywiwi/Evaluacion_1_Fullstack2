document.addEventListener("DOMContentLoaded", () => {
    // 1. Validar inicio de sesión
    const estaIniciado = localStorage.getItem("iniciado") === "true";
    if (!estaIniciado) {
        alert("Debes iniciar sesión para procesar el pago.");
        window.location.href = "login_registro.html";
        return;
    }

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        window.location.href = "carrito.html";
        return;
    }

    // 2. Calcular Subtotal
    let subtotal = 0;
    carrito.forEach(item => {
        let precioLimpio = parseInt(item.precio.toString().replace('$', '').replace(/\./g, '').replace(',', '')) || 0;
        subtotal += precioLimpio * item.cantidad;
    });

    document.getElementById('pagoSubtotal').textContent = `$${subtotal.toLocaleString('es-CL')}`;

    // 3. Calcular 48 horas hábiles
    function calcularFechaHabil(horasHábiles) {
        let fecha = new Date();
        let horasRestantes = horasHábiles;

        while (horasRestantes > 0) {
            fecha.setHours(fecha.getHours() + 1);
            let diaSemana = fecha.getDay(); // 0 = Domingo, 6 = Sábado

            if (diaSemana !== 0 && diaSemana !== 6) {
                horasRestantes--;
            }
        }

        const opciones = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return fecha.toLocaleDateString('es-CL', opciones);
    }

    const fechaEstimadaTexto = calcularFechaHabil(48);
    document.getElementById('pagoFechaEstimada').textContent = fechaEstimadaTexto;

    // 4. Envíos
    const radioRetiro = document.getElementById('retiroTienda');
    const radioEnvio = document.getElementById('envioDomicilio');
    const contenedorDireccion = document.getElementById('contenedorDireccion');
    const inputDireccion = document.getElementById('direccionEnvio');
    const spanEnvio = document.getElementById('pagoEnvio');
    const spanTotal = document.getElementById('pagoTotal');

    const correoUsuario = localStorage.getItem("correo");
    const bdUsuarios = JSON.parse(localStorage.getItem("BD_USUARIOS")) || {};
    if (bdUsuarios[correoUsuario] && bdUsuarios[correoUsuario].direccion) {
        inputDireccion.value = bdUsuarios[correoUsuario].direccion;
    }

    function actualizarTotales() {
        let costoEnvio = 0;

        if (radioEnvio.checked) {
            contenedorDireccion.classList.remove('d-none');
            inputDireccion.setAttribute('required', 'true');

            if (subtotal < 30000) {
                costoEnvio = 2000;
                spanEnvio.textContent = "$2.000 CLP";
            } else {
                spanEnvio.textContent = "¡Gratis! (Compra mayor a $30.000)";
            }
        } else {
            contenedorDireccion.classList.add('d-none');
            inputDireccion.removeAttribute('required');
            spanEnvio.textContent = "$0 (Retiro en tienda)";
        }

        let totalFinal = subtotal + costoEnvio;
        spanTotal.textContent = `$${totalFinal.toLocaleString('es-CL')}`;
    }

    radioRetiro.addEventListener('change', actualizarTotales);
    radioEnvio.addEventListener('change', actualizarTotales);
    actualizarTotales();

    // 5. Procesar el formulario de """""""pago"""""""""
    const formPago = document.getElementById('formPago');
    const modalExito = new bootstrap.Modal(document.getElementById('modalPagoExitoso'));

    formPago.addEventListener('submit', (e) => {
        e.preventDefault();

        if (radioEnvio.checked && inputDireccion.value.trim() === "") {
            inputDireccion.classList.add('is-invalid');
            return;
        }

        const idOrden = "ORD-" + Math.floor(1000 + Math.random() * 9000);
        const idUsuarioActual = localStorage.getItem("idUsuario") || "1";

        const nuevoPedido = {
            id: idOrden,
            fecha: new Date().toLocaleDateString('es-CL'),
            estado: "En pedido",
            items: carrito.map(i => ({ nombre: i.titulo, cantidad: i.cantidad })),
            detalle: radioEnvio.checked ? `Envío a domicilio. Fecha estimada de entrega: ${fechaEstimadaTexto}` : `Retiro en tienda seleccionado. Fecha estimada de retiro: ${fechaEstimadaTexto}`
        };

        // Guardar pedido en el historial del usuario
        let pedidosLocales = JSON.parse(localStorage.getItem('pedidosPersonalizados')) || {};
        if (!pedidosLocales[idUsuarioActual]) {
            pedidosLocales[idUsuarioActual] = [];
        }
        pedidosLocales[idUsuarioActual].unshift(nuevoPedido);
        localStorage.setItem('pedidosPersonalizados', JSON.stringify(pedidosLocales));

        // DESCONTAR DEL STOCK
        carrito.forEach(item => {
            if (window.descontarStock) {
                window.descontarStock(item.titulo, item.cantidad);
            }
        });

        // Limpiar carrito
        localStorage.removeItem('carrito');

        // Exito
        document.getElementById('mensajeModalExito').textContent = `¡Pedido #${idOrden} registrado con éxito!`;
        modalExito.show();
    });
});
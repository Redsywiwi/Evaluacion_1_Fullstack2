document.addEventListener("DOMContentLoaded", () => {
    // Solo Compras o Admin
    const tipoUsuario = localStorage.getItem("tipo");
    if (tipoUsuario !== "compras" && tipoUsuario !== "admin") {
        window.location.href = "../login_registro.html";
        return;
    }

    const form = document.getElementById("formNuevoPedido");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const proveedor = document.getElementById("selectProveedor");
        const producto = document.getElementById("inputProducto");
        const cantidad = document.getElementById("inputCantidad");

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        // Crear objeto de pedido
        const nuevoPedido = {
            idOrden: "PRV-" + Math.floor(1000 + Math.random() * 9000),
            proveedor: proveedor.value,
            producto: producto.value.trim(),
            cantidad: parseInt(cantidad.value),
            fechaEmision: new Date().toLocaleDateString('es-CL'),
            estado: "En preparación" // Inicia siempre en preparación
        };

        // Guardar en base de datos de proveedores
        let pedidosBD = JSON.parse(localStorage.getItem("BD_PEDIDOS_PROVEEDOR")) || [];
        pedidosBD.unshift(nuevoPedido);
        localStorage.setItem("BD_PEDIDOS_PROVEEDOR", JSON.stringify(pedidosBD));

        // Redirigir al panel de seguimiento
        window.location.href = "seguimiento_proveedores.html?exito=true";
    });
});
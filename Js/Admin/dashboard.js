document.addEventListener("DOMContentLoaded", () => {
    const tipoUsuario = localStorage.getItem("tipo");
    if (tipoUsuario !== "admin") {
        window.location.href = "../login_registro.html";
        return;
    }

    // ==========================================
    // 1. CONTADOR DINÁMICO DE SOLICITUDES
    // ==========================================
    const bdSolicitudesStr = localStorage.getItem("BD_SOLICITUDES_PUBLICACION");
    let cantidadPendientes = 0;

    if (bdSolicitudesStr) {
        const solicitudes = JSON.parse(bdSolicitudesStr);
        // Filtrar y contar solo las que tienen estado "Pendiente"
        cantidadPendientes = solicitudes.filter(sol => sol.estado === "Pendiente").length;
    } else {
        // Si la base de datos aún no se ha creado, 1 por defecto (el caso del Root)
        cantidadPendientes = 1;
    }

    // Inyectar el número en el HTML manejando singular/plural
    const lblContador = document.getElementById("contadorSolicitudes");
    if (lblContador) {
        lblContador.textContent = `${cantidadPendientes} Pendiente${cantidadPendientes !== 1 ? 's' : ''}`;
    }


    // ==========================================
    // 2. GRÁFICOS (Chart.js)
    // ==========================================

    // Gráfico de Barras: Rentabilidad por Título
    const ctxProductos = document.getElementById('graficoProductos').getContext('2d');
    new Chart(ctxProductos, {
        type: 'bar',
        data: {
            labels: ['Catan', 'Root', '1984', 'Hábitos Atómicos', 'El Arte de la Guerra'],
            datasets: [{
                label: 'Margen de Ganancia (CLP)',
                data: [120000, 95000, 45000, 60000, 30000],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Gráfico de Torta: Ventas por Categoría
    const ctxCategorias = document.getElementById('graficoCategorias').getContext('2d');
    new Chart(ctxCategorias, {
        type: 'doughnut',
        data: {
            labels: ['Juegos de Mesa', 'Literatura', 'Autoayuda', 'Comics/Manga'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#4bc0c0']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
});
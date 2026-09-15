// Base de datos inicial del inventario
const INVENTARIO_POR_DEFECTO = [
    { titulo: "1984", stock: 15 },
    { titulo: "Abejas - Una guía para curiosos", stock: 8 },
    { titulo: "El Arte de la Guerra", stock: 42 },
    { titulo: "El Hobbit", stock: 23 },
    { titulo: "El Principito", stock: 50 },
    { titulo: "Fundamentos de Programación", stock: 5 },
    { titulo: "Hábitos Atómicos", stock: 37 },
    { titulo: "La Casa de los Espíritus", stock: 12 },
    { titulo: "La Ciencia de la Cocina", stock: 19 },
    { titulo: "La Vuelta al Mundo en 80 Dias", stock: 27 },
    { titulo: "Nepal - Panda Rojo", stock: 4 },
    { titulo: "Subterra", stock: 33 },
    { titulo: "Root: El juego de rol", stock: 14 },
    { titulo: "Catan: El juego", stock: 20 },
    { titulo: "UNO", stock: 50 },
];

// Iniciar o recuperar la base de datos del inventario
function obtenerInventarioCompleto() {
    let bdStock = localStorage.getItem("BD_INVENTARIO");
    if (!bdStock) {
        localStorage.setItem("BD_INVENTARIO", JSON.stringify(INVENTARIO_POR_DEFECTO));
        return INVENTARIO_POR_DEFECTO;
    }
    return JSON.parse(bdStock);
}

// Funcion para compatibilidad con el detalle de producto q usa otra vieja xd
function obtenerStock(tituloBuscado) {
    const inventarioActual = obtenerInventarioCompleto();
    const tituloNormalizado = tituloBuscado.toLowerCase().replace(/\s+/g, ' ').trim();

    const producto = inventarioActual.find(item =>
        item.titulo.toLowerCase().replace(/\s+/g, ' ').trim() === tituloNormalizado
    );

    return producto ? producto.stock : null;
}

//  Descontar las compras del stock
window.descontarStock = function (tituloComprado, cantidadComprada) {
    let inventarioActual = obtenerInventarioCompleto();
    const tituloNormalizado = tituloComprado.toLowerCase().replace(/\s+/g, ' ').trim();

    let productoIndex = inventarioActual.findIndex(item =>
        item.titulo.toLowerCase().replace(/\s+/g, ' ').trim() === tituloNormalizado
    );

    if (productoIndex !== -1) {
        inventarioActual[productoIndex].stock -= cantidadComprada;
        if (inventarioActual[productoIndex].stock < 0) {
            inventarioActual[productoIndex].stock = 0;
        }
        localStorage.setItem("BD_INVENTARIO", JSON.stringify(inventarioActual));
    }
};

// Sumar stock globalmente (usado por Encargado de Compras)
window.aumentarStock = function (tituloComprado, cantidadComprada) {
    let inventarioActual = obtenerInventarioCompleto();
    const tituloNormalizado = tituloComprado.toLowerCase().replace(/\s+/g, ' ').trim();

    let productoIndex = inventarioActual.findIndex(item =>
        item.titulo.toLowerCase().replace(/\s+/g, ' ').trim() === tituloNormalizado
    );

    if (productoIndex !== -1) {
        // Si el producto ya existe, se suma a la cantidad actual
        inventarioActual[productoIndex].stock += cantidadComprada;
    } else {
        // Si es un producto nuevo que no estaba en bodega, se crea el registro
        inventarioActual.push({ titulo: tituloComprado, stock: cantidadComprada });
    }

    localStorage.setItem("BD_INVENTARIO", JSON.stringify(inventarioActual));
};
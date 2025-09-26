var productos = [
    {nombre: 'camisa', precio:300, stock: 10},
    {nombre: 'pantalon', precio:500, stock: 5},
    {nombre: 'zapatos', precio:400, stock: 8},
    {nombre: 'sombrero', precio:300, stock: 15}
];

var carrito = [];
var ventas = [];

function mostrarMenuPrincipal(){
    return prompt("Selecciona una opción: \n"+
        "1. Menú de Compras (Cliente)\n"+
        "2. Menú de Administrador\n"+
        "3. Salir"
    );
}

function mostrarMenuCliente(){
    return prompt("Selecciona un producto: \n"+
        productos.map((p, i) => `${i+1}. ${p.nombre} - $${p.precio} (Stock: ${p.stock})`).join('\n') +
        "\n5. Ver Carrito\n"+
        "6. Finalizar Compra\n"+
        "7. Volver al Menú Principal"
    );
}

function mostrarMenuAdministrador(){
    return prompt("Menú Administrador:\n"+
        "1. Agregar nuevo producto\n"+
        "2. Eliminar producto\n"+
        "3. Modificar precio\n"+
        "4. Modificar stock\n"+
        "5. Ver todos los productos\n"+
        "6. Ver reporte de ventas\n"+
        "7. Volver al menú principal"
    );
}

function verCarrito(){
    if(carrito.length === 0){
        alert("El carrito está vacío");
        return 0;
    }
    let mensaje = "Carrito:\n";
    let total = 0;
    carrito.forEach((p,i) => {
        mensaje += `${i+1}. ${p.nombre} - $${p.precio}\n`;
        total += p.precio;
    });
    mensaje += `\nTotal: $${total}`;
    alert(mensaje);
    return total;
}

function quitarDelCarrito(){
    if(carrito.length === 0){
        alert("El carrito está vacío");
        return;
    }
    
    let mensaje = "Selecciona el producto a quitar:\n";
    carrito.forEach((p,i) => {
        mensaje += `${i+1}. ${p.nombre} - $${p.precio}\n`;
    });
    
    const opcion = prompt(mensaje);
    const indice = parseInt(opcion) - 1;
    
    if(isNaN(indice) || indice < 0 || indice >= carrito.length){
        alert("Opción no válida");
        return;
    }
    
    const productoEliminado = carrito[indice];
    carrito.splice(indice, 1);
    
    // Devolver el producto al stock
    const productoOriginal = productos.find(p => p.nombre === productoEliminado.nombre);
    if(productoOriginal) {
        productoOriginal.stock++;
    }
    
    alert(`${productoEliminado.nombre} ha sido removido del carrito`);
}

function autenticarAdministrador(){
    const usuario = prompt("Usuario administrador:");
    const password = prompt("Contraseña:");
    
    // Credenciales simples (en un sistema real esto sería más seguro)
    return usuario === "admin" && password === "admin123";
}

// FUNCIONES DE ADMINISTRADOR
function agregarProducto(){
    const nombre = prompt("Nombre del nuevo producto:");
    const precio = parseInt(prompt("Precio del producto:"));
    const stock = parseInt(prompt("Stock inicial:"));
    
    if(nombre && !isNaN(precio) && !isNaN(stock)){
        productos.push({nombre, precio, stock});
        alert(`Producto "${nombre}" agregado exitosamente`);
    } else {
        alert("Datos inválidos");
    }
}

function eliminarProducto(){
    let mensaje = "Selecciona el producto a eliminar:\n";
    productos.forEach((p,i) => {
        mensaje += `${i+1}. ${p.nombre} - $${p.precio} (Stock: ${p.stock})\n`;
    });
    
    const opcion = prompt(mensaje);
    const indice = parseInt(opcion) - 1;
    
    if(indice >= 0 && indice < productos.length){
        const productoEliminado = productos[indice];
        productos.splice(indice, 1);
        alert(`Producto "${productoEliminado.nombre}" eliminado`);
    } else {
        alert("Opción no válida");
    }
}

function modificarPrecio(){
    let mensaje = "Selecciona el producto a modificar:\n";
    productos.forEach((p,i) => {
        mensaje += `${i+1}. ${p.nombre} - Precio actual: $${p.precio}\n`;
    });
    
    const opcion = prompt(mensaje);
    const indice = parseInt(opcion) - 1;
    
    if(indice >= 0 && indice < productos.length){
        const nuevoPrecio = parseInt(prompt(`Nuevo precio para ${productos[indice].nombre}:`));
        if(!isNaN(nuevoPrecio)){
            productos[indice].precio = nuevoPrecio;
            alert("Precio actualizado exitosamente");
        } else {
            alert("Precio inválido");
        }
    } else {
        alert("Opción no válida");
    }
}

function modificarStock(){
    let mensaje = "Selecciona el producto:\n";
    productos.forEach((p,i) => {
        mensaje += `${i+1}. ${p.nombre} - Stock actual: ${p.stock}\n`;
    });
    
    const opcion = prompt(mensaje);
    const indice = parseInt(opcion) - 1;
    
    if(indice >= 0 && indice < productos.length){
        const nuevoStock = parseInt(prompt(`Nuevo stock para ${productos[indice].nombre}:`));
        if(!isNaN(nuevoStock) && nuevoStock >= 0){
            productos[indice].stock = nuevoStock;
            alert("Stock actualizado exitosamente");
        } else {
            alert("Stock inválido");
        }
    } else {
        alert("Opción no válida");
    }
}

function verTodosProductos(){
    let mensaje = "Inventario de Productos:\n\n";
    productos.forEach((p,i) => {
        mensaje += `${i+1}. ${p.nombre}\n`;
        mensaje += `   Precio: $${p.precio}\n`;
        mensaje += `   Stock: ${p.stock}\n\n`;
    });
    
    alert(mensaje);
}

function verReporteVentas(){
    if(ventas.length === 0){
        alert("No hay ventas registradas");
        return;
    }
    
    let mensaje = "Reporte de Ventas:\n\n";
    let totalVentas = 0;
    
    ventas.forEach((venta, i) => {
        mensaje += `Venta #${i+1}:\n`;
        venta.productos.forEach(p => {
            mensaje += `   - ${p.nombre}: $${p.precio}\n`;
        });
        mensaje += `   Total: $${venta.total}\n`;
        mensaje += `   Fecha: ${venta.fecha}\n\n`;
        totalVentas += venta.total;
    });
    
    mensaje += `TOTAL GENERAL: $${totalVentas}`;
    alert(mensaje);
}

// FUNCIONES PRINCIPALES
function menuCliente(){
    let opcion;
    do{
        opcion = mostrarMenuCliente();
        switch(opcion){
            case "1":
            case "2":
            case "3":
            case "4":
                const indice = parseInt(opcion) - 1;
                if(productos[indice].stock > 0){
                    carrito.push({...productos[indice]});
                    productos[indice].stock--;
                    alert(`${productos[indice].nombre} agregado al carrito`);
                } else {
                    alert("Producto sin stock disponible");
                }
                break;
            case "5":
                verCarrito();
                break;
            case "6":
                const total = verCarrito();
                if(total > 0){
                    if(confirm(`¿Confirmar compra por $${total}?`)){
                        ventas.push({
                            productos: [...carrito],
                            total: total,
                            fecha: new Date().toLocaleString()
                        });
                        alert("¡Compra realizada exitosamente!");
                        carrito = [];
                    }
                }
                break;
            case "7":
                alert("Volviendo al menú principal...");
                break;
            default:
                alert("Opción no válida");
        }
    }while(opcion !== "7");
}

function menuAdministrador(){
    if(!autenticarAdministrador()){
        alert("Credenciales incorrectas");
        return;
    }
    
    let opcion;
    do{
        opcion = mostrarMenuAdministrador();
        switch(opcion){
            case "1":
                agregarProducto();
                break;
            case "2":
                eliminarProducto();
                break;
            case "3":
                modificarPrecio();
                break;
            case "4":
                modificarStock();
                break;
            case "5":
                verTodosProductos();
                break;
            case "6":
                verReporteVentas();
                break;
            case "7":
                alert("Volviendo al menú principal...");
                break;
            default:
                alert("Opción no válida");
        }
    }while(opcion !== "7");
}

function main(){
    let opcion;
    do{
        opcion = mostrarMenuPrincipal();
        switch(opcion){
            case "1":
                menuCliente();
                break;
            case "2":
                menuAdministrador();
                break;
            case "3":
                alert("¡Gracias por usar nuestro sistema!");
                break;
            default:
                alert("Opción no válida");
        }
    }while(opcion !== "3");
}

// Iniciar el sistema
main();
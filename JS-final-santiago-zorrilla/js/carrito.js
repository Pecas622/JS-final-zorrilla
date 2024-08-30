let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

const contenedorCarrito = document.querySelector(".carrito-productos");
const total = document.querySelector("#total");
const vaciarCarritoBtn = document.querySelector(".carrito-acciones-vaciar");
const comprarAhoraBtn = document.querySelector(".carrito-acciones-comprar");
const mensajeCarritoVacio = document.querySelector(".carrito-vacio");

function cargarCarrito() {
    contenedorCarrito.innerHTML = "";
    if (productosEnCarrito.length > 0) {
        mensajeCarritoVacio.style.display = "none"; // Oculta el mensaje de carrito vacío
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-detalles">
                    <h3 class="carrito-producto-titulo">${producto.titulo}</h3>
                    <p class="carrito-producto-precio">$${producto.precio}</p>
                    <p class="carrito-producto-cantidad">Cantidad: ${producto.cantidad}</p>
                    <button class="carrito-producto-eliminar" id="${producto.id}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            `;
            contenedorCarrito.append(div);
        });
    } else {
        mensajeCarritoVacio.style.display = "block"; // Muestra el mensaje de carrito vacío
    }
    actualizarTotal();
    agregarEventosEliminar();
}

function actualizarTotal() {
    const totalCarrito = productosEnCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    total.innerText = `$${totalCarrito.toFixed(2)}`; // Asegura que el total se muestre con dos decimales
}

function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idBoton);
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarCarrito();
    actualizarNumerito();

    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #ff6f61, #ff9a8b)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        }
    }).showToast();
}

vaciarCarritoBtn.addEventListener("click", () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esto eliminará todos los productos del carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito = [];
            localStorage.removeItem("productos-en-carrito");
            cargarCarrito();
            actualizarNumerito();

            Toastify({
                text: "Carrito vaciado",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #ff6f61, #ff9a8b)",
                    borderRadius: "2rem",
                    textTransform: "uppercase",
                    fontSize: ".75rem"
                },
                offset: {
                    x: '1.5rem',
                    y: '1.5rem'
                }
            }).showToast();
        }
    });
});

comprarAhoraBtn.addEventListener("click", () => {
    if (productosEnCarrito.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'No puedes realizar la compra con un carrito vacío.'
        });
    } else {
        Swal.fire({
            title: '¿Confirmar compra?',
            text: 'Estás a punto de realizar la compra.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, comprar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Compra realizada',
                    text: 'Gracias por tu compra.'
                });
                // Vaciar el carrito después de la compra
                productosEnCarrito = [];
                localStorage.removeItem("productos-en-carrito");
                cargarCarrito();
                actualizarNumerito();
            }
        });
    }
});

function actualizarNumerito() {
    const cantidadTotal = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    const numerito = document.querySelector(".numerito"); // Asegúrate de que el selector sea correcto
    if (numerito) {
        numerito.innerText = cantidadTotal;
    }
}

// Inicializar la carga del carrito y el numerito
cargarCarrito();
actualizarNumerito();

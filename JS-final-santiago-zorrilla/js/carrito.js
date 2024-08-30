let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

const contenedorCarrito = document.querySelector(".carrito-productos");
const total = document.querySelector("#total");
const vaciarCarritoBtn = document.querySelector(".carrito-acciones-vaciar");
const comprarAhoraBtn = document.querySelector(".carrito-acciones-comprar");

function cargarCarrito() {
    contenedorCarrito.innerHTML = "";
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
    actualizarTotal();
    agregarEventosEliminar();
}

function actualizarTotal() {
    const totalCarrito = productosEnCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    total.innerText = `$${totalCarrito}`;
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
    productosEnCarrito = [];
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
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
            icon: 'success',
            title: 'Compra realizada',
            text: 'Gracias por tu compra.'
        }).then(() => {
            vaciarCarritoBtn.click(); // Vaciar carrito después de la compra
        });
    }
});

function actualizarNumerito() {
    const cantidadTotal = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    const numerito = document.querySelector("#numerito");
    if (numerito) {
        numerito.innerText = cantidadTotal;
    }
}

cargarCarrito();

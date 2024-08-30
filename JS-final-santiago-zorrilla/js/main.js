let productos = [];

// Cargar productos desde el JSON
fetch("./js/productos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        return response.json();
    })
    .then(data => {
        console.log("Productos cargados correctamente:", data);
        productos = data;
        cargarProductos(productos);  // Cargar todos los productos inicialmente
    })
    .catch(error => console.error('Error al cargar productos:', error));

// Seleccionar elementos del DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
const numerito = document.querySelector("#numerito");

// Función para cargar productos en el DOM
function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);  // Agregar el producto al contenedor
    });
    actualizarBotonesAgregar();  // Actualizar los botones para agregar al carrito
}

// Filtrado de productos por categoría
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));  // Eliminar clase 'active' de todos
        e.currentTarget.classList.add("active");  // Añadir clase 'active' al botón seleccionado

        const categoriaId = e.currentTarget.id;
        if (categoriaId !== "todos") {
            const productosFiltrados = productos.filter(producto => producto.categoria.id === categoriaId);  // Corregido para filtrar por id de categoría
            tituloPrincipal.innerText = productosFiltrados[0]?.categoria.nombre || "Productos";  // Título dinámico
            cargarProductos(productosFiltrados);  // Cargar productos filtrados
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);  // Cargar todos los productos
        }
    });
});

// Actualizar botones de agregar al carrito
function actualizarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        }
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    const productoExistente = productosEnCarrito.find(producto => producto.id === idBoton);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    actualizarNumerito();
}

function actualizarNumerito() {
    const cantidadTotal = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = cantidadTotal;
}

// Inicializar la actualización del numerito del carrito
actualizarNumerito();

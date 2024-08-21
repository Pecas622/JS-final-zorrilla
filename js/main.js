// Clase Botin
class Botin {
    constructor(id, nombre, marca, color, precio, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.color = color;
        this.precio = precio;
        this.imagen = imagen;
    }
}

// Botines iniciales
const listaDeBotines = [
    new Botin(1, "Mercurial", "Nike", "Negro", 15000, "assets/nike/nike negro.jpg"),
    new Botin(2, "Tiempo", "Nike", "Blanco", 14000, "assets/nike/nike lunar 2.jpg"),
    new Botin(3, "Top Sala", "Adidas", "Negro", 13000, "assets/adidas/predator negro.jpg"),
    new Botin(4, "Top Flex", "Joma", "Blanco", 12000, "assets/joma/joma 4.jpg"),
];

// Carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para mostrar los botines disponibles
function mostrarBotines() {
    const listaBotinesDiv = document.getElementById("listaBotines");
    listaBotinesDiv.innerHTML = "";
    listaDeBotines.forEach(botin => {
        const botinDiv = document.createElement("div");
        botinDiv.className = "botin";
        botinDiv.innerHTML = `
            <img src="${botin.imagen}" alt="${botin.nombre}">
            <h3>${botin.nombre}</h3>
            <p>Marca: ${botin.marca}</p>
            <p>Color: ${botin.color}</p>
            <p>Precio: $${botin.precio}</p>
            <button onclick="agregarAlCarrito(${botin.id})">Agregar al Carrito</button>
        `;
        listaBotinesDiv.appendChild(botinDiv);
    });
}

// Función para agregar un botín al carrito
function agregarAlCarrito(id) {
    const botin = listaDeBotines.find(botin => botin.id === id);
    carrito.push(botin);
    actualizarCarrito();
}

// Función para actualizar el carrito en la página y en localStorage
function actualizarCarrito() {
    const contenidoCarrito = document.getElementById("contenidoCarrito");
    contenidoCarrito.innerHTML = "";
    carrito.forEach((botin, index) => {
        const li = document.createElement("li");
        li.textContent = `${botin.nombre} - $${botin.precio}`;
        contenidoCarrito.appendChild(li);
    });
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para vaciar el carrito
function vaciarCarrito() {
    // Usar SweetAlert para la confirmación
    Swal.fire({
        title: "¿Estás seguro de que deseas vaciar el carrito?",
        text: "¡No podrás revertir esta acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "light green",
        cancelButtonColor: "red",
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Vaciar el carrito si el usuario confirma
            carrito = [];
            actualizarCarrito();

            // Mostrar un mensaje de éxito
            Swal.fire({
                title: "¡Vacío!",
                text: "Tu carrito ha sido vaciado.",
                icon: "success"
            });
        }
    });
}


// Event Listener para el botón de vaciar carrito
document.getElementById("vaciarCarrito").addEventListener("click", vaciarCarrito);

// Inicializar la página mostrando los botines y el carrito
mostrarBotines();
actualizarCarrito();
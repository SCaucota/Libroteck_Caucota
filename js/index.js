function mostrarTodosLibros() {
    const seccionCarrito = document.querySelector("#seccionCarrito");
    seccionCarrito.innerHTML = '';
    seccionCarrito.classList.remove("seccionCarrito");
    const seccionLibros = document.querySelector("#seccionLibros");
    seccionLibros.innerHTML = '';

    fetch('./libros.json')
    .then((response) => response.json())
    .then((libros) => {
        libros.forEach(libro => {
            crearTarjetasLibros(libro)
        })
    })
}

function filtroLibros() {
    const categoriaFiltro = document.querySelectorAll(".dropdown-item");

    categoriaFiltro.forEach(categoriaElegida => {
        categoriaElegida.addEventListener("click", function () {
            const categoriaSeleccionada = categorias.find(categoria => categoria.nombre === this.textContent);

            fetch('./libros.json')
                .then((response) => response.json())
                .then((libros) => {
                    const librosFiltrados = libros.filter(libro => libro.idCategoria === categoriaSeleccionada.id);

                    const seccionCarrito = document.querySelector("#seccionCarrito");
                    seccionCarrito.innerHTML = '';
                    const seccionLibros = document.querySelector("#seccionLibros");
                    seccionLibros.innerHTML = '';

                    librosFiltrados.forEach(libro => {
                        crearTarjetasLibros(libro);
                    });
                });
        });
    });

    const inicio = document.querySelector(".inicio");
    inicio.addEventListener("click", mostrarTodosLibros);
}

function crearTarjetasLibros(libro) {

    const seccionLibros = document.querySelector("#seccionLibros");
    seccionLibros.classList.add("seccionLibros");

    const divLibro = document.createElement("div");
    divLibro.classList.add("card");

    divLibro.innerHTML = `
        <img src="${libro.img}" alt="carrito" class="card-img-top">
        <div class="datosCard">
            <h5 class="card-title">${libro.nombre}</h5>
            <p class="card-text">$${libro.precio}</p>
            <button class="btn">Comprar</button>
        </div>`;

    const boton = divLibro.querySelector(".btn");
    boton.addEventListener("click", function () {
        agregarAcarrito(libro);
    })

    seccionLibros.appendChild(divLibro);

    return boton;
}

function agregarAcarrito(libroElegido) {

    let cantidad = 1;

    totalCompra += libroElegido.precio
    let totalCompraJson = JSON.stringify(totalCompra);
    localStorage.setItem('totalPrecioLibros', totalCompraJson);

    let carritoActualizado = JSON.parse(localStorage.getItem("Carrito")) || [];

    let total = JSON.parse(localStorage.getItem("total"));
    let precioEnvio = JSON.parse(localStorage.getItem("precioEnvio"));

    listaDeCompra = [];

    carritoActualizado.forEach(libro => {
        listaDeCompra.push(libro);
    });

    let verificarRepetidos = listaDeCompra.some(libro => libro.id === libroElegido.id);

    verificarRepetidos
        ? (() => {
            let libroRepetido = listaDeCompra.find(libro => libro.id === libroElegido.id);
            libroRepetido.cantidad += cantidad;
            total = 0;
            precioEnvio = 0;
            localStorage.setItem('total', JSON.stringify(total));
            localStorage.setItem('precioEnvio', JSON.stringify(precioEnvio));
        })()
        : (() => {
            listaDeCompra = [...listaDeCompra, { id: libroElegido.id, nombre: libroElegido.nombre, img: libroElegido.img, cantidad: cantidad, precio: libroElegido.precio }]
            total = 0;
            precioEnvio = 0;
            localStorage.setItem('total', JSON.stringify(total));
            localStorage.setItem('precioEnvio', JSON.stringify(precioEnvio));
        })();

    const carritoJSON = JSON.stringify(listaDeCompra);
    localStorage.setItem('Carrito', carritoJSON);

    Toastify({
        text: `Agregado al carrito`,
        duration: 5000,
        close: true,
        offset: {
            x: 50,
            y: 10
        },
        gravity: "top",
        position: "right",
    }).showToast();
}

filtroLibros();
mostrarTodosLibros();
function cargarLibros(url, filtro) {
    const seccionCarrito = document.querySelector("#seccionCarrito");
    seccionCarrito.innerHTML = '';
    seccionCarrito.classList.remove("seccionCarrito");
    const seccionLibros = document.querySelector("#seccionLibros");
    seccionLibros.innerHTML = '';

    fetch(url)
        .then((response) => response.json())
        .then((libros) => {
            const librosFiltrados = filtro ? libros.filter(filtro) : libros;
            librosFiltrados.forEach(libro => {
                crearTarjetasLibros(libro);
            });
        });
};

function mostrarTodosLibros() {
    cargarLibros("./libros.json");
};

function filtroLibros() {
    const categoriaFiltro = document.querySelectorAll(".dropdown-item");

    categoriaFiltro.forEach(categoriaElegida => {
        categoriaElegida.addEventListener("click", function () {
            const categoriaSeleccionada = categorias.find(categoria => categoria.nombre === this.textContent);
            cargarLibros("./libros.json", libro => libro.idCategoria === categoriaSeleccionada.id)
        });
    });

    const inicio = document.querySelector(".inicio");
    inicio.addEventListener("click", mostrarTodosLibros);
};

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
    boton.id = `btn-${libro.id}`;

    boton.addEventListener("click", function () {
        agregarAcarrito(libro);
    });

    seccionLibros.appendChild(divLibro);

    verificarStock(libro.id);
};

function verificarStock(libroId) {
    const carritoActualizado = JSON.parse(localStorage.getItem("Carrito"));

    if (carritoActualizado) {
        const libroEnCarrito = carritoActualizado.find(libro => libro.id === libroId);

        if (libroEnCarrito && libroEnCarrito.cantidad === libroEnCarrito.stock) {
            const boton = document.getElementById(`btn-${libroId}`);
            boton.disabled = true;
            boton.textContent = "Sin Stock";
        }
    }

};

function agregarAcarrito(libroElegido) {
    let cantidad = 1;

    listaDeCompra = [];

    totalCompra += libroElegido.precio
    let totalCompraJson = JSON.stringify(totalCompra);
    localStorage.setItem('totalPrecioLibros', totalCompraJson);

    let carritoActualizado = JSON.parse(localStorage.getItem("Carrito")) || [];
    let total = JSON.parse(localStorage.getItem("total"));
    let precioEnvio = JSON.parse(localStorage.getItem("precioEnvio"));

    carritoActualizado.forEach(libro => {
        listaDeCompra.push(libro);
    });

    let verificarRepetidos = listaDeCompra.some(libro => libro.id === libroElegido.id);

    verificarRepetidos
        ? (() => {
            let libroRepetido = listaDeCompra.find(libro => libro.id === libroElegido.id);
            libroRepetido.cantidad += cantidad;

        })()
        : (() => {
            listaDeCompra = [
                ...listaDeCompra,
                {
                    id: libroElegido.id,
                    nombre: libroElegido.nombre,
                    img: libroElegido.img,
                    cantidad: cantidad,
                    precio: libroElegido.precio,
                    stock: libroElegido.stock
                }];
        })();

    total = 0;
    precioEnvio = 0;
    localStorage.setItem('total', JSON.stringify(total));
    localStorage.setItem('precioEnvio', JSON.stringify(precioEnvio));

    const compraPrevia = JSON.parse(localStorage.getItem("Compra Previa"));

    if (compraPrevia && listaDeCompra.length > 0) {
        listaDeCompra.forEach(libroEnLista => {
            const libroEnCompraPrevia = compraPrevia.find(libro => libro.id === libroEnLista.id);

            if (libroEnCompraPrevia) {
                libroEnLista.stock = libroEnCompraPrevia.stock;
            }
        });

        localStorage.setItem('Carrito', JSON.stringify(listaDeCompra));
    } else {
        localStorage.setItem('Carrito', JSON.stringify(listaDeCompra));
    }

    verificarStock(libroElegido.id);

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
};

filtroLibros();
mostrarTodosLibros();
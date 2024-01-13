function cargarLibros(url, filtro) {
    return new Promise((resolve, reject) => {
    const seccionCarrito = document.getElementById("seccionCarrito");
    seccionCarrito.innerHTML = "";
    seccionCarrito.classList.remove("seccionCarrito");
    const seccionLibros = document.getElementById("seccionLibros");
    seccionLibros.innerHTML = "";

    fetch(url)
        .then((response) => response.json())
        .then((libros) => {
            const librosFiltrados = filtro ? libros.filter(filtro) : libros;
            librosFiltrados.forEach(libro => {
                crearTarjetasLibros(libro);
            });
            resolve(librosFiltrados)
        })
        .catch(reject);
    });
};

function mostrarTodosLibros() {
    cargarLibros("./libros.json");
};

function filtroLibrosCategorias() {
    const menuCategorias = document.getElementById("dropdown");

    categorias.forEach(opcion => {
        const liCategoria = document.createElement("li");
        const aCategoria = document.createElement("a");
        aCategoria.classList.add("dropdown-item");
        aCategoria.textContent = opcion.nombre;

        liCategoria.appendChild(aCategoria);
        menuCategorias.appendChild(liCategoria);
    })

    const categoriaFiltro = document.querySelectorAll(".dropdown-item");

    categoriaFiltro.forEach(categoriaElegida => {
        categoriaElegida.addEventListener("click", (event) => {
            const categoriaSeleccionada = categorias.find(categoria => categoria.nombre === event.target.textContent);
            cargarLibros("./libros.json", libro => libro.idCategoria === categoriaSeleccionada.id)
        });
    });

    const inicio = document.querySelector(".inicio");
    inicio.addEventListener("click", mostrarTodosLibros);
};

function buscarLibro() {
    const formBusqueda = document.getElementById("formBusqueda");
    formBusqueda.addEventListener("submit", (event) => {
        event.preventDefault();
        const inputBusqueda = document.getElementById("inputBusqueda").value.toLowerCase();

        if (inputBusqueda.trim() === "") {
            mostrarTodosLibros();
        } else {
            cargarLibros("./libros.json", libro => libro.nombre.toLowerCase().includes(inputBusqueda))
                .then(coincidencias => {
                    if (coincidencias.length === 0) {
                        mostrarTodosLibros();
                    }
                })
        }
    });
}

function crearTarjetasLibros(libro) {

    const seccionLibros = document.getElementById("seccionLibros");
    seccionLibros.classList.add("seccionLibros");

    const divLibro = document.createElement("div");
    divLibro.classList.add("card");

    divLibro.innerHTML = `
        <img src="${libro.img}" alt="carrito" class="card-img-top">
        <div class="datosCard">
            <h5 class="card-title">${libro.nombre}</h5>
            <p class="card-text">$${formatearPrecio(libro.precio)}</p>
            <button class="btn">Comprar</button>
        </div>`;

    const boton = divLibro.querySelector(".btn");
    boton.id = `btn-${libro.id}`;

    boton.addEventListener("click", () => agregarAcarrito(libro));

    seccionLibros.appendChild(divLibro);

    actualizarEstadoStock(libro.id);
};

function actualizarEstadoStock(libroId) {
    const carritoActualizado = JSON.parse(localStorage.getItem("Carrito"));
    const compraPrevia = JSON.parse(localStorage.getItem("Compra Previa"));
    if (carritoActualizado) {
        const libroEnCarrito = carritoActualizado.find(libro => libro.id === libroId);

        if (libroEnCarrito && libroEnCarrito.cantidad === libroEnCarrito.stock) {
            const boton = document.getElementById(`btn-${libroId}`);
            boton.disabled = true;
            boton.textContent = "Sin Stock";
        }
    }

    if (compraPrevia) {
        const libroEnCompraPrevia = compraPrevia.find(libro => libro.id === libroId);
        if (libroEnCompraPrevia && libroEnCompraPrevia.stock === 0) {
            const boton = document.getElementById(`btn-${libroId}`);
            boton.disabled = true;
            boton.textContent = "Sin Stock";
        }
    }
};

function agregarAcarrito(libroElegido) {
    let cantidad = 1;

    let listaDeCompra = [];

    let totalPrecioLibros = JSON.parse(localStorage.getItem("totalPrecioLibros"));
    totalPrecioLibros += libroElegido.precio;
    localStorage.setItem("totalPrecioLibros", JSON.stringify(totalPrecioLibros));

    let carritoActualizado = JSON.parse(localStorage.getItem("Carrito")) || [];
    let total = JSON.parse(localStorage.getItem("total")) || 0;
    let precioEnvio = JSON.parse(localStorage.getItem("precioEnvio")) || 0;

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
    localStorage.setItem("total", JSON.stringify(total));
    localStorage.setItem("precioEnvio", JSON.stringify(precioEnvio));

    const compraPrevia = JSON.parse(localStorage.getItem("Compra Previa"));

    if (compraPrevia && listaDeCompra.length > 0) {
        listaDeCompra.forEach(libroEnLista => {
            const libroEnCompraPrevia = compraPrevia.find(libro => libro.id === libroEnLista.id);

            if (libroEnCompraPrevia) {
                libroEnLista.stock = libroEnCompraPrevia.stock;
            }
        });

        localStorage.setItem("Carrito", JSON.stringify(listaDeCompra));
    } else {
        localStorage.setItem("Carrito", JSON.stringify(listaDeCompra));
    }

    actualizarEstadoStock(libroElegido.id);

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

function formatearPrecio(numero) {
    return new Intl.NumberFormat("es-AR").format(numero);
};

filtroLibrosCategorias();
buscarLibro();
mostrarTodosLibros();
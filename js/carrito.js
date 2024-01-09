function iniciarCarrito() {

    const iconoCarrito = document.querySelector(".iconoCarrito");

    iconoCarrito.addEventListener("click", function () {
        mostrarCarrito();
    });
};

function mostrarCarrito() {
    let totalPrecioLibros = JSON.parse(localStorage.getItem('totalPrecioLibros')) || 0;
    let precioEnvio = JSON.parse(localStorage.getItem('precioEnvio')) || 0;
    let total = JSON.parse(localStorage.getItem("total")) || 0;


    const seccionLibros = document.querySelector("#seccionLibros");
    seccionLibros.innerHTML = '';
    seccionLibros.classList.remove("seccionLibros");

    const seccionCarrito = document.querySelector("#seccionCarrito");
    seccionCarrito.classList.add("seccionCarrito");

    let carrito = JSON.parse(localStorage.getItem("Carrito"));

    if (!carrito || carrito.length === 0) {
        vaciarCarrito();
        return;
    }

    carrito.forEach(libro => {
        const divLibro = crearLibrosCarrito(libro);

        const divContainerLibros = document.createElement("div");
        divContainerLibros.classList.add("containerLibros")

        divContainerLibros.appendChild(divLibro);
        seccionCarrito.appendChild(divContainerLibros);

        const eliminarIcono = divLibro.querySelector(".eliminarIcono");
        eliminarIcono.addEventListener("click", function () {
            Swal.fire({
                title: "¿Eliminar libros?",
                text: `Estas apunto de eliminar todos los libros de titulo: ${libro.nombre}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                cancelButtonText: "Cancelar",
                confirmButtonText: "Sí, eliminar"
            }).then((result) => {
                if (result.isConfirmed) {
                    eliminarLibroDelCarrito(libro.id);
                    divLibro.parentElement.removeChild(divLibro);
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "Los libros se eliminaron exitosamente",
                        icon: "success"
                    });
                }
            });
        });

        sumarRestarLibros(libro);
    });

    crearSeccionTotal(totalPrecioLibros, precioEnvio, total);

    calcularEnvio(precioEnvio);
};

function crearSeccionTotal(totalPrecioLibros, precioEnvio, total) {
    const seccionCarrito = document.getElementById("seccionCarrito");

    const divTotalYenvio = document.createElement("div");
    divTotalYenvio.classList.add("containerTotalEnvio");
    divTotalYenvio.innerHTML = `
        <div class="divTotalEnvio">
            <div class="grupo-precio">
                <h4>Subtotal (sin envio):</h4>
                <h4 id="subtotal">$${totalPrecioLibros}</h4>
            </div>
            <div>
                <div class="grupo-precio precioEnvioProvincias">
                    <h4 for="envio">Provincia de Envio: </h4>
                    <h3 id="precioEnvio">$${precioEnvio}</h3>
                </div>
                <div class="grupo-precio">
                    <select name="provincias" id="opcionProvincia">
                        <option value="Buenos Aires">Buenos Aires</option>
                        <option value="Cordoba">Cordoba</option>
                        <option value="Mendoza">Mendoza</option>
                        <option value="Santa Fe">Santa Fe</option>
                    </select>
                    <button id="calcular" class="btn botonCalcular">Calcular</button>
                </div>
            </div>
            <div class="grupo-precio">
                <h2>Total:</h2>
                <h2 id="total">$${total}</h2>
            </div>
        </div>`;

    const divBotonFinCompra = document.createElement("div");
    const botonFinCompra = document.createElement("button");
    botonFinCompra.textContent = "Iniciar Compra";
    botonFinCompra.classList.add("btn");
    botonFinCompra.addEventListener("click", function () {
        let select = document.getElementById("opcionProvincia");
        let opcionElegida = select.value;
        let total = JSON.parse(localStorage.getItem("total"));
        total != 0 ? iniciarCompra(opcionElegida) : (Swal.fire({ title: "Olvidaste calcular el total", text: "Haz click en calcular", icon: "warning" }));
    });

    const botonVaciarCarrito = document.createElement("button");
    botonVaciarCarrito.textContent = "Vaciar Carrito";
    botonVaciarCarrito.classList.add("btn");
    botonVaciarCarrito.addEventListener("click", function () {
        Swal.fire({
            title: "¿Quieres vaciar el Carrito?",
            text: "Se eliminaran todos los libros agregados",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "¡Se vació el Carrito!",
                    text: "Listo para que puedas iniciar una nueva compra",
                    icon: "success"
                });
                vaciarCarrito();
            }
        });
    });

    divBotonFinCompra.appendChild(botonFinCompra);
    divBotonFinCompra.appendChild(botonVaciarCarrito);
    divTotalYenvio.appendChild(divBotonFinCompra);
    seccionCarrito.appendChild(divTotalYenvio);

    const selectProvincia = document.getElementById("opcionProvincia");
    selectProvincia.addEventListener("change", function () {
        calcularEnvio(precioEnvio);
    });


    document.getElementById("opcionProvincia").addEventListener("change", function () {
        localStorage.setItem('precioEnvio', 0);

        localStorage.setItem('total', 0);

        actualizarTotal();

        const divFormExistente = document.querySelector(".divForm");

        if (divFormExistente) {
            divFormExistente.innerHTML = "";
            divFormExistente.classList.remove("divForm");
        }
    });
};

function crearLibrosCarrito(libro) {
    const divLibro = document.createElement("div");
    divLibro.setAttribute("data-libro-id", libro.id);
    divLibro.classList.add("card");
    divLibro.classList.add("cardCarrito");


    divLibro.innerHTML = `
            <img src="${libro.img}" alt="carrito" class="cardImageCarrito">
            <div>
                <h5 class="card-title">${libro.nombre}</h5>
                <div class="input-group mb-3">
                    <span class="restar input-group-text">-</span>
                    <input type="text" disabled class="form-control" value=${libro.cantidad}>
                    <span class="sumar input-group-text">+</span>
                </div>
                <p>$${libro.precio}</p>
            </div>
            <img class="eliminarIcono" src="./img/eliminar.png" alt="">`;
    return divLibro;
};

function calcularEnvio(precioEnvio) {
    let botonCalcularEnvio = document.getElementById("calcular");
    let select = document.getElementById("opcionProvincia");
    let totalPrecioLibros = JSON.parse(localStorage.getItem("totalPrecioLibros")) || 0;

    let opcionElegida = select.value;

    let proviciaElegida = provincias.find(prov => prov.nombre === opcionElegida);

    botonCalcularEnvio.addEventListener("click", function () {
        precioEnvio = proviciaElegida.costoEnvio;
        localStorage.setItem('precioEnvio', JSON.stringify(precioEnvio));

        total = totalPrecioLibros + precioEnvio;
        localStorage.setItem('total', JSON.stringify(total));
        actualizarTotal();
    })
};

function actualizarTotal() {
    const subtotalElemento = document.getElementById("subtotal");
    const totalElemento = document.getElementById("total");
    const precioEnvioElemento = document.getElementById("precioEnvio");
    let totalPrecioLibros = JSON.parse(localStorage.getItem("totalPrecioLibros"));
    let total = JSON.parse(localStorage.getItem("total"));
    let precioEnvio = JSON.parse(localStorage.getItem("precioEnvio"))
    if (subtotalElemento && totalElemento && precioEnvioElemento) {
        subtotalElemento.textContent = `$${totalPrecioLibros}`;
        totalElemento.textContent = `$${total}`;
        precioEnvioElemento.textContent = `$${precioEnvio}`;
    }
};

function sumarRestarLibros(libroSeleccionado) {
    const divLibro = document.querySelector(`.cardCarrito[data-libro-id="${libroSeleccionado.id}"]`);
    const restar = divLibro.querySelector(".restar");
    const sumar = divLibro.querySelector(".sumar");
    const inputCantidad = divLibro.querySelector(".form-control");
    let total = JSON.parse(localStorage.getItem("total"));
    let precioEnvio = JSON.parse(localStorage.getItem("precioEnvio"));



    restar.addEventListener("click", function () {
        total = 0;
        precioEnvio = 0;
        localStorage.setItem('total', JSON.stringify(total));
        localStorage.setItem('precioEnvio', JSON.stringify(precioEnvio));
        let cantidad = parseInt(inputCantidad.value);

        if (cantidad > 0) {
            cantidad -= 1;
            inputCantidad.value = cantidad;
            actualizarCantidadEnCarrito(libroSeleccionado.id, cantidad);
            totalCompra -= libroSeleccionado.precio;
            localStorage.setItem('totalPrecioLibros', JSON.stringify(totalCompra));
            actualizarTotal();
            calcularEnvio(precioEnvio)
        }

        if (cantidad === 0) {
            eliminarLibroDelCarrito(libroSeleccionado.id);
            divLibro.parentElement.removeChild(divLibro);
        }
    });

    sumar.addEventListener("click", function () {
        total = 0;
        precioEnvio = 0;
        localStorage.setItem('total', JSON.stringify(total));
        localStorage.setItem('precioEnvio', JSON.stringify(precioEnvio));
        let cantidad = parseInt(inputCantidad.value);
        let stock = libroSeleccionado.stock;
        if (cantidad < stock) {
            cantidad += 1;
            inputCantidad.value = cantidad;
            actualizarCantidadEnCarrito(libroSeleccionado.id, cantidad);
            totalCompra += libroSeleccionado.precio;
            localStorage.setItem('totalPrecioLibros', JSON.stringify(totalCompra));
            actualizarTotal();
            calcularEnvio(precioEnvio);
        }
    });
};

function actualizarCantidadEnCarrito(libroId, nuevaCantidad) {
    let carrito = JSON.parse(localStorage.getItem("Carrito"));
    let libroIndex = carrito.findIndex(libro => libro.id === libroId);
    if (libroIndex !== -1) {
        carrito[libroIndex] = { ...carrito[libroIndex], cantidad: nuevaCantidad };
        localStorage.setItem("Carrito", JSON.stringify(carrito));
    }
};

function eliminarLibroDelCarrito(libroId) {

    let carrito = JSON.parse(localStorage.getItem("Carrito"));
    let total = JSON.parse(localStorage.getItem("total"));
    let precioEnvio = JSON.parse(localStorage.getItem("precioEnvio"));

    total = 0;
    precioEnvio = 0;
    localStorage.setItem('total', JSON.stringify(total));
    localStorage.setItem('precioEnvio', JSON.stringify(precioEnvio));

    let libroAeliminar = carrito.find(libroElegido => libroElegido.id === libroId)
    let libroIndex = carrito.findIndex(libro => libro.id === libroId);

    if (libroIndex !== -1) {
        carrito.splice(libroIndex, 1);
        localStorage.setItem("Carrito", JSON.stringify(carrito));
        totalCompra -= libroAeliminar.precio * libroAeliminar.cantidad;
        localStorage.setItem('totalPrecioLibros', JSON.stringify(totalCompra));
        actualizarTotal();
        calcularEnvio(precioEnvio)
    }

    if (carrito.length === 0) {
        vaciarCarrito();
    }
};

function vaciarCarrito() {
    localStorage.removeItem("Carrito");
    localStorage.removeItem("total");
    localStorage.removeItem("precioEnvio");
    localStorage.removeItem("totalPrecioLibros");

    actualizarTotal();

    const seccionCarrito = document.getElementById("seccionCarrito");
    seccionCarrito.innerHTML = "";
    const mensajeSinLibros = document.createElement("h1");
    mensajeSinLibros.textContent = "Sin libros en el Carrito";

    const botonInicio = document.createElement("button");
    botonInicio.textContent = "Descubrir Libros";
    botonInicio.classList.add("btn");
    botonInicio.addEventListener("click", mostrarTodosLibros);

    seccionCarrito.appendChild(mensajeSinLibros);
    seccionCarrito.appendChild(botonInicio);
};

iniciarCarrito();
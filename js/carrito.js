function iniciarCarrito() {
    const navBarsmCarrito = document.getElementById("navBarsmCarrito");
    navBarsmCarrito.addEventListener("click", mostrarCarrito);
    const navBarlgCarrito = document.getElementById("navBarlgCarrito");
    navBarlgCarrito.addEventListener("click", mostrarCarrito);
};

function mostrarCarrito() {
    let totalPrecioLibros = JSON.parse(localStorage.getItem('totalPrecioLibros')) || 0;
    let precioEnvio = JSON.parse(localStorage.getItem('precioEnvio')) || 0;
    let total = JSON.parse(localStorage.getItem("total")) || 0;

    const seccionLibros = document.getElementById("seccionLibros");
    seccionLibros.innerHTML = '';
    seccionLibros.classList.remove("seccionLibros");

    const seccionCarrito = document.getElementById("seccionCarrito");
    seccionCarrito.classList.add("seccionCarrito");

    let carrito = JSON.parse(localStorage.getItem("Carrito")) || [];

    if (!carrito || carrito.length === 0) {
        vaciarCarrito();
        return;
    }

    const fragmento = document.createDocumentFragment();

    carrito.forEach(libro => {
        const divLibro = crearLibrosCarrito(libro);

        const divContainerLibros = document.createElement("div");
        divContainerLibros.classList.add("containerLibros")

        divContainerLibros.appendChild(divLibro);
        fragmento.appendChild(divContainerLibros);

        const eliminarIcono = divLibro.querySelector(".eliminarIcono");
        eliminarIcono.addEventListener("click", () => {
            sweetAlertMensaje("¿Eliminar libros?", `Estas apunto de eliminar todos los libros de titulo: ${libro.nombre}`, "warning", "Si, eliminar")
                .then((result) => {
                    if (result.isConfirmed) {
                        eliminarLibroDelCarrito(libro.id, divLibro);
                        sweetAlertMensaje("¡Eliminado!", "Los libros se eliminaron exitosamente", "success");
                    }
                });
        });
    });

    seccionCarrito.innerHTML = '';
    seccionCarrito.appendChild(fragmento);

    crearSeccionTotal(totalPrecioLibros, precioEnvio, total);
};

function sweetAlertMensaje(title, text, icon, confirmar) {
    if(confirmar){
        Swal.fire({
            title: `${title}`,
            text: `${text}`,
            icon: `${icon}`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: `${confirmar}`
        })
    }else{
        Swal.fire({
            title: `${title}`,
            text: `${text}`,
            icon: `${icon}`
        });
    }
}

function crearSeccionTotal(totalPrecioLibros, precioEnvio, total) {
    const seccionCarrito = document.getElementById("seccionCarrito");

    const divTotalYenvio = document.createElement("div");
    divTotalYenvio.classList.add("containerTotalEnvio");
    divTotalYenvio.innerHTML = `
        <div class="divTotalEnvio">
            <div class="grupo-precio totalPrecioLibros">
                <h4>Subtotal (sin envio):</h4>
                <h4 id="subtotal">$${formatearPrecio(totalPrecioLibros)}</h4>
            </div>
            <div>
                <div class="grupo-precio precioEnvioProvincias">
                    <h4 for="envio">Provincia de Envio: </h4>
                    <h3 id="precioEnvio">$${formatearPrecio(precioEnvio)}</h3>
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
                <h2 id="total">$${formatearPrecio(total)}</h2>
            </div>
        </div>`;

    const divBotonFinCompra = document.createElement("div");
    divBotonFinCompra.classList.add("divBotonFinCompra");
    const botonFinCompra = document.createElement("button");
    botonFinCompra.textContent = "Iniciar Compra";
    botonFinCompra.classList.add("btn");
    botonFinCompra.addEventListener("click", () => {
        let select = document.getElementById("opcionProvincia");
        let opcionElegida = select.value;
        let total = JSON.parse(localStorage.getItem("total")) || 0;
        total != 0 ? iniciarCompra(opcionElegida) : (sweetAlertMensaje("Olvidaste calcular el total", "Haz click en calcular", "warning"));
    });

    const botonVaciarCarrito = document.createElement("button");
    botonVaciarCarrito.textContent = "Vaciar Carrito";
    botonVaciarCarrito.classList.add("btn");
    botonVaciarCarrito.classList.add("botonVaciar");
    botonVaciarCarrito.addEventListener("click", () => {
        sweetAlertMensaje("¿Quieres vaciar el Carrito?", "Se eliminaran todos los libros agregados", "warning", "Aceptar")
            .then((result) => {
                if (result.isConfirmed) {
                    sweetAlertMensaje("¡Se vació el Carrito!", "Listo para que puedas iniciar una nueva compra", "success");
                    vaciarCarrito();
                }
            });
    });

    divBotonFinCompra.appendChild(botonFinCompra);
    divBotonFinCompra.appendChild(botonVaciarCarrito);
    divTotalYenvio.appendChild(divBotonFinCompra);
    seccionCarrito.appendChild(divTotalYenvio);

    const selectProvincia = document.getElementById("opcionProvincia");
    selectProvincia.addEventListener("change", actualizarTotal);

    document.getElementById("opcionProvincia").addEventListener("change", () => {
        localStorage.setItem('precioEnvio', JSON.stringify(0));

        localStorage.setItem('total', JSON.stringify(0));

        actualizarTotal();

        const divFormExistente = document.querySelector(".divForm");

        if (divFormExistente) {
            divFormExistente.innerHTML = "";
            divFormExistente.classList.remove("divForm");
        }
    });

    let botonCalcularEnvio = document.getElementById("calcular");
    botonCalcularEnvio.addEventListener("click", () => calcularEnvio(precioEnvio));
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
                    <input type="number" min="0" class="form-control cantidad-input" value=${libro.cantidad}>
                    <span class="sumar input-group-text">+</span>
                </div>
                <p>$${formatearPrecio(libro.precio)}</p>
            </div>
            <img class="eliminarIcono" src="./img/eliminar.png" alt="">`;

    const inputCantidad = divLibro.querySelector(".cantidad-input");

    inputCantidad.addEventListener("input", () => {
        let cantidad = 0;
        actualizarCantidadEnCarrito(libro, cantidad, inputCantidad, divLibro);
    });

    const restar = divLibro.querySelector(".restar");
    const sumar = divLibro.querySelector(".sumar");

    const actualizarCantidad = (cantidad) => {
        actualizarCantidadEnCarrito(libro, cantidad, inputCantidad, divLibro);
    };

    restar.addEventListener("click", () => actualizarCantidad(-1));
    sumar.addEventListener("click", () => actualizarCantidad(1));

    return divLibro;
};

function calcularEnvio(precioEnvio) {
    let select = document.getElementById("opcionProvincia");
    let totalPrecioLibros = JSON.parse(localStorage.getItem("totalPrecioLibros")) || 0;

    let opcionElegida = select.value;

    let proviciaElegida = provincias.find(prov => prov.nombre === opcionElegida);

    precioEnvio = proviciaElegida.costoEnvio;
    localStorage.setItem('precioEnvio', JSON.stringify(precioEnvio));

    total = totalPrecioLibros + precioEnvio;
    localStorage.setItem('total', JSON.stringify(total));
    actualizarTotal();
};

function actualizarTotal() {
    const subtotalElemento = document.getElementById("subtotal");
    const totalElemento = document.getElementById("total");
    const precioEnvioElemento = document.getElementById("precioEnvio");
    let totalPrecioLibros = JSON.parse(localStorage.getItem("totalPrecioLibros"));
    let total = JSON.parse(localStorage.getItem("total")) || 0;
    let precioEnvio = JSON.parse(localStorage.getItem("precioEnvio")) || 0;

    if (subtotalElemento && totalElemento && precioEnvioElemento) {
        subtotalElemento.textContent = `$${formatearPrecio(totalPrecioLibros)}`;
        totalElemento.textContent = `$${formatearPrecio(total)}`;
        precioEnvioElemento.textContent = `$${formatearPrecio(precioEnvio)}`;
    };
};

function actualizarCantidadEnCarrito(libro, cantidad, inputCantidad, divLibro) {

    let carrito = JSON.parse(localStorage.getItem("Carrito"));
    let totalPrecioLibros = JSON.parse(localStorage.getItem("totalPrecioLibros")) || 0;
    if (inputCantidad.value === "") {
        return;
    }
    let cantidadActual = parseInt(inputCantidad.value);
    let stock = libro.stock;
    let nuevaCantidad;

    if (cantidadActual + cantidad > 0 && cantidadActual + cantidad <= stock) {
        nuevaCantidad = cantidadActual + cantidad;
        inputCantidad.value = nuevaCantidad;
        actualizarTotalPrecioLibros(carrito, totalPrecioLibros, cantidad, cantidadActual, nuevaCantidad, libro);
    } else if (cantidadActual > stock) {
        nuevaCantidad = stock;
        inputCantidad.value = nuevaCantidad;
        actualizarTotalPrecioLibros(carrito, totalPrecioLibros, cantidad, cantidadActual, nuevaCantidad, libro);
        sweetAlertMensaje("¡Ups! Ingresaste una cantidad que supera el stock", `Ingresa un número mayor a 1 y menor a ${stock}`, "warning");
    } else if (cantidadActual + cantidad === 0) {
        eliminarLibroDelCarrito(libro.id, divLibro);
        return;
    } else if (cantidadActual + cantidad < 0) {
        nuevaCantidad = 1;
        inputCantidad.value = nuevaCantidad;
        actualizarTotalPrecioLibros(carrito, totalPrecioLibros, cantidad, cantidadActual, nuevaCantidad, libro);
        sweetAlertMensaje("¡Ups! Ingresaste una número negativo", `Ingresa un número mayor a 1 y menor a ${stock}`, "warning");
    };

    let libroIndex = carrito.findIndex(producto => producto.id === libro.id);

    if (libroIndex !== -1) {
        carrito[libroIndex] = { ...carrito[libroIndex], cantidad: nuevaCantidad };
        localStorage.setItem("Carrito", JSON.stringify(carrito));
    }

    localStorage.setItem("total", JSON.stringify(0));
    localStorage.setItem("precioEnvio", JSON.stringify(0));

    actualizarTotal();
};

function actualizarTotalPrecioLibros(carrito, totalPrecioLibros, cantidad, cantidadActual, nuevaCantidad, libro) {
    if (cantidad === 0 || cantidadActual + cantidad < 0 || cantidadActual > libro.stock) {
        let libroCarrito = carrito.find(producto => producto.id === libro.id);
        totalPrecioLibros -= libroCarrito.cantidad * libro.precio;
        totalPrecioLibros += nuevaCantidad * libro.precio;
    }else{
        totalPrecioLibros += cantidad * libro.precio;
    }

    localStorage.setItem("totalPrecioLibros", JSON.stringify(totalPrecioLibros));
};

function eliminarLibroDelCarrito(libroId, divLibro) {

    let carrito = JSON.parse(localStorage.getItem("Carrito"));
    let total = JSON.parse(localStorage.getItem("total"));
    let precioEnvio = JSON.parse(localStorage.getItem("precioEnvio"));
    let totalPrecioLibros = JSON.parse(localStorage.getItem("totalPrecioLibros"));

    total = 0;
    precioEnvio = 0;
    localStorage.setItem('total', JSON.stringify(total));
    localStorage.setItem('precioEnvio', JSON.stringify(precioEnvio));

    let libroAeliminar = carrito.find(libroElegido => libroElegido.id === libroId)
    let libroIndex = carrito.findIndex(libro => libro.id === libroId);

    if (libroIndex !== -1) {
        carrito.splice(libroIndex, 1);
        localStorage.setItem("Carrito", JSON.stringify(carrito));
        totalPrecioLibros -= libroAeliminar.precio * libroAeliminar.cantidad;
        localStorage.setItem('totalPrecioLibros', JSON.stringify(totalPrecioLibros));
        divLibro.parentElement.removeChild(divLibro)
        actualizarTotal();
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

    const divSinCarrito = document.createElement("div");
    divSinCarrito.classList.add("divSinCarrito");

    const mensajeSinLibros = document.createElement("h1");
    mensajeSinLibros.textContent = "Sin libros en el Carrito";

    const botonInicio = document.createElement("button");
    botonInicio.textContent = "Descubrir Libros";
    botonInicio.classList.add("btn");
    botonInicio.addEventListener("click", mostrarTodosLibros);

    divSinCarrito.appendChild(mensajeSinLibros);
    divSinCarrito.appendChild(botonInicio);
    seccionCarrito.appendChild(divSinCarrito);
};

iniciarCarrito();
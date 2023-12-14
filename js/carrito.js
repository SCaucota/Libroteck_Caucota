function iniciarCarrito() {

    const iconoCarrito = document.querySelector(".iconoCarrito");

    iconoCarrito.addEventListener("click", function () {
        mostrarCarrito();
    });
}

function mostrarCarrito() {
    let totalPrecioLibros = JSON.parse(localStorage.getItem('totalPrecioLibros')) || 0;
    let precioEnvio = JSON.parse(localStorage.getItem('precioEnvio')) || 0;
    let total = JSON.parse(localStorage.getItem("total")) || 0;


    const seccionLibros = document.querySelector(".seccionLibros");
    seccionLibros.innerHTML = '';

    const seccionCarrito = document.querySelector(".seccionCarrito");

    let carrito = JSON.parse(localStorage.getItem("Carrito"));

    if (!carrito || carrito.length === 0) {
        const mensajeSinLibros = document.createElement("h1");
        mensajeSinLibros.textContent = "Sin libros en el Carrito";
        seccionCarrito.appendChild(mensajeSinLibros);
        return;
    }


    carrito.forEach(libro => {
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
                    <input type="text" class="form-control" value=${libro.cantidad}>
                    <span class="sumar input-group-text">+</span>
                </div>
                <p>$${libro.precio}</p>
            </div>
            <img class="eliminarIcono" src="./img/eliminar.png" alt="">`;

        const divContainerLibros = document.createElement("div");
        divContainerLibros.classList.add("containerLibros")

        divContainerLibros.appendChild(divLibro);
        seccionCarrito.appendChild(divContainerLibros);

        const eliminarIcono = divLibro.querySelector(".eliminarIcono");
        eliminarIcono.addEventListener("click", function () {
            eliminarLibroDelCarrito(libro.id);
            divLibro.parentElement.removeChild(divLibro);
        });

        sumarRestarLibros(libro);
    });

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
    botonFinCompra.addEventListener("click", function() {
        let select = document.getElementById("opcionProvincia");
        let opcionElegida = select.value;
        iniciarCompra(opcionElegida)
    });

    divBotonFinCompra.appendChild(botonFinCompra);
    divTotalYenvio.appendChild(divBotonFinCompra);
    seccionCarrito.appendChild(divTotalYenvio);

    const selectProvincia = document.getElementById("opcionProvincia");
    selectProvincia.addEventListener("change", function () {
        calcularEnvio(precioEnvio);
    });

    calcularEnvio(precioEnvio)
}

function calcularEnvio(precioEnvio) {
    let botonCalcularEnvio = document.getElementById("calcular");
    let select = document.getElementById("opcionProvincia");
    let totalPrecioLibros = JSON.parse(localStorage.getItem("totalPrecioLibros")) || 0;

    let opcionElegida = select.value;

    let proviciaElegida = provincias.find(prov => prov.nombre === opcionElegida);

    botonCalcularEnvio.addEventListener("click", function () {
        console.log(totalPrecioLibros)
        precioEnvio = proviciaElegida.costoEnvio;
        localStorage.setItem('precioEnvio', JSON.stringify(precioEnvio));

        total = totalPrecioLibros + precioEnvio;
        localStorage.setItem('total', JSON.stringify(total));
        actualizarTotal();
    })
}

function actualizarTotal(provinciaElegida) {
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
}

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
        cantidad += 1;
        inputCantidad.value = cantidad;
        actualizarCantidadEnCarrito(libroSeleccionado.id, cantidad);
        totalCompra += libroSeleccionado.precio;
        localStorage.setItem('totalPrecioLibros', JSON.stringify(totalCompra));
        actualizarTotal();
        calcularEnvio(precioEnvio)
    });
}

function actualizarCantidadEnCarrito(libroId, nuevaCantidad) {
    let carrito = JSON.parse(localStorage.getItem("Carrito"));
    let libroIndex = carrito.findIndex(libro => libro.id === libroId);

    if (libroIndex !== -1) {
        carrito[libroIndex] = { ...carrito[libroIndex], cantidad: nuevaCantidad };
        localStorage.setItem("Carrito", JSON.stringify(carrito));
    }
}


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
}

iniciarCarrito();
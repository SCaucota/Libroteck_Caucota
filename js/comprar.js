function iniciarCompra(provinciaElegida) {
    const seccionCarrito = document.querySelector(".seccionCarrito");

    const divFormExistente = document.querySelector(".divForm");

    if (!divFormExistente) {
        const divForm = document.createElement("div");
        divForm.classList.add("divForm");
        divForm.innerHTML = `
            <h4>Se requieren algunos datos para poder generar su compra:</h4>
            <form action="finalizarCompra">
                <div class="inputForm" id="nombreDiv">
                    <label for="nombre">Nombre:</label>
                    <input class="formInput" id="nombre" type="text">
                </div>
                <div class="inputForm" id="apellidoDiv">
                    <label for="apellido">Apellido:</label>
                    <input class="formInput" id="apellido" type="text">
                </div>
                <div class="inputForm" id="telefonoDiv">
                    <label for="telefono">Teléfono:</label>
                    <input class="formInput" id="telefono" type="number">
                </div>
                <div class="inputForm">
                    <label for="formasPago">Forma De Pago:</label>
                    <select name="opcionesFormaPago" id="FormaDePago">
                        <option value="Transferencia">Transferencia</option>
                        <option value="Debito">Débito</option>
                        <option value="Credito">Crédito</option>
                    </select>
                </div>
                <div class="inputForm provinciaData">
                    <label class="provinciaEscogida" for="provincia">Provincia:</label>
                    <p class="nombreProvincia">${provinciaElegida}</p>
                </div>
                <div class="inputForm" id="direccionDiv">
                    <label for="direccion">Dirección:</label>
                    <input class="formInput" id="direccion" type="text">
                </div>
            </form>
            <div>
                <button id="finalizarCompra" class="btn finCompra">Finalizar Compra</button>
            </div>`;

        seccionCarrito.appendChild(divForm);
    }

    let button = document.getElementById("finalizarCompra");
    button.addEventListener("click", function () {
        finCompra(provinciaElegida)
    });
}

function finCompra(proviciaElegida) {
        const seccionCarrito = document.querySelector(".seccionCarrito");

        const nombreInput = document.getElementById("nombre");
        const apellidoInput = document.getElementById("apellido");
        const telefonoInput = document.getElementById("telefono");
        const direccionInput = document.getElementById("direccion");
        let selectFP = document.getElementById("FormaDePago");

        localStorage.setItem('Nombre Cliente', JSON.stringify(nombreInput.value));
        localStorage.setItem('Apellido Cliente', JSON.stringify(apellidoInput.value));
        localStorage.setItem('Telefono Cliente', JSON.stringify(telefonoInput.value));
        localStorage.setItem('Forma De Pago Cliente', JSON.stringify(selectFP.value));
        localStorage.setItem('Provincia Cliente', JSON.stringify(proviciaElegida));
        localStorage.setItem('Direccion Cliente', JSON.stringify(direccionInput.value));

        let nombre = JSON.parse(localStorage.getItem('Nombre Cliente'));
        let apellido = JSON.parse(localStorage.getItem('Apellido Cliente'));
        let telefono = JSON.parse(localStorage.getItem('Telefono Cliente'));
        let formaPago = JSON.parse(localStorage.getItem('Forma De Pago Cliente'));
        let provincia = JSON.parse(localStorage.getItem('Provincia Cliente'));
        let direccion = JSON.parse(localStorage.getItem('Direccion Cliente'));
        let listaCompra = JSON.parse(localStorage.getItem('Carrito'));
        let total = JSON.parse(localStorage.getItem('total'));

        const divResumen = document.createElement("div");
        divResumen.classList.add("divResumen");
        divResumen.innerHTML = `
        <h2>¡Listo!</h2>
        <div class="dato">
            <h5>Nombre: </h5>
            <p>${nombre}</p>
        </div>
        <div class="dato">
            <h5>Apellido: </h5>
            <p>${apellido}</p>
        </div>
        <div class="dato">
            <h5>Telefono: </h5>
            <p>${telefono}</p>
        </div>
        <div class="dato">
            <h5>Forma de Pago: </h5>
            <p>${formaPago}</p>
        </div>
        <div class="dato">
            <h5>Provincia: </h5>
            <p>${provincia}</p>
        </div>
        <div class="dato">
            <h5>Direccion: </h5>
            <p>${direccion}</p>
        </div>
        <h3>Lista de Compra:</h3>`;

        listaCompra.forEach(libro => {
            const divLibro = document.createElement("div");

            divLibro.innerHTML = `
            <div class="dato">
                <h5 class="card-title">${libro.nombre}</h5>
                <h5>x${libro.cantidad}</h5>
            </div>`;

            divResumen.appendChild(divLibro);
        });

        const totalP = document.createElement('h3');
        totalP.textContent = 'Total: $'+ total;
        divResumen.appendChild(totalP);

        const despedida = document.createElement('h2');
        despedida.textContent = '¡Muchas gracias Por Comprar Con Nosotros!';
        divResumen.appendChild(despedida);

        seccionCarrito.appendChild(divResumen)
}
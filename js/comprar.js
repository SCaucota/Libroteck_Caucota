function iniciarCompra(provinciaElegida) {

    const seccionCarrito = document.querySelector("#seccionCarrito");

    const divFormExistente = seccionCarrito.querySelector(".divForm");

    if (!divFormExistente) {

        const camposFormulario = [
            { id: "nombre", label: "Nombre", type: "text", clave: "Nombre Cliente" },
            { id: "apellido", label: "Apellido", type: "text", clave: "Apellido Cliente" },
            { id: "telefono", label: "Teléfono", type: "number", clave: "Telefono Cliente" },
            { id: "FormaDePago", label: "Forma De Pago", type: "select", options: ["Elige...", "Transferencia", "Débito", "Crédito"], clave: "Forma De Pago Cliente" },
            { id: "direccion", label: "Dirección", type: "text", clave: "Direccion Cliente" }
        ];

        const divForm = document.createElement("div");
        divForm.classList.add("divForm");

        const tituloForm = document.createElement("h4");
        tituloForm.textContent = "Se requieren algunos datos para poder generar su compra:";

        const form = document.createElement("form");
        form.id = "form";

        camposFormulario.forEach(campo => {
            const divInput = document.createElement("div");
            divInput.id = `${campo.id}Div`;
            divInput.classList.add("inputForm");
            if (campo.type === "select") {
                divInput.innerHTML = `
                    <label for="${campo.id}">${campo.label}:</label>
                    <select class="form-select" name="${campo.id}" id="${campo.id}">
                        ${campo.options.map((option) => `<option value="${option}">${option}</option>`).join('')}
                    </select>`;
            } else {
                divInput.innerHTML = `
                    <label for="${campo.id}">${campo.label}:</label>
                    <input class="formInput form-control" value="${localStorage.getItem(campo.clave) ? JSON.parse(localStorage.getItem(campo.clave)) : ''}" id=${campo.id} type="${campo.type}" required>`;
            }

            form.appendChild(divInput);
        });

        const provinciaDataDiv = document.createElement("div");
        provinciaDataDiv.classList.add("inputForm", "provinciaData");
        provinciaDataDiv.innerHTML = `
            <label class="provinciaEscogida" for="provincia">Provincia:</label>
            <p class="nombreProvincia">${provinciaElegida}</p>
        `;

        const button = document.createElement("button");
        button.id = "finalizarCompra";
        button.classList.add("btn");
        button.classList.add("finCompra");
        button.textContent = "Finalizar Compra";

        form.appendChild(provinciaDataDiv);
        form.appendChild(button);
        divForm.appendChild(tituloForm);
        divForm.appendChild(form);
        seccionCarrito.appendChild(divForm);

        /* const divForm = document.createElement("div");
        divForm.classList.add("divForm");
        divForm.innerHTML = `
            <h4>Se requieren algunos datos para poder generar su compra:</h4>
            <form>
                <div class="inputForm" id="nombreDiv">
                    <label for="nombre">Nombre:</label>
                    <input class="formInput form-control" value=${JSON.parse(localStorage.getItem("Nombre Cliente"))} id="nombre" type="text" required>
                </div>
                <div class="inputForm" id="apellidoDiv">
                    <label for="apellido">Apellido:</label>
                    <input class="formInput form-control" value=${JSON.parse(localStorage.getItem("Apellido Cliente"))} id="apellido" type="text" required>
                </div>
                <div class="inputForm" id="telefonoDiv">
                    <label for="telefono">Teléfono:</label>
                    <input class="formInput form-control" value=${JSON.parse(localStorage.getItem("Telefono Cliente"))}  id="telefono" type="number" required>
                </div>
                <div class="inputForm" id="FormaDePagoDiv">
                    <label for="formasPago">Forma De Pago:</label>
                    <select class="form-select" name="opcionesFormaPago" id="FormaDePago">
                        <option selected >Elige...</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Debito">Débito</option>
                        <option value="Credito">Crédito</option>
                    </select>
                </div>
                <div class="inputForm provinciaData" id>
                    <label class="provinciaEscogida" for="provincia">Provincia:</label>
                    <p class="nombreProvincia">${provinciaElegida}</p>
                </div>
                <div class="inputForm" id="direccionDiv">
                    <label for="direccion">Dirección:</label>
                    <input class="formInput form-control" value=${JSON.parse(localStorage.getItem("Direccion Cliente"))}  id="direccion" type="text" required>
                </div>
                <div>
                    <button id="finalizarCompra" class="btn finCompra">Finalizar Compra</button>
                </div>
            </form>`;

        seccionCarrito.appendChild(divForm); */
    }
    const buttonFin = document.getElementById("finalizarCompra");
    buttonFin.addEventListener("click", function (event) {
        event.preventDefault();
        if (verificarDatos()) {
            finCompra(provinciaElegida)
        }
    });
}

function manejoErrores(mensaje) {
    const errorDato = document.createElement("div");
    errorDato.classList.add("invalid-feedback");
    errorDato.textContent = mensaje;
    return errorDato;
};

function verificarDatos() {

    let valido = true;

    const camposVacios = document.querySelectorAll(".formInput:invalid");
    if (camposVacios.length > 0) {
        Swal.fire({
            title: "¡Ups! No has completado todos los campos",
            text: "Asegúrate de completar correctamente el formulario",
            icon: "warning"
        });
    }

    const campos = [
        { id: "nombre", regex: /^[A-Za-z\s'-]+$/, mensaje: "Nombre inválido" },
        { id: "apellido", regex: /^[A-Za-z\s'-]+$/, mensaje: "Apellido inválido" },
        { id: "telefono", regex: /^(0|[1-9]\d*)(\.\d+)?$/, mensaje: "Teléfono inválido" },
        { id: "FormaDePago", isValid: value => value !== "Elige...", mensaje: "Elige una opción" },
        { id: "direccion", isValid: value => value !== "", mensaje: "Ingresar dirección" }
    ];

    campos.forEach(({ id, regex, isValid, mensaje }) => {
        const divCampo = document.getElementById(`${id}Div`);
        const inputCampo = document.getElementById(id);
        const errorElement = manejoErrores(mensaje);

        const mensajesErrorDiv = divCampo.querySelectorAll(".invalid-feedback");
        mensajesErrorDiv.forEach(error => error.remove());

        if (isValid) {
            if (!isValid(inputCampo.value)) {
                valido = false;
                inputCampo.classList.add("is-invalid");
                divCampo.appendChild(errorElement);
            } else {
                errorElement.remove();
                inputCampo.classList.remove("is-invalid");
            }
        } else if (!regex.test(inputCampo.value)) {
            valido = false;
            inputCampo.classList.add("is-invalid");
            divCampo.appendChild(errorElement);
        } else {
            errorElement.remove();
            inputCampo.classList.remove("is-invalid");
        }
    });

    return valido;
}

/* function inhabilitarInputs() {
    const camposInhabilitar = [
        "nombre",
        "apellido",
        "telefono",
        "FormaDePago",
        "direccion"
    ];

    camposInhabilitar.forEach(id => {
        const inputCampo = document.getElementById(id);
        if (inputCampo) {
            inputCampo.disabled = true;
        }
    })
} */

function finCompra(proviciaElegida) {

    Swal.fire({
        title: "Estás apunto de confirmar tu compra",
        text: "Una vez confirmada no es posible cancelarse",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "¡Compra exitosa!",
                text: "Muchas gracias por comprar con nostoros. Lo/la mantendremos informado del envio",
                icon: "success"
            });

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

            /* inhabilitarInputs(); */

            mostrarResumenCompra();
        }
    });
}

function mostrarResumenCompra() {
    const seccionCarrito = document.querySelector("#seccionCarrito");

    let listaCompra = JSON.parse(localStorage.getItem('Carrito'));
    let total = JSON.parse(localStorage.getItem('total'));

    const divOverlay = document.createElement("div");
    divOverlay.classList.add("overlay");

    const divResumen = document.createElement("div");
    divResumen.id = "seccionResumen";
    divResumen.classList.add("divResumen");

    const tituloResumen = document.createElement("h1");
    tituloResumen.textContent = "Resumen De Compra";

    divResumen.appendChild(tituloResumen);


    const datos = [
        { label: "Nombre", clave: "Nombre Cliente" },
        { label: "Apellido", clave: "Apellido Cliente" },
        { label: "Teléfono", clave: "Telefono Cliente" },
        { label: "Forma De Pago", clave: "Forma De Pago Cliente" },
        { label: "Provincia", clave: "Provincia Cliente" },
        { label: "Dirección", clave: "Direccion Cliente" },
    ]

    datos.forEach(dato => {
        const divDato = document.createElement("div");
        divDato.classList.add("dato");
        divDato.innerHTML = `
            <h5>${dato.label}: </h5>
            <p>${JSON.parse(localStorage.getItem(`${dato.clave}`))}</p>
        `

        divResumen.appendChild(divDato);
    })

    const subtituloResumen = document.createElement("h3");
    subtituloResumen.textContent = "Lista De Compra";

    divResumen.appendChild(subtituloResumen);

    listaCompra.forEach(libro => {
        const divLibro = document.createElement("div");

        divLibro.innerHTML = `
            <div class="dato">
                <h5 class="card-title">${libro.nombre}</h5>
                <h5>x${libro.cantidad}</h5>
            </div>`;

        divResumen.appendChild(divLibro);
    });

    const totalResumen = document.createElement('h3');
    totalResumen.textContent = 'Total: $' + total;

    const botonCerrarResumen = document.createElement("button");
    botonCerrarResumen.classList.add("btn");
    botonCerrarResumen.textContent = "Aceptar";
    botonCerrarResumen.addEventListener("click", function () {
        window.location.href = "/";

        localStorage.removeItem("Carrito");
        localStorage.removeItem("total");
        localStorage.removeItem("totalPrecioLibros");
    })

    divResumen.appendChild(totalResumen);
    divResumen.appendChild(botonCerrarResumen);
    divOverlay.appendChild(divResumen);
    seccionCarrito.appendChild(divOverlay);
}
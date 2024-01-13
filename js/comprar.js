function iniciarCompra(provinciaElegida) {

    const seccionCarrito = document.getElementById("seccionCarrito");

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
        form.classList.add("formDataCliente");
        form.id = "form";

        camposFormulario.forEach(campo => {
            const divInput = document.createElement("div");
            divInput.id = `${campo.id}Div`;
            divInput.classList.add("inputForm");
            if (campo.type === "select") {
                divInput.innerHTML = `
                    <label for="${campo.id}">${campo.label}:</label>
                    <select class="form-select" name="${campo.id}" id="${campo.id}">
                        ${campo.options.map((option) => `<option value="${option}">${option}</option>`).join("")}
                    </select>`;
            } else {
                divInput.innerHTML = `
                    <label for="${campo.id}">${campo.label}:</label>
                    <input class="formInput form-control" value="${localStorage.getItem(campo.clave) ? JSON.parse(localStorage.getItem(campo.clave)) : ""}" id=${campo.id} type="${campo.type}" required>`;
            }

            form.appendChild(divInput);
        });

        const provinciaDataDiv = document.createElement("div");
        provinciaDataDiv.classList.add("inputForm", "provinciaData");
        provinciaDataDiv.innerHTML = `
            <label class="provinciaEscogida" for="provincia">Provincia:</label>
            <h5 class="nombreProvincia">${provinciaElegida}</h5>
        `;

        const button = document.createElement("button");
        button.id = "finalizarCompra";
        button.classList.add("btn", "finCompra");
        button.textContent = "Finalizar Compra";

        form.appendChild(provinciaDataDiv);
        divForm.appendChild(tituloForm);
        divForm.appendChild(form);
        divForm.appendChild(button);
        seccionCarrito.appendChild(divForm);
    }
    const buttonFin = document.getElementById("finalizarCompra");
    buttonFin.addEventListener("click", (event) => {
        event.preventDefault();
        if (verificarDatos()) {
            finCompra(provinciaElegida)
        }
    });
};

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
        sweetAlertMensaje("¡Ups! No has completado todos los campos", "Asegúrate de completar correctamente el formulario", "warning");
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
};

function finCompra(proviciaElegida) {
    sweetAlertMensaje("Estás apunto de confirmar tu compra", "Una vez confirmada no es posible cancelarse", "question", "Confirmar")
        .then((result) => {
            if (result.isConfirmed) {
                sweetAlertMensaje("¡Compra exitosa!", "Muchas gracias por comprar con nostoros. Lo/la mantendremos informado del envio", "success");

                const nombreInput = document.getElementById("nombre");
                const apellidoInput = document.getElementById("apellido");
                const telefonoInput = document.getElementById("telefono");
                const direccionInput = document.getElementById("direccion");
                let selectFP = document.getElementById("FormaDePago");

                localStorage.setItem("Nombre Cliente", JSON.stringify(nombreInput.value));
                localStorage.setItem("Apellido Cliente", JSON.stringify(apellidoInput.value));
                localStorage.setItem("Telefono Cliente", JSON.stringify(telefonoInput.value));
                localStorage.setItem("Forma De Pago Cliente", JSON.stringify(selectFP.value));
                localStorage.setItem("Provincia Cliente", JSON.stringify(proviciaElegida));
                localStorage.setItem("Direccion Cliente", JSON.stringify(direccionInput.value));

                mostrarResumenCompra();
            }
        });
};

function mostrarResumenCompra() {
    const seccionCarrito = document.getElementById("seccionCarrito");

    let listaCompra = JSON.parse(localStorage.getItem("Carrito"));
    let total = JSON.parse(localStorage.getItem("total"));

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
        `;
        divResumen.appendChild(divDato);
    })

    const subtituloResumen = document.createElement("h3");
    subtituloResumen.textContent = "Lista De Compra";

    divResumen.appendChild(subtituloResumen);

    listaCompra.forEach(libro => {
        const divLibro = document.createElement("div");

        divLibro.innerHTML = `
            <div class="dato">
                <h5 class="card-title">- ${libro.nombre}</h5>
                <h5>x${libro.cantidad}</h5>
            </div>`;

        divResumen.appendChild(divLibro);
    });

    const totalResumen = document.createElement("h3");
    totalResumen.classList.add("totalResumen")
    totalResumen.textContent = "Total: $" + formatearPrecio(total);

    const botonCerrarResumen = document.createElement("button");
    botonCerrarResumen.classList.add("btn");
    botonCerrarResumen.textContent = "Aceptar";
    botonCerrarResumen.addEventListener("click", () => {
        window.location.href = "/";

        compraPrevia();

        localStorage.removeItem("Carrito");
        localStorage.removeItem("total");
        localStorage.removeItem("totalPrecioLibros");
    })

    divResumen.appendChild(totalResumen);
    divResumen.appendChild(botonCerrarResumen);
    divOverlay.appendChild(divResumen);
    seccionCarrito.appendChild(divOverlay);
};

function compraPrevia() {

    const carrito = JSON.parse(localStorage.getItem("Carrito"));
    let compraPrevia = JSON.parse(localStorage.getItem("Compra Previa")) || [];

    carrito.forEach(libro => {
        let libroEnCompraPrevia = compraPrevia.find(libroPrevio => libroPrevio.id === libro.id);

        if (libroEnCompraPrevia) {
            libroEnCompraPrevia.stock -= libro.cantidad;
        } else {
            compraPrevia.push({
                id: libro.id,
                nombre: libro.nombre,
                stock: libro.stock - libro.cantidad
            });
        }
    });

    localStorage.setItem("Compra Previa", JSON.stringify(compraPrevia));
};
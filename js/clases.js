class categoria {
    constructor(id, nombre){
        this.id = id,
        this.nombre = nombre
    }
}

class provincia {
    constructor(id, nombre, costoEnvio){
        this.id = id,
        this.nombre = nombre,
        this.costoEnvio = costoEnvio
    }
}

class libroEnLista {
    constructor(id, nombre, img, cantidad, precio){
        this.id = id,
        this.nombre = nombre,
        this.img = img,
        this.cantidad = cantidad,
        this.precio = precio
    }
}

let librosSeleccionados = '';
let totalCompra = JSON.parse(localStorage.getItem('totalPrecioLibros'));
let precioEnvio = 0;
let total = 0;

const categorias = [
    new categoria(1, 'Romance'),
    new categoria(2, 'Fantasía'),
    new categoria(3, 'Ciencia Ficción'),
    new categoria(4, 'Suspenso')
];

const provincias = [
    new provincia(1, 'Buenos Aires', 3500),
    new provincia(2, 'Cordoba', 1500),
    new provincia(3, 'Santa Fe', 2500),
    new provincia(4, 'Mendoza', 2800)
]

let listaDeCompra = [];

let datosCompra = [];
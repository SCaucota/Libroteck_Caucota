class libro {
    constructor(id, nombre, precio, idCategoria, stock, img){
        this.id = id,
        this.nombre = nombre,
        this.precio = precio,
        this.idCategoria = idCategoria,
        this.stock = stock,
        this.img = img
    }
}

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

let libros = [
    new libro(1, 'Bajo La Misma Estrella', 8999, 1, 10, './img/bajo la misma estrella.jpg'),
    new libro(2, 'Yo Antes De Ti', 17799, 1, 12, './img/Yo Antes De Ti.jpg'),
    new libro(3, 'Eleanor Y Park', 18000, 1, 15, './img/eleanor y park.jpg'),
    new libro(4, 'Si Decido Quedarme', 8899, 1, 20, './img/Si decido quedarme.jpg'),
    new libro(5, 'Harry Potter Y La Piedra Filosofal', 15599, 2, 5, './img/Harry Potter y la piedra filosofal.jpg'),
    new libro(6, 'La Selección', 12899, 2, 8, './img/la seleccion.jpg'),
    new libro(7, 'El Hobbit', 10200, 2, 10, './img/el hobbit.jpg'),
    new libro(8, 'La Quinta Ola', 15479, 3, 3, './img/la quinta ola.jpg'),
    new libro(9, 'Los Juegos Del Hambre', 11519, 3, 11, './img/los juegos del hambre.jpg'),
    new libro(10, 'Maze Runner', 10600, 3, 15, './img/maze runner.jpg'),
    new libro(11, 'Cinder', 10250, 3, 5, './img/cinder.jpg'),
    new libro(12, 'Escrito En El Agua', 9100, 4, 3, './img/escrito en el agua.jpg'),
    new libro(13, 'La Chica Del Tren', 10500, 4, 6, './img/La Chica Del Tren.jpg'),
    new libro(14, '¿Quién Mató A Alex?', 15579, 4, 6, './img/quien mato a alex.jpg')
];

const provincias = [
    new provincia(1, 'Buenos Aires', 3500),
    new provincia(2, 'Cordoba', 1500),
    new provincia(3, 'Santa Fe', 2500),
    new provincia(4, 'Mendoza', 2800)
]

let listaDeCompra = [];

let datosCompra = [];
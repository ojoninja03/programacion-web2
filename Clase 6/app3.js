// var miCarro = new Object();
// miCarro.marca = 'Toyota'; 
// miCarro.modelo = 'supra'; 
// miCarro.color = 'rojo'; 
// console.log(miCarro);

// let frutas=["banana", "manzana", "pera"];
// console.log(frutas);

// var miCarro={
//     marca: 'Toyota',
//     modelo: 'Supra',
//     color: 'rojo'
// }
// console.log(miCarro);

var perro = {
    nombre: 'Shayla',
    color: 'Sal pimienta',
    edad: 28,
    talla: 'mdeiana',
    enemigos: ["Otro perro", "gatos", "baños"]
}
console.log(perro);
// console.log(perro.color);
// console.log(perro.enemigos[1]);
perro.raza='schnuzer';

console.log(perro);

console.log(perro.edad);

perro.edad=35;
console.log(perro.edad);

delete perro.edad;
console.log(perro);
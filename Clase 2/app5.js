let Numero1 = prompt("Ingresa un numero")
let Numero2 = prompt("Ingresa otro numero ")
let Numero3 = prompt("Ingresa otro numero ")
let mayor, menor;

if (Numero1 == Numero2 == Numero3){
      console.log("Son iguales")
}if(Numero1 == Numero2 < Numero3){
    console.log("Los primeros 2 digitos son iguales")
}if(Numero1 > Numero2 == Numero3){
    console.log("Los ultimos 2 digitos son iguales")
}if(Numero1 == Numero3 < Numero2){
    console.log("El primero y el ultimo digito son iguales")
}if (Numero1 >= Numero2 && Numero1 >= Numero3) {
    mayor = Numero1;
    console.log("El mayor es" + mayor)
} else if (Numero2 >= Numero1 && Numero2 >= Numero3) {
    mayor = Numero2;
    console.log("El mayor es" + mayor)
} else {
    mayor = Numero3;
    console.log("El mayor es" + mayor)
}if (Numero1 <= Numero2 && Numero1 <= Numero3) {
    menor = Numero1;
    console.log("El menor es" + menor)
} else if (Numero2 <= Numero1 && Numero2 <= Numero3) {
    menor = Numero2;
    console.log("El menor es" + menor)
} else {
    menor = Numero3;
    console.log("El menor es" + menor)
}

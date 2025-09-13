const frutas = ["Banana"];
//frutas.push("sandia");
frutas.unshift("sandia");
frutas.push("pera");
frutas.unshift("mango");
frutas.push("fresa");

console.log(frutas);

for (let fruta of frutas){
    console.log(fruta);
}

console.log("-----------------------------------");
frutas.pop();

for (let fruta of frutas){
    console.log(frutas);
}


console.log("-----------------------------------");
frutas.shift();
for(let fruta of frutas) {
    console.log(fruta);
}

// const puerto = 3306;
// puerto = 3308
// console.log(puerto);


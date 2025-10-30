let turno = "X";
let juegoActivo = true;

const mensaje = document.getElementById("mensaje");

const combinaciones = [
    ["c1", "c2", "c3"], 
    ["c4", "c5", "c6"], 
    ["c7", "c8", "c9"], 
    ["c1", "c4", "c7"], 
    ["c2", "c5", "c8"], 
    ["c3", "c6", "c9"], 
    ["c1", "c5", "c9"], 
    ["c3", "c5", "c7"]  
];


for (let i = 1; i <= 9; i++) {
    
    let celda = document.getElementById(`c${i}`);
    
    celda.addEventListener("click", function() {

        if (celda.textContent === "" && juegoActivo) {

            celda.textContent = turno;

            verificarGanador();

            turno = (turno === "X") ? "O" : "X"; 
        }
    });
}

function verificarGanador() {

    for (let combo of combinaciones) {

        const [a, b, c] = combo.map(id => document.getElementById(id).textContent);

        if (a && a === b && a === c) {
            mensaje.textContent = `Jugador ${a} gana!`;
            juegoActivo = false;
            return; 
        }
    }

const todasLlenas = Array.from(document.querySelectorAll("td")) 

                         .every(celda => celda.textContent !== ""); 

if (todasLlenas) {
    mensaje.textContent = "¡Empate!";
    juegoActivo = false;
}

}

document.getElementById("reiniciar").addEventListener("click", function() {

    for (let i = 1; i <= 9; i++) {
        document.getElementById(`c${i}`).textContent = "";
    }

    turno = "X";

    juegoActivo = true;

    mensaje.textContent = "";
});

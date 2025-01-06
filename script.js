
const celle = document.querySelectorAll(".container > div");
const statoAttuale = document.querySelector("h2");
const btnReset = document.querySelector("button");

const segni = { player : "X", cpu : "O" };
let celleOccupate = { player : [], cpu : [] }; // celle segni giocatori

let inCorso = false;
let turnoAttuale;     // 0 player - 1 cpu  

const combVittorie = [
  [ 0, 1, 2 ], // 1° riga orizzontale
  [ 3, 4, 5 ], // 2° riga orizzontale
  [ 6, 7, 8 ], // 3° riga orizzontale

  [ 0, 3, 6 ], // 1° riga verticale
  [ 1, 4, 7 ], // 2° riga verticale
  [ 2, 5, 8 ], // 3° riga verticale

  [ 0, 4, 8 ], // 1° riga diagonale
  [ 2, 4, 6 ], // 2° riga diagonale
];



function startGame(){

  // Evento click su ogni elemento NodeList
  for( let c of celle ){ c.addEventListener("click", cellaPremuta) };

  // Evento click su button
  btnReset.addEventListener("click", restartGame)

  turnoAttuale = 0;   // Turno player 
  printStatus();      // Mostra turno attuale 
  inCorso = true;     // Stato gioco ( iniziato )

}



function cellaPremuta(){

  // Cella è vuota && gioco in corso 
  if( this.textContent === "" && inCorso === true ){ 

    // Inserisce simbolo giocatore + salva cella in array 
    if( turnoAttuale === 0 ){ this.textContent = segni.player;  celleOccupate.player.push(this); }
    else { this.textContent = segni.cpu; celleOccupate.cpu.push(this);  }

    rimuoviSegno();         // Verifica n. segni player / cpu 
    checkWin();             // Verifica se c'è un vincitore
  }

  // Cella non vuota && gioco in corso && turno cpu --> cpu fa click su cella occupata ( rifai click random ) 
  else if( this.textContent != "" && inCorso === true && turnoAttuale === 1 ){ sceltaCPU(); }

}



// Rimuove segno player / cpu se n. segni > 3 
function rimuoviSegno(){

  // Itera su ogni chiave giocatore per controllare n. segni
  for( let chiave in celleOccupate){

    if( celleOccupate[chiave].length > celle.length / 3){
      celleOccupate[chiave][0].textContent = ""; // Rimuove segno dalla cella
      celleOccupate[chiave].shift();             // Rimuove la cella dall'array
    }

  };
}

  

function checkWin(){

  let vincita = false; // Se c'è una vincita 
  let vuote = false;   // Se ci sono celle vuote

  // Itera su ogni combinazione vincente
  for( let condizione of combVittorie ){

    // Legge contenuto celle della condizione
    const cellA = celle[condizione[0]].textContent;
    const cellB = celle[condizione[1]].textContent;
    const cellC = celle[condizione[2]].textContent;

    // Celle contenuto "" salta iterazione + salvi esistenza celle vuote
    if( cellA === "" || cellB === "" || cellC === "" ){ vuote = true; continue }

    // Celle uguale contenuto interrompe loop ( vincita )
    if( cellA === cellB && cellB === cellC ){ vincita = true; break }

  }

  // Se c'è una vincinta 
  if( vincita ){ printStatus("Vittoria"); inCorso = false; }

  // No vincita + no celle vuote 
  else if( !vincita && !vuote ){ printStatus("Patta"); inCorso = false; }

  // No vincinta / no patta --> continua gioco 
  else{ switchPlayer(); }

}



function switchPlayer(){

  // Turno concluso player ( 0 ) --> switch a cpu + genera click casuale 
  // Turno concluso cpu ( 1 )    --> switch a player
  if( turnoAttuale === 0 ){ turnoAttuale = 1; sceltaCPU(); }
  else{ turnoAttuale = 0 };

  printStatus();  
}



function printStatus( esito ){

  let playerAttuale;

  if( turnoAttuale === 0 ){ playerAttuale = "Player"}
  else if( turnoAttuale === 1){ playerAttuale = "Cpu"; }

  if( esito === "Patta"){ statoAttuale.textContent = "Patta" }
  else if( esito === "Vittoria" ){ statoAttuale.textContent = `${playerAttuale} Vince!`}
  else{ statoAttuale.textContent = `${playerAttuale} turno` }

}



function sceltaCPU(){
  setTimeout( () => { 
    
    // Genera n. casuale tra 0 - max. n. celle 
    let random = Math.floor( Math.random() * celle.length);

    // Simula evento click su cella random
    celle[random].click();

  }, 100 );
}



function restartGame(){
  turnoAttuale = 0;                                   // Reset turno player
  printStatus();                                      // Reset testo attuale turno
  celle.forEach( (cell) => { cell.textContent = ""} ) // Reset contenuto celle
  for( let chiave in celleOccupate ){ celleOccupate[chiave] = []; } // Reset celle segni giocatori
  inCorso = true;                                     // Re-start game
}


startGame();



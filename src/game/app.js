import { observer, destroyer, isVisibleList, theConstrutor, newDificult } from "./game.js";
import { player, locateFile, defaultPlaylist } from "../music/player.js";
import {writerLocal, readLocal} from "../manager/writer.js";

const elementButton = document.querySelector('#tg_film #click')
const cgContainer = document.getElementById("janela_config")
const cgElements = document.getElementsByClassName("cg_element")
const cgButtonSave = document.getElementById("cg_buttonSave")
const cgButtonBack = document.getElementById("cg_buttonBack")
const gameDiv = document.getElementById("gameDiv")

const audioElement = document.getElementById('player')
const musicVolElement = document.getElementById('musicVolume')

let isPaused = false

function hideElements(elements/*Array*/) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none"
    }
}

function showElements(elements/*Array*/) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "flex"
    }
}

function janelaConfig(command){
    if (command === "show") {
        cgContainer.style.display = "flex"
        cgContainer.style.zIndex = "99"
        showElements(cgElements);
    }
    else if (command === "hide") {
        hideElements(cgElements);
        cgContainer.style.display = "none"
    }
    else {
        console.log(`func janelaConfig >> commando string ${command} desconhecido`)
    }
}

function gamePause() {
    isPaused = !isPaused;
    if (isPaused) {
        janelaConfig("show")
        gameDiv.classList.add('jogo-pausado');
    }
    else {
        janelaConfig("hide")
        gameDiv.classList.remove('jogo-pausado');
    }
}

//função para rodar o fluxo assíncrono
async function inicializar() {
    // Inicia o sistema que limpa as letras da tela
    observer("game");
    theConstrutor("game",10,120)
    
    /*Atualizando elementos da janela config */
    musicVolElement.value = readLocal("config","musicVolume")

    // Aguarda a playlist ser carregada do JSON antes de entregar ao player
    const playlistReal = await locateFile(defaultPlaylist,'json');
    
    // Inicia a música passando o array
    player(playlistReal);
}

// Dá o pontapé inicial no jogo de forma automática
inicializar();

// Captura o teclado do jogador (Sua lógica original exata)
document.addEventListener('keydown', function(clicked) {
    destroyer(clicked.key, isVisibleList);
    if (clicked.key === 'Escape') {
        gamePause();
    }
});

elementButton.addEventListener('click', function(event) {
    /*REDIRECIONA PARA A PÁGINA HOME*/
    window.location.replace('../../index.html');
});

        
cgButtonSave.addEventListener('click', function(event) {
    janelaConfig("hide")
    gamePause();
});
cgButtonBack.addEventListener('click', function(event) {
    window.location.replace('../../index.html');
});

musicVolElement.addEventListener('input', function(event){
    writerLocal('update','musicVolume',event.target.value)
    audioElement.volume = event.target.value;
})



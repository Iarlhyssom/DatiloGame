import { observer, destroyer, isVisibleList } from "./game.js";
import { player, carregarPlaylist } from "../music/player.js";

//função para rodar o fluxo assíncrono
async function inicializar() {
    // Inicia o sistema que limpa as letras da tela
    observer("game");

    // Aguarda a playlist ser carregada do JSON antes de entregar ao player
    const playlistReal = await carregarPlaylist();
    
    // Inicia a música passando o array
    player(playlistReal);
}

// Dá o pontapé inicial no jogo de forma automática
inicializar();

// Captura o teclado do jogador (Sua lógica original exata)
document.addEventListener('keydown', function(clicked) {
    console.log(isVisibleList)
    destroyer(clicked.key, isVisibleList);
});

const elementButton = document.querySelector('#tg_film #click')
elementButton.addEventListener('click', function(event) {
    /*REDIRECIONA PARA A PÁGINA HOME*/
    window.location.replace('../../test.html');
});
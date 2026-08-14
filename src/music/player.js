import { theConstrutor } from '../game/game.js';

const audioContext = new AudioContext();
const audioElement = document.getElementById('player');

const source = audioContext.createMediaElementSource(audioElement);
const analyser = audioContext.createAnalyser();
analyser.fftSize = 32;

source.connect(analyser);
analyser.connect(audioContext.destination);

//Variáveis globais
const dados = new Uint8Array(analyser.frequencyBinCount);
let hitvalor = 0; 
const cont = document.getElementById('seu-id-do-contador'); 

//Função utilitária para permitir a pausa de 3 segundos
const delay = ms => new Promise(res => setTimeout(res, ms));

export async function player(playlist) {    
    console.log("funcao player on")

    for (let i = 0; i < playlist.length; i++) {
        console.log("for iniciado")
        
        //Ajustado para playlist[i] para avançar as músicas do array
        audioElement.src = playlist[i].local;
        audioElement.load();
        
        try {
            audioElement.play();
        } catch (error){
            console.warn("Autoplay bloqueado", error);
        }
        
        console.log(`Tocando agora: ${playlist[i].local}`);

        //impede que o 'for' pule para a próxima música em 1 milissegundo
        await new Promise(resolve => {
            audioElement.onended = resolve;
        });


        //loop para por 3 segundos entre as músicas
        // ==========================================
        console.log("Música encerrada. Aguardando 3 segundos...");
        await delay(3000);
    }
}

export async function carregarPlaylist() {
    // Cria um link dinâmico absoluto baseado na pasta onde o player.js está salvo
    const urlJson = new URL('./local/standardPlaylist/standardPlaylist.json', import.meta.url).href;
    
    const local = await fetch(urlJson);
    const playlist = await local.json();
    return playlist;
}

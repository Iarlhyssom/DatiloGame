import { the_game } from '../game/game.js';

const audioContext = new AudioContext();
const audioElement = document.getElementById('player');

const source = audioContext.createMediaElementSource(audioElement);
const analyser = audioContext.createAnalyser();
analyser.fftSize = 32;

source.connect(analyser);
analyser.connect(audioContext.destination);

//Variáveis globais para que 'checarRitmo' consiga acessá-las
const dados = new Uint8Array(analyser.frequencyBinCount);
let hitvalor = 0; 
const cont = document.getElementById('seu-id-do-contador'); 

//Função utilitária para permitir a pausa de 3 segundos
const delay = ms => new Promise(res => setTimeout(res, ms));

export async function player(playlist) {    
    //Ativa o áudio e o loop de ritmo antes do loop das músicas
    await audioContext.resume();
    checarRitmo(); 
    console.log("funcao player on")

    for (let i = 0; i < playlist.length; i++) {
        console.log("for iniciado")
        
        //Ajustado para playlist[i] para avançar as músicas do array
        audioElement.src = playlist[i].local;
        
        audioElement.load();
        audioElement.play();

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

let contFrames = 0;
function checarRitmo() {
    
    requestAnimationFrame(checarRitmo); 
    
    analyser.getByteFrequencyData(dados); 

    //Reseta o valor a cada frame para não acumular infinitamente
    hitvalor = 0; 

    for (let i = 0; i < dados.length; i++) {
        hitvalor = hitvalor + dados[i];
    }

    hitvalor = Math.floor(hitvalor / 255);
    hitvalor = Math.floor(hitvalor * 100);
    hitvalor = Math.floor(hitvalor / 100);
    hitvalor = Math.floor(hitvalor * 26);
    hitvalor = Math.floor(hitvalor / 8);
    contFrames++;
    
    if (contFrames >= 240){
        the_game(hitvalor);
        contFrames = 0;
    }
}
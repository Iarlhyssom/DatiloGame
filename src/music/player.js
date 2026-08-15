import {writerLocal, readLocal} from "../manager/writer.js"

const audioContext = new AudioContext();
const audioElement = document.getElementById('player');

export const defaultPlaylist = './local/standardPlaylist/standardPlaylist.json';
const defaultuiMusic = './local/uiMusics/Courage(8-Bit-Remix).mp3';

//Função utilitária para permitir a pausa de 3 segundos
const delay = ms => new Promise(res => setTimeout(res, ms));

export async function player(playlist) {    
    let volume = readLocal('config','musicVolume')
    audioElement.volume = volume

    for (let i = 0; i < playlist.length; i++) {
        
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

export async function locateFile(caminho,type) {
    // Cria um link dinâmico absoluto baseado na pasta onde o player.js está salvo
    const urlFile = new URL(caminho, import.meta.url).href;
    const local = await fetch(urlFile);
    let file;
    if (type === 'json') {
        file = await local.json();
        return file;
    }
    else if (type === 'mp3') {
        file = local.url
        return file;
    }
    
}

export async function uiPlayer(command, music, loop = true) {
    let volume = readLocal('config','musicVolume')
    audioElement.volume = volume
    audioElement.loop = loop;
    if (music != undefined && command != undefined) {
        switch (music) {
            case "default":
                audioElement.src = await locateFile(defaultuiMusic,'mp3');
                audioElement.load();
                playerController(command)
                break;
                
            default:
                audioElement.src = await locateFile(defaultuiMusic,'mp3');
                audioElement.load();
                playerController(command)
                console.log("func uiPlayer [erro no arg 2 executando switch default]")
                break;
        }
    }
    else {
        console.log(`func uiPlayer ['arg 1' valor: '${command}' invalido or 'arg 2' valor: '${music}' invalido ]`)
    }
}

export function playerController(command) {
    console.log(command)
    if (command === "play") {
        audioElement.play();
    }
    else if (command === "pause") {
        audioElement.pause();
    }
    else if (command === "stop") {
        audioElement.pause();
        audioElement.removeAttribute('src');
        audioElement.load();
        return "stoped"
    }
    else {console.log(`func uiPlayer ['arg 1' valor: '${command}' invalido ]`)}
}



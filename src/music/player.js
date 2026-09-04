import { writerLocal, readLocal } from "../manager/writer.js";

const audioContext = new AudioContext();
const audioElement = document.getElementById('player');

export const defaultPlaylist = './local/standardPlaylist/standardPlaylist.json';
const defaultuiMusic = './local/uiMusics/Courage(8-Bit-Remix).mp3';

// Função utilitária para permitir a pausa de 3 segundos
const delay = ms => new Promise(res => setTimeout(res, ms));

export async function player(playlistInput, loop = false) {
    let volumeAtual = readLocal('tag', 'musicVolume');
    let volume = volumeAtual[0]['musicVolume'];
    audioElement.volume = volume;

    let listaMusicas = [];

    // NORMALIZAÇÃO: Descobre qual formato de dado foi recebido
    if (playlistInput && Array.isArray(playlistInput.musicas)) {
        // Formato IndexedDB: { id: "teste", musicas: [File, File] }
        listaMusicas = playlistInput.musicas;
    } else if (typeof playlistInput === 'string' && playlistInput.endsWith('.json')) {
        // Formato String: Caminho do arquivo JSON
        const jsonLido = await locateFile(playlistInput, 'json');
        listaMusicas = Array.isArray(jsonLido) ? jsonLido : (jsonLido.musicas || []);
        console.log(listaMusicas)
    } else if (Array.isArray(playlistInput)) {
        // Formato Array: Um array json já traduzido/passado diretamente
        listaMusicas = playlistInput;
    } else {
        console.error("Formato de playlist não suportado:", playlistInput);
        return;
    }

    if (listaMusicas.length === 0) {
        console.warn("A playlist está vazia.");
        return;
    }

    // REPRODUÇÃO
    do {
        for (let i = 0; i < listaMusicas.length; i++) {
            const item = listaMusicas[i];
            let audioUrl = '';
            let isBlobUrl = false;

            // Suporta tanto objetos File do IndexedDB quanto caminhos de string/objetos com .local
            if (item instanceof File) {
                audioUrl = URL.createObjectURL(item);
                isBlobUrl = true;
            } else if (item?.file instanceof File) {
                audioUrl = URL.createObjectURL(item.file);
                isBlobUrl = true;
            } else {
                audioUrl = item.local || item;
            }

            audioElement.src = audioUrl;
            audioElement.load();

            try {
                await audioElement.play();
            } catch (error) {
                console.warn("Autoplay bloqueado ou falha na reprodução:", error);
            }

            console.log(`Tocando agora: ${item.name || item.local || `Faixa ${i + 1}`}`);

            // Impede que o 'for' pule para a próxima música em 1 milissegundo
            await new Promise(resolve => {
                audioElement.onended = resolve;
            });

            // Libera a memória do navegador caso tenha sido gerada uma Blob URL do IndexedDB
            if (isBlobUrl) {
                URL.revokeObjectURL(audioUrl);
            }

            console.log("Música encerrada. Aguardando 3 segundos...");
            await delay(3000);
        }
    } while (loop);
    
}

export async function locateFile(caminho, type) {
    const urlFile = new URL(caminho, import.meta.url).href;
    const local = await fetch(urlFile);
    let file;
    if (type === 'json') {
        file = await local.json();
        return file;
    } else if (type === 'mp3') {
        file = local.url;
        return file;
    }
}

export async function uiPlayer(command, music, loop = true) {
    let volumeAtual = readLocal('tag', 'musicVolume');
    let volume = volumeAtual[0]['musicVolume'];

    audioElement.volume = volume;
    audioElement.loop = loop;
    if (music !== undefined && command !== undefined) {
        switch (music) {
            case "default":
                audioElement.src = await locateFile(defaultuiMusic, 'mp3');
                audioElement.load();
                playerController(command);
                break;

            default:
                audioElement.src = await locateFile(defaultuiMusic, 'mp3');
                audioElement.load();
                playerController(command);
                console.log("func uiPlayer [erro no arg 2 executando switch default]");
                break;
        }
    } else {
        console.log(`func uiPlayer ['arg 1' valor: '${command}' invalido or 'arg 2' valor: '${music}' invalido ]`);
    }
}

export function playerController(command) {
    if (command === "play") {
        audioElement.play();
    } else if (command === "pause") {
        audioElement.pause();
    } else if (command === "stop") {
        audioElement.pause();
        audioElement.removeAttribute('src');
        audioElement.load();
        return "stoped";
    } else {
        console.log(`func uiPlayer ['arg 1' valor: '${command}' invalido ]`);
    }
}
//* Area de importação *//
import { observer, observerLoop, isVisibleList, theConstrutor } from "../game/game.js";
import { writerLocal, readLocal } from "./writer.js"
import { uiPlayer} from "../music/player.js";
import { changeStyleColor } from "./functions.js";
import { readRanking, abrirBanco, initRanking, readPlaylists, addPlaylist } from "./dbManager.js";

//* Area de variaveis de elementos *//
const bodyArray = document.getElementsByClassName("windowDiv") /* Array com as Janelas do Index */
const jiContainer = document.getElementById("janela_inicial") /* Id da Div Container JI */
const jiButton00 = document.getElementById("button00") /* Botao da JI */
const jiElements = document.getElementsByClassName('ji_element'); /* Array de Elementos da JI */
const audioElement = document.getElementById('player')
const elementContador = document.getElementById('contador');

const jhContainer = document.getElementById("janela_home")
const jhElements = document.getElementsByClassName("jh_element")
const jhButton00 = document.getElementById("newGameButton")
const jhButton01 = document.getElementById("persoGameButton")
const jhButton02 = document.getElementById("configButton")
const jhNickName = document.querySelector("#nicknameDiv input")
const jhrankTable = document.querySelector('.ranking-table')

const jpContainer = document.getElementById("janela_pref")
const jpElements = document.getElementsByClassName("jp_element")
const jpDifSelect = document.getElementById("dificult_select")
const jpButtonPlay = document.getElementById("jp_buttonPlay")
const jpButtonBack = document.getElementById("jp_buttonBack")
const jpPlaylistSelect = document.getElementById('playlist_select')

const jmContainer = document.getElementById("janela_makePlaylist")
const jmElements = document.getElementsByClassName("jm_element")
const jmButtonSave = document.getElementById("jm_buttonSave")
const jmButtonCancel = document.getElementById("jm_buttonCancel")
const jmAddMusicButton = document.getElementById("addMusicButton")
const jmInputMusic = document.getElementById("inputMusic")
const jmMusicList = document.getElementById('musics-list');
const jmPlaylistName = document.getElementById('inputListName');
const jmPlaylistnameDiv = document.getElementById('div_playlistName');
 
const cgContainer = document.getElementById("janela_config")
const cgElements = document.getElementsByClassName("cg_element")
const cgButtonSave = document.getElementById("cg_buttonSave")
const cgButtonBack = document.getElementById("cg_buttonBack")
const musicVolElement = document.getElementById('musicVolume')

const prContainer = document.getElementById("janela_perso")
const prElements = document.getElementsByClassName("pr_element")
const prButtonSave = document.getElementById("pr_buttonSave")
const prButtonApply = document.getElementById("pr_buttonApply")
const prButtonBack = document.getElementById("pr_buttonBack")
const prPaletteBG = document.getElementById("paletaBackground")
const prPaletteBorder = document.getElementById("paletaBorder")
const prPaletteButton = document.getElementById("paletaButtons")
const prPaletteText = document.getElementById("paletaText")
const buttonPlay = document.getElementById("play_button"); /* PREFS */

//* Area de variaveis de temporarias *// 

let musicList = [];
let playlistList = [];
let styleColor = readLocal("key","styleColor")
let playlist = {playlist:"default"}

//* Area das Funcoes *//

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

function janelaInicial(command){
    if (command === "show") {
        showElements(jiElements);
        jiContainer.style.display = "flex";

        theConstrutor("static");
        observer('static');

        // Listeners de entrada única
        jiContainer.addEventListener('click', function catchMouse(event) {
            janelaInicial("hide");
            janelaHome("show");
            uiPlayer("play",uiMusicselect[0]["uiMusicName"]);
            jiContainer.removeEventListener('click', catchMouse);
        });
        document.addEventListener('keydown', function catchAll(event) {
            janelaInicial("hide");
            janelaHome("show");
            uiPlayer("play",uiMusicselect[0]["uiMusicName"]);
            document.removeEventListener('keydown', catchAll);
        });
    }
    else if (command === "hide") {
        hideElements(jiElements);
        jiContainer.style.display = "none";
        cancelAnimationFrame(observerLoop); // para o loop das letras.
    }
}

function janelaHome(command){
    if (command === "show") {
        let nameCache = readLocal("tag",'nickName') ?? [{nickName: 'guest'}];
        jhNickName.value = nameCache[0]['nickName'];

        showElements(jhElements);
        jhContainer.style.display = "flex"
    }
    else if (command === "hide") {
        hideElements(jhElements);
        jhContainer.style.display = "none"
    }
    else {
        console.log(`func janelaHome >> commando string ${command} desconhecido`)
    }
}

function janelaPref(command){
    if (command === "show") {
        jpContainer.style.display = "flex"
        jpContainer.style.zIndex = "99"
        let janelaDefault = [{dificuldade:'FACIL'}];

        writerLocal('update',"preferences",janelaDefault);
        showElements(jpElements);
    }
    else if (command === "hide") {
        hideElements(jpElements);
        jpContainer.style.display = "none"
    }
    else {
        console.log(`func janelaPref >> commando string ${command} desconhecido`)
    }
}

function janelaMakePlaylist(command){
  
    if (command === "show") {
        console.warn('show')
        jmContainer.style.display = "flex"
        jmContainer.style.zIndex = "99"
        showElements(jmElements);
        musicList = [];
    }
    else if (command === "hide") {
        let inputWarn = document.getElementById('jm_input_warn')
        musicList = [];
        hideElements(jmElements);
        jmContainer.style.display = "none"

        if (inputWarn){
            inputWarn.remove();
        }

        jmPlaylistName.value = '';
        jmMusicList.innerHTML = '';

    }
    else {
        console.log(`func janelaPref >> commando string ${command} desconhecido`)
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

function janelaPerso(command){
    if (command === "show") {
        prContainer.style.display = "flex"
        prContainer.style.zIndex = "99"
        showElements(prElements);
    }
    else if (command === "hide") {
        hideElements(prElements);
        prContainer.style.display = "none"
    }
    else {
        console.log(`func janelaPerso >> commando string ${command} desconhecido`)
    }
}

async function carregarRanking(){
    try{
        const db = await abrirBanco('datiloDB', "ranking", initRanking);
        const ranking = await readRanking()
        for (let i = 0; i < ranking.length; i++){
            jhrankTable.querySelector(`#rank${i}`).cells[1].textContent = ranking[i]['nome']
            jhrankTable.querySelector(`#rank${i}`).cells[2].textContent = ranking[i]['score']
            jhrankTable.querySelector(`#rank${i}`).cells[3].textContent = ranking[i]['ts']
            jhrankTable.querySelector(`#rank${i}`).cells[4].textContent = ranking[i]['time']
        }
    } catch (e) {
        console.warn('erro ao carregar o Ranking.',e)
    }
}

async function carregarPlaylists(){
    try{
        let defaultOption = document.createElement('option');
        let addOption = document.createElement('option');
        defaultOption.textContent = 'PLAYLIST PADRAO';
        addOption.textContent = '-- ADICIONAR PLAYLIST --';
        jpPlaylistSelect.textContent = "";

        let playlists = await readPlaylists();

        if (playlists.length > 0) {
            for (let i = 0; i < playlists.length; i++) {
                let newOption = document.createElement('option')
                newOption.textContent = playlists[i]['id']
                jpPlaylistSelect.appendChild(newOption);
                playlistList.push(playlists[i])
            }

            // trecho para organizar as options do select
            const optionsArray = Array.from(jpPlaylistSelect.options);
            optionsArray.sort((a, b) => a.text.localeCompare(b.text));
            jpPlaylistSelect.innerHTML = '';
            jpPlaylistSelect.appendChild(defaultOption);
            optionsArray.forEach(option => jpPlaylistSelect.appendChild(option));
            jpPlaylistSelect.appendChild(addOption);
            jpPlaylistSelect.selectedIndex = 0;

        } else {
            jpPlaylistSelect.appendChild(defaultOption);
            jpPlaylistSelect.appendChild(addOption);
        }
        
        
    } catch (e) {
        console.warn('erro ao carregar as playlists.',e)
    }
}

function criarPlaylist(listName, musicList){
    if (playlistList.length > 0){
        for (let i = 0; i < playlistList.length; i++){
            if (listName === playlistList[i]['id']){
                console.warn('func criarPlaylist [Nome de playlist ja existente.]');
                return "exname";
            }
        }
    }
    if (listName == undefined || listName == "" || listName.trim() == "") {
        console.log("insira um nome para a playlist",`[${listName}]`)
        return 'noname'
    } 
    else if (musicList.length > 0){
        let registro = { 
        id: listName, 
        musicas: musicList 
        };
        addPlaylist(registro);
    } else {
        console.log("insira uma musica ou mais.")
    }
    return 'complete';
};

function saveColor (cor, variavel) {
    styleColor[variavel] = cor
}

function paletteUpdate () {
    prPaletteBG.value = styleColor['bg-color']
    prPaletteBorder.value = styleColor['border-color']
    prPaletteButton.value = styleColor['button-bg']
    prPaletteText.value = styleColor['text-color']
}

// =============================
// SEÇÃO UNIFICADA DE LISTENERS 
// =============================

// --- CLIQUES DA JANELA HOME ---
jhButton00.addEventListener('click', function() { janelaPref("show"); });
jhButton01.addEventListener('click', function() { janelaPerso("show"); });
jhButton02.addEventListener('click', function() { janelaConfig("show"); });

// --- CLIQUES DA JANELA PREF ---
jpButtonPlay.addEventListener('click', function() {
    let nickname = [{nickName:jhNickName.value}];
    
    janelaPref("hide");
    janelaHome("hide");
    
    writerLocal('update','register',nickname);
    
    window.location.replace('./src/game/');
});

jpButtonBack.addEventListener('click', function() {
    janelaPref("hide");
});

jpDifSelect.addEventListener('change', function(event) {
    let theDificult = [{dificuldade:event.target.value}];
    writerLocal('update','preferences',theDificult);
});

jpPlaylistSelect.addEventListener('change', function(event) {
    let select = event.target.value;
    let thePlaylist = [{playlist: select}]
    console.log(playlist)

    writerLocal('update','preferences',thePlaylist);

    if (select === '-- ADICIONAR PLAYLIST --') {
        jpPlaylistSelect.selectedIndex = 0;
        jpContainer.style.zIndex = "98";
        janelaMakePlaylist('show');
    }
});

// --- CLIQUES DA JANELA MAKE PLAYLIST ---

jmAddMusicButton.addEventListener('click', function() {
    jmInputMusic.click();
});

jmInputMusic.addEventListener('change', function() {
    const newLabel = document.createElement('label');
    let musicName = jmInputMusic.files[0].name

    musicList.push(jmInputMusic.files[0])
    musicName = (musicName.slice(0,38)) + ("...");
    newLabel.textContent = `${musicName}`
    jmMusicList.appendChild(newLabel);
    console.log(musicName)
});

jmButtonSave.addEventListener('click', function() {
    let listName = jmPlaylistName.value
    let create = criarPlaylist(listName, musicList);
    if (create === 'complete') {
        carregarPlaylists();
        jpContainer.style.zIndex = "99";
        janelaMakePlaylist("hide");
    }
    else if (create === 'exname'){
        const label = document.createElement('label')
        label.style.color = 'red';
        label.textContent = '** Nome indisponivel **'
        label.id = 'jm_input_warn';
        jmPlaylistnameDiv.appendChild(label)

    }
    else if (create === 'noname'){
        const label = document.createElement('label')
        label.style.color = 'red';
        label.textContent = '** Campo Obrigatório **'
        label.id = 'jm_input_warn';
        jmPlaylistnameDiv.appendChild(label)
    }
    else {
        console.warn('makeplaylist [erro ...]')
    }
    
});

jmButtonCancel.addEventListener('click', function() {
    
    jpContainer.style.zIndex = "99";
    janelaMakePlaylist("hide");
});

// --- CLIQUES DA JANELA CONFIG ---
cgButtonSave.addEventListener('click', function() { janelaConfig("hide"); });
cgButtonBack.addEventListener('click', function() { janelaConfig("hide"); });

// --- CLIQUES DA JANELA PERSO ---
prButtonSave.addEventListener('click', function() { 
    changeStyleColor(styleColor)
    writerLocal('create','styleColor',styleColor)
    janelaPerso("hide"); 
});
prButtonApply.addEventListener('click', function() { 
    changeStyleColor(styleColor)
});
prButtonBack.addEventListener('click', function() { janelaPerso("hide"); });

// --- PALETAS DE CORES JANELA PERSO ---
prPaletteBG.addEventListener('change', function(){
    saveColor(this.value,'bg-color');
});
prPaletteBorder.addEventListener('change', function(){
    saveColor(this.value,'border-color');
});
prPaletteButton.addEventListener('change', function(){
    saveColor(this.value,'button-bg');
});
prPaletteText.addEventListener('change', function(){
    saveColor(this.value,'text-color');
});

// --- GERENCIADOR GLOBAL DO BOTÃO ESCAPE ---
// Identifica qual janela está aberta olhando o "display" e aplica a lógica certa
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        if (jmContainer.style.display === "flex") {
            jpContainer.style.zIndex = "99";
            janelaMakePlaylist("hide");
        } 
        else if (jpContainer.style.display === "flex") {
            janelaPref("hide");
        } 
        else if (cgContainer.style.display === "flex") {
            janelaConfig("hide");
        } 
        else if (prContainer.style.display === "flex") {
            janelaPerso("hide");
        }
    }
});

// --- VOLUMES E CONFIGURAÇÕES DE AUDIO ---
musicVolElement.addEventListener('input', function(event){
    let volumeAtual = [{musicVolume:event.target.value}]
    writerLocal('update','config',volumeAtual);
    audioElement.volume = event.target.value;
});

// ==========================================
// INICIALIZAÇÃO DO SISTEMA
// ==========================================

if (localStorage.length > 0) {
    let volumeCache = readLocal("tag","musicVolume");
    musicVolElement.value = volumeCache[0]["musicVolume"];
    carregarRanking()
/*
    let registro = readLocal('key','register');
    if (Array.isArray(registro)) {
        jhrankTable.querySelector('#primeiro').cells[1].textContent = registro[0]['nickName'];
        jhrankTable.querySelector('#primeiro').cells[2].textContent = registro[1]['score'];
        jhrankTable.querySelector('#primeiro').cells[3].textContent = registro[2]['ts'];
        jhrankTable.querySelector('#primeiro').cells[4].textContent = registro[3]['time'];
    }
*/
}

changeStyleColor(styleColor);
paletteUpdate();
janelaInicial('show');
let uiMusicselect = readLocal('tag',"uiMusicName");
carregarPlaylists();


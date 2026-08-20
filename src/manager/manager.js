//* Area de importação *//
import { observer, observerLoop, isVisibleList, theConstrutor } from "../game/game.js";
import { writerLocal, readLocal } from "./writer.js"
import { uiPlayer, playerController } from "../music/player.js";

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

const cgContainer = document.getElementById("janela_config")
const cgElements = document.getElementsByClassName("cg_element")
const cgButtonSave = document.getElementById("cg_buttonSave")
const cgButtonBack = document.getElementById("cg_buttonBack")
const musicVolElement = document.getElementById('musicVolume')

const prContainer = document.getElementById("janela_perso")
const prElements = document.getElementsByClassName("pr_element")
const prButtonSave = document.getElementById("pr_buttonSave")
const prButtonBack = document.getElementById("pr_buttonBack")


const buttonPlay = document.getElementById("play_button"); /* PREFS */

//* Area de variaveis de temporarias *//

let clicked = false;
let nickName, config, paleta, uiMusic, preferences;

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
        jiContainer.style.display = "flex"

        setInterval(gameINbackground, 999);
        observer('static')

        // Listeners de entrada única (removem a si mesmos após o primeiro uso)
        jiContainer.addEventListener('click', function catchMouse(event) {
            toggleGame()
            janelaInicial("hide")
            janelaHome("show")
            uiPlayer("play",uiMusicselect[0]["uiMusicName"])
            jiContainer.removeEventListener('click', catchMouse);
        });
        document.addEventListener('keydown', function catchAll(event) {
            toggleGame()
            janelaInicial("hide")
            janelaHome("show")
            uiPlayer("play",uiMusicselect[0]["uiMusicName"])
            document.removeEventListener('keydown', catchAll);
        });
    }
    else if (command === "hide") {
        hideElements(jiElements);
        jiContainer.style.display = "none"
        cancelAnimationFrame(observerLoop)
    }
    else {
        console.log(`func janelaInicial >> commando string ${command} desconhecido`)
    }
}

function janelaHome(command){
    if (command === "show") {
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
        let janelaDefault = [{dificuldade:'FACIL'},{playlist:'default'}];

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
    }
    else if (command === "hide") {
        hideElements(jmElements);
        jmContainer.style.display = "none"
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

function gameINbackground() {
    if (!clicked) {
        theConstrutor("static",26,150);
    }
}

function toggleGame() {
    clicked = !clicked;
}

// =============================
// SEÇÃO UNIFICADA DE LISTENERS 
// =============================

// --- CLIQUES DA JANELA HOME ---
jhButton00.addEventListener('click', function() { janelaPref("show"); });
jhButton01.addEventListener('click', function() { /* janelaPerso("show") */ });
jhButton02.addEventListener('click', function() { janelaConfig("show"); });

// --- CLIQUES DA JANELA PREF ---
jpButtonPlay.addEventListener('click', function() {
    janelaPref("hide");
    janelaHome("hide");
    let nickname = [{nickName:jhNickName.value}];
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

/*  DESATIVADO POR ENQUANTO.
jpPlaylistSelect.addEventListener('change', function(event) {
    let select = event.target.value;
    if (select === '-- ADICIONAR PLAYLIST --') {
        jpContainer.style.zIndex = "98";
        janelaMakePlaylist('show');
    }
});
*/

// --- CLIQUES DA JANELA MAKE PLAYLIST ---
jmButtonSave.addEventListener('click', function() {
    // Código para salvar futura playlist
});

jmButtonCancel.addEventListener('click', function() {
    jpContainer.style.zIndex = "99";
    janelaMakePlaylist("hide");
});

// --- CLIQUES DA JANELA CONFIG ---
cgButtonSave.addEventListener('click', function() { janelaConfig("hide"); });
cgButtonBack.addEventListener('click', function() { janelaConfig("hide"); });

// --- CLIQUES DA JANELA PERSO ---
prButtonSave.addEventListener('click', function() { janelaPerso("hide"); });
prButtonBack.addEventListener('click', function() { janelaPerso("hide"); });

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

    let registro = readLocal('key','register');

    if (Array.isArray(registro)) {
        jhrankTable.querySelector('#primeiro').cells[1].textContent = registro[0]['nickName'];
        jhrankTable.querySelector('#primeiro').cells[2].textContent = registro[1]['score'];
        jhrankTable.querySelector('#primeiro').cells[3].textContent = registro[2]['ts'];
        jhrankTable.querySelector('#primeiro').cells[4].textContent = registro[3]['time'];
    }
}

janelaInicial('show');
let uiMusicselect = readLocal('tag',"uiMusicName");
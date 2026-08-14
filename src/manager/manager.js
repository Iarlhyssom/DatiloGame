//* Area de importação *//
import { observer, isVisibleList, theConstrutor } from "../game/game.js";
import {writerLocal, readLocal} from "./writer.js"
import { uiPlayer, playerController} from "../music/player.js";

//* Area de variaveis de elementos *//
const bodyArray = document.getElementsByClassName("windowDiv") /* Array com as Janelas do Index */
const jiContainer = document.getElementById("janela_inicial") /* Id da Div Container JI */
const jiButton00 = document.getElementById("button00") /* Botao da JI */
const jiElements = document.getElementsByClassName('ji_element'); /* Array de Elementos da JI */
const audioElement = document.getElementById('player')

const jhContainer = document.getElementById("janela_home")
const jhElements = document.getElementsByClassName("jh_element")
const jhButton00 = document.getElementById("newGameButton")
const jhButton01 = document.getElementById("persoGameButton")
const jhButton02 = document.getElementById("configButton")

const jpContainer = document.getElementById("janela_pref")
const jpElements = document.getElementsByClassName("jp_element")
const jpDifSelect = document.getElementById("dificult_select")
const jpButton00 = document.getElementById("jp_button00")
const jpButton01 = document.getElementById("jp_button01")

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

let config = undefined
let paleta = undefined
let uiMusic = undefined
let preferences = undefined

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
        jiContainer.addEventListener('click', function(event) {
            toggleGame()
            janelaInicial("hide")
            janelaHome("show")
        });
    }
    else if (command === "hide") {
        hideElements(jiElements);
        jiContainer.style.display = "none"
    }
    else {
        console.log(`func janelaInicial >> commando string ${command} desconhecido`)
    }
}

function janelaHome(command){
    if (command === "show") {
        showElements(jhElements);
        jhContainer.style.display = "flex"
        jhButton00.addEventListener('click', function(event) {
            janelaPref("show")
        });
        jhButton01.addEventListener('click', function(event) {
            //janelaPerso("show")
        });
        jhButton02.addEventListener('click', function(event) {
            janelaConfig("show")
        });
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
        writerLocal('update','dificuldade','FACIL')
        writerLocal('update','playlist','default')

        showElements(jpElements);
        jpButton00.addEventListener('click', function(event) {
            janelaPref("hide")
            janelaHome("hide")

            window.location.replace('./src/game/')
        });
        jpButton01.addEventListener('click', function(event) {
            /*Not Funtional */
            janelaPref("hide")
        });
        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape") {
                janelaPref("hide")
            }
        })
        jpDifSelect.addEventListener('change', function(event) {
            writerLocal('update','dificuldade',event.target.value)
        })
    }
    else if (command === "hide") {
        hideElements(jpElements);
        jpContainer.style.display = "none"
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
        cgButtonSave.addEventListener('click', function(event) {
            /*Not Funtional */
            janelaConfig("hide")
        });
        cgButtonBack.addEventListener('click', function(event) {
            /*Not Funtional */
            janelaConfig("hide")
        });
        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape") {
                janelaConfig("hide")
            }
        })
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
        prButtonSave.addEventListener('click', function(event) {
            /*Not Funtional */
            janelaPerso("hide")
        });
        prButtonBack.addEventListener('click', function(event) {
            /*Not Funtional */
            janelaPerso("hide")
        });
        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape") {
                janelaPerso("hide")
            }
        })
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


//* Janela Inicial *//

if (localStorage.length === 0) {
    let config = [
        {musicVolume:0.6},
        {efectVolume:0.6},
        {uiMusicName:"default"}];

    let paleta = {paletName:"default"};

    let preferences = [
        {dificuldade:"FACIL"},
        {playlist:"default"}]

    writerLocal("create","config",config)
    writerLocal("create","paleta",paleta)
    writerLocal("create","preferences",preferences)
}
else {
    musicVolElement.value = readLocal("config","musicVolume")
}

janelaInicial('show')
uiPlayer("play",readLocal('config',"uiMusicName"))

musicVolElement.addEventListener('input', function(event){
    writerLocal('update','musicVolume',event.target.value)
    audioElement.volume = event.target.value;
})
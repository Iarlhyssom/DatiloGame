//* Area de importação *//
import { observer, isVisibleList, theConstrutor } from "../game/game.js";

//* Area de variaveis de elementos *//
const bodyArray = document.getElementsByClassName("windowDiv") /* Array com as Janelas do Index */
const jiContainer = document.getElementById("janela_inicial") /* Id da Div Container JI */
const jiButton00 = document.getElementById("button00") /* Botao da JI */
const jiElements = document.getElementsByClassName('ji_element'); /* Array de Elementos da JI */

const jhContainer = document.getElementById("janela_home")
const jhElements = document.getElementsByClassName("jh_element")
const jhButton00 = document.getElementById("newGameButton")
const jhButton01 = document.getElementById("prefGameButton")
const jhButton02 = document.getElementById("configButton")

const jpContainer = document.getElementById("janela_pref")
const jpElements = document.getElementsByClassName("jp_element")
const jpButton00 = document.getElementById("jp_button00")
const jpButton01 = document.getElementById("jp_button01")

const cgContainer = document.getElementById("janela_config")
const cgElements = document.getElementsByClassName("cg_element")
const cgButtonSave = document.getElementById("cg_buttonSave")
const cgButtonBack = document.getElementById("cg_buttonBack")


const buttonPlay = document.getElementById("play_button"); /* PREFS */

//* Area de variaveis de temporarias *//

let clicked = false;

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
            janelaHome("hide")
            window.location.replace('./src/game/')
        });
        jhButton01.addEventListener('click', function(event) {
            janelaPref("show")
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
        
        showElements(jpElements);
        jpButton00.addEventListener('click', function(event) {
            /*Not Funtional */
            janelaPref("hide")
        });
        jpButton01.addEventListener('click', function(event) {
            /*Not Funtional */
            janelaPref("hide")
        });
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
    }
    else if (command === "hide") {
        hideElements(cgElements);
        cgContainer.style.display = "none"
    }
    else {
        console.log(`func janelaConfig >> commando string ${command} desconhecido`)
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

//* Escondendo todos os elementos *//
hideElements(bodyArray);

//* Janela Inicial *//
janelaInicial('show')


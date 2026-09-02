import {writerLocal, readLocal, createLocals} from "../manager/writer.js"
import {addRanking, abrirBanco, initRanking} from "../manager/dbManager.js"
import { changeStyleColor } from "../manager/functions.js"

const elementFilm = document.querySelector('#tg_film')
const elementEndScore = document.querySelector('#tg_film #endScore')
const elementGameUi = document.querySelector('#gameUI')
const elementLife = document.querySelector('.hud-item #life_points')
const elementScore = document.querySelector('.hud-item #score')
const elementCombo = document.querySelector('.hud-item #combo')
const elementGameDiv = document.querySelector('#gameDiv')
const elementDif = document.querySelector('.hud-item #dificult_number')
const elementTs = document.querySelector('.hud-item #ts')
const elementTime = document.querySelector('.hud-item #time')
export let observerLoop; /*ID do Loop Observer*/

let life = 100
let combo = 0
let score = 0
let prefs = readLocal("key","preferences")
let namecache = readLocal("tag",'nickName')
let styleColor = readLocal("key","styleColor")
let velocity = 120;
let dificultNumber, windowValue, windowVerify;
let difInit, difAdd, dificultInit;

changeStyleColor(styleColor);

if (!namecache || !prefs){
    createLocals()
    let namecache = readLocal("tag",'nickName')
    let prefs = readLocal("key","preferences")
}

let dificult = (prefs && prefs[0]) ? prefs[0].dificuldade : "FACIL"; // if (prefs && prefs[0]) {dificult = prefs[0].dif} else {dificult = "FACIL"}
let name = namecache[0];

let types = 0;
let timeStart = Date.now(); 
let reStatus = false /* Se registrado muda pra true */

switch (dificult) {
    case "FACIL":
        life = 100;
        break
    case "NORMAL":
        life = 50;
        break
    case "DIFICIL":
        life = 10;
        break
    default :
        life = 27;
        break
} 

export function theConstrutor(mode,dif){
    let construtor = true
    /*CAPTURA A DIV ONDE AS LETRAS SERAO CRIADAS*/
    const container = document.getElementById('gameDiv');
    /*STRING CONTENDO O ALFABETO*/
    const list_lyrics = "ABCÇDEFGHIJKLMNOPQRSTUVWXYZ"
    /*VELOCIDADE BASE DE QUEDA DOS BLOCOS*/
    const velocity_pxS = velocity;
    /*MEDE A ALTURA TOTAL DA JANELA*/
    const height_background = mode === "game" ? container.clientHeight : window.innerHeight;
    let loteinGame = document.querySelectorAll('.box-style');

    if (mode == "game") {
        if (dificultNumber == undefined) { // inicia o valor da variavel dificultNumber.
            dificultNumber = windowDif(dif);
            dificultInit = windowDif(dif);
            windowValue = elementGameDiv.clientWidth;
            windowVerify = elementGameDiv.clientWidth;
            difInit = dif;
            
        }
        if (windowValue != undefined) {
            if (windowValue != windowVerify) { // se o tamanho da janela for alterado, recalcula a dif.
                difAdd = dificultNumber - dificultInit;
                dificultNumber = windowDif(difInit) + difAdd;
                console.log("difn",dificultNumber)
                windowValue = windowVerify;
                console.log("tela alterada")
            }
        }
    }else {
        dificultNumber = 26;
    }
    
    /*BLOCO QUE VERIFICA SE JA EXISTE LETRAS EM TELA */
    if (loteinGame.length == 0){
        construtor = true
    }
    /*VERIFICA SE EXISTEM LETRAS NO SPAWN MAP*/
    else{
        let lotecheck = []
        for (let i = 0; i < loteinGame.length; i++){
            let itemStyle = window.getComputedStyle(loteinGame[i])
            let itemY = parseInt(itemStyle.top, 10);
            lotecheck.push(itemY)
        }
        construtor = lotecheck.every(item => item > 0);
    }

    /*SO ATIVA SE NAO HOUVER LETRAS NO SPAWN MAP*/
    if (construtor == true){
        construtor = false;
        let positions = generate_spawnMap(mode);

        /*LOOP DE CRIAÇÃO DOS BLOCOS DE LETRAS E ANIMAÇÃO*/
        for (let i = 0; i < dificultNumber; i++){
            /*CRIA UMA NOVA TAG DIV NA MEMORIA DA MAQUINA*/
            const novoBox = document.createElement('div');
            /*SORTEIA UM NUMERO BASEADO EM LIST_LYRICS.LENGTH*/
            let target_index = Math.floor(Math.random()*list_lyrics.length);
            /*PEGA A LETRA CORRESPONDENTE AO NUMERO SORTEADO*/
            let target_lyric = list_lyrics[target_index];
            
            /*INSERE A LETRA SORTEADA NO ELEMENTO*/
            novoBox.textContent = target_lyric;
            /*APLICA O ESTILO AO ELEMENTO*/
            novoBox.classList.add('box-style');
            
            /*SORTEIA UM NUMERO BASEADO EM POSITIONS.LENGTH*/
            let position_index = Math.floor(Math.random()*positions.length);
            let target_position = positions[position_index];

            /*POSIÇÃO HORIZONTAL ALEATORIA DENTRO DA JANELA*/
            let posX = target_position["x"];

            /*ALOCANDO O ELEMENTO AO EIXO X*/
            novoBox.style.left = posX + 'px';
            
            /*POSIÇÃO VERTICAL ALEATORIA DENTRO DA JANELA*/
            let posY = target_position["y"];

            /*ALOCANDO O ELEMENTO AO EIXO Y*/
            novoBox.style.top = posY + 'px';

            /*CALCULA A DISTANCIA REAL EM PIXELS DA POSIÇÃO Y DO ELEMENTO ATE O FINAL DA TELA VISIVEL*/
            const targetY = height_background - 36;
            let space_down = Math.abs(posY) + targetY;
            /*CALCULA O TEMPO DE QUEDA BASEADA NA DISTANCIA*/
            let timeDrop = space_down / velocity_pxS;

            /*DEFINE A VELOCIDADE DE QUEDA DO ELEMENTO*/
            novoBox.style.animationDuration = timeDrop + 's';

            /*INSERE O ELEMENTO COMO CHILD DA DIV CONTAINER*/
            container.appendChild(novoBox);
            positions.splice(position_index,1);
        };
        positions = []
        loteinGame = document.querySelectorAll('.box-style');

    }
    requestAnimationFrame(() => theConstrutor(mode,dificultNumber));
};

/*FUNCAO PARA CRIAR UMA ARRAY COM OBJETOS COORDENADAS*/
function generate_spawnMap(mode){
    const containerWidth = mode === "game" ? elementGameDiv.clientWidth : window.innerWidth;
    const containerHeight = mode === "game" ? elementGameDiv.clientHeight : window.innerHeight;
    const boxSize = {"x":36,"y":36}
    const positions = []

    let contSpacesX = Math.floor(containerWidth / boxSize["x"] - 1)
    contSpacesX = Math.max(1, contSpacesX);

    let contSpacesY = Math.floor(containerHeight / boxSize["y"])
    let sobraLargura = containerWidth - (contSpacesX * boxSize["x"]);
    let offset = Math.floor(sobraLargura / 2);

    
    
    for (let c = 0; c <= contSpacesX; c++){
        let sortX = offset + (c * 36)
        for (let r = 1; r <= contSpacesY; r++){
            let sortY = (r * 36)*-1
            let position = {"x":sortX,"y":sortY}
            positions.push(position)
        }
    }
    return positions
};
export let isVisibleList = []
export function observer(mode) {
    // 1. Trava de segurança
    if (mode === "game") {
        if (!elementLife || !elementGameDiv){
            console.warn("func observer [Trava de segurança ativada! O observer desativado.]");
            return;
        }
        uiUpdate();
    }
    // 2. Medição da borda inferior exata no monitor (rodada apenas 1 vez)
    const gameDivRect = elementGameDiv.getBoundingClientRect();
    const limitY = gameDivRect.bottom

    let loteinGame = document.querySelectorAll('.box-style');
    let list = [];

    for (let i = 0; i < loteinGame.length; i++) {
        let item = loteinGame[i];
        let itemPosition = item.getBoundingClientRect();

        if (itemPosition.top > 0) {
            list.push(item);
        }

        // 3. Checagem de impacto na base do gameDiv
        if (itemPosition.bottom >= limitY) {
            list = list.filter(el => el !== item);

            if (mode === "game") {
                item.remove();
                life--;
                uiUpdate();
            }else{
                try{
                    const contador = document.getElementById('contador')
                    contador.textContent = loteinGame.length
                }catch (e){
                    console.log(`contador: [${e}]`)
                }
            }
            if (life <= 0 && mode === "game") {
                elementEndScore.innerText = score;
                elementFilm.style.display = "flex";
                elementGameUi.style.display = "none";
                rankRegister();
            }
            if (mode === "static") {
                item.remove();
            }
        }
    }
    isVisibleList.length = 0;
    isVisibleList.push(...list);
    observerLoop = requestAnimationFrame(() => observer(mode));
}
export function destroyer(key,list) {
    key = key.toUpperCase()
    let itens = list.filter(el => el.textContent === key)
    if (itens.length === 0) {return null} 
    let positions = []
    for (let i = 0; i < itens.length; i++){
        let item = itens[i]
        let itemPosition = item.getBoundingClientRect()
        let itemY = itemPosition.top
        positions.push({itemY,item})
    }
    /*NAO FAÇO IDEIA DE COMO FUNCIONA*/
    /*PEGA O MAIOR VALOR NA LISTA POSITIONS*/
    let target = positions.reduce((max, atual) => atual.itemY > max.itemY ? atual : max);
    target.item.remove();
    if (reStatus === false) {
        types++
        score++
        uiUpdate();
    }
    dificultNumber = newDificult(dificultNumber,score);
}

/* Função para regular a dificuldade ao longo do jogo - FACIL / NORMAL */
let verificador;
export function newDificult(dif,sco) { /*dificuldade, velocidade px/s, score atual*/
    let valor;

    dif = parseInt(dif,10);
    sco = parseInt(sco,10);

    if (sco > 0){
        if (verificador != sco) {
            valor = sco/72
            dif = dif + valor
            console.log("valor",valor,"dif",dif,"score",sco)
            verificador = sco;
        }
    }

    return dif;
}

function windowDif (valor) {
    let containerWidth = elementGameDiv.clientWidth;
    let dificult = containerWidth/valor
    console.log(`${valor} / ${containerWidth} = ${dificult}`)
    return dificult;
}

function uiUpdate (){
    let interval = (Date.now())-timeStart;
    let isTime = (interval/1000);
    let ts;

    if (types > 0) {
        ts = Math.floor((isTime/types)*10)/10; /* Aredondando para 1 casa dec */
        ts = `${ts}/s`
    }
    else{ts = `0/s`}

    elementLife.innerText = life;
    elementScore.innerText = score;
    elementDif.innerText = (dificultNumber ?? 0).toFixed(2);
    elementTs.innerText = ts;
    elementTime.innerText = isTime;

    windowVerify = elementGameDiv.clientWidth;
}

function rankRegister() {
    if (reStatus === true) {return};
    const dateUTC_br = 10800000;
    let register = [name];
    let interval = (Date.now())-timeStart;
    let reScore = {score:score};
    let isTime = (interval/1000);
    let reTs,reTime;
    isTime = isTime.toFixed(1);

    let dateUTC = (new Date()).getTime()
    let isDate = dateUTC - dateUTC_br
    
    if (isTime > 59) {
        isTime = isTime / 60;
        reTime = {time:`${isTime}/m`};
    }
    else if (isTime > 3600) {
        isTime = isTime / 3600;
        reTime = {time:`${isTime}/h`};
    }
    else{reTime = {time:`${isTime}/s`};}

    if (types > 0) {
        reTs = Math.floor((isTime/types)*10)/10; /* Aredondando para 1 casa dec */
        reTs = {ts:`${reTs}/s`}
    }
    else{reTs = {ts:`0/s`}}

    register.push(reScore,reTs,reTime)
    writerLocal('create','register',register)



    register = {data:isDate, nome:namecache[0]['nickName'],
         score:reScore['score'], ts:reTs['ts'], time:reTime['time']};
    reStatus = true;

    addRanking(register);
    
    //{data: 1787236662468, nome: 'jao', score: 999, ts: '1/s', time: '8.8/s'}
}
import {writerLocal, readLocal} from "../manager/writer.js"

const elementFilm = document.querySelector('#tg_film')
const elementEndScore = document.querySelector('#tg_film #endScore')
const elementGameUi = document.querySelector('#gameUI')
const elementLife = document.querySelector('.hud-item #life_points')
const elementScore = document.querySelector('.hud-item #score')
const elementCombo = document.querySelector('.hud-item #combo')
const elementGameDiv = document.querySelector('#gameDiv')
export let observerLoop; /*ID do Loop Observer*/

let life = 100
let combo = 0
let score = 0
let prefs = readLocal("preferences")
let dificult = (prefs && prefs[0]) ? prefs[0].dificuldade : "FACIL"; // if (prefs && prefs[0]) {dificult = prefs[0].dif} else {dificult = "FACIL"}

let nickName = readLocal('nickName') ?? {nickName: 'guest'};
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

export function theConstrutor(mode,dificultNumber,velocity){
    let dificult = dificultNumber
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

    let var_Atualizadas = [10,120];
    if (mode === "game") {
        var_Atualizadas = newDificult(dificult,velocity_pxS,score);
    }
    requestAnimationFrame(() => theConstrutor(mode,var_Atualizadas[0], var_Atualizadas[1]));
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
        for (let r = 1; r <= contSpacesX; r++){
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
        elementLife.innerText = life;
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
                elementLife.innerText = life;
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
        elementScore.innerText = score++
    }
}

/* Função para regular a dificuldade ao longo do jogo - FACIL / NORMAL */
export function newDificult(dif,vpx,sco) { /*dificuldade, velocidade px/s, score atual*/
    dif = parseInt(dif,10);
    vpx = parseInt(vpx,10);
    sco = parseInt(sco,10);

    let valor = 0;
    let dificulLimit = 100;
    let scoreLimit = 500;
    if (sco === 0 || sco == null){
        return [10, 120]
    }
    else if (sco >= 50 && sco < scoreLimit) {
        let difRestante = dificulLimit - dif;
        let scoRestante = scoreLimit - sco;
        if (scoRestante > 0 && difRestante > 0) {
            valor = difRestante / scoRestante; 
        }
    }
    else if (sco >= scoreLimit) {
        valor = 0
    }
    dif = dif + valor;
    vpx = vpx + valor;
    //console.log(valor," dificuldade atualizada ",dif,"dif // ",vpx,"pxs");
    return [dif, vpx];
}

function rankRegister() {
    if (reStatus === true) {return};
    let register = [nickName]
    let interval = (Date.now())-timeStart
    let reScore = {score:score};
    let isTime = (interval/1000);
    let reTime = {time:`${isTime}s`};
    let reTs;

    if (types > 0) {
        reTs = Math.floor((isTime/types)*10)/10; /* Aredondando para 1 casa dec */
        reTs = {ts:`${reTs}/s`}
    }else {reTs = {ts:'0/s'}}

    register.push(reScore,reTs,reTime)
    writerLocal('create','register',register)
    reStatus = true;
}
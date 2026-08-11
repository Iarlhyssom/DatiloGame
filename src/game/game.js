const elementFilm = document.querySelector('#tg_film')
const elementEndScore = document.querySelector('#tg_film #endScore')
const elementGameUi = document.querySelector('#gameUI')
const elementLife = document.querySelector('.hud-item #life_points')
const elementScore = document.querySelector('.hud-item #score')
const elementCombo = document.querySelector('.hud-item #combo')

let life = 100
let combo = 0
let score = 0

export function theConstrutor(mode,dificultNumber,velocity){
    let dificult = dificultNumber
    let construtor = true
    /*CAPTURA A DIV ONDE AS LETRAS SERAO CRIADAS*/
    const container = document.getElementById('gameDiv');
    /*STRING CONTENDO O ALFABETO*/
    const list_lyrics = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    /*VELOCIDADE BASE DE QUEDA DOS BLOCOS*/
    const velocity_pxS = velocity;
    /*MEDE A ALTURA TOTAL DA JANELA*/
    const height_background = window.innerHeight;
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
        let positions = generate_spawnMap();

        /*LOOP DE CRIAÇÃO DOS BLOCOS DE LETRAS E ANIMAÇÃO*/
        for (let i = 0; i < dificultNumber; i++){
            /*CRIA UMA NOVA TAG DIV NA MEMORIA DA MAQUINA*/
            const novoBox = document.createElement('div');
            /*SORTEIA UM NUMERO BASEADO NA LISTA*/
            let target_index = Math.floor(Math.random()*list_lyrics.length);
            /*PEGA A LETRA CORRESPONDENTE AO NUMERO SORTEADO*/
            let target_lyric = list_lyrics[target_index];
            
            /*INSERE A LETRA SORTEADA NO ELEMENTO*/
            novoBox.textContent = target_lyric;
            /*APLICA O ESTILO AO ELEMENTO*/
            novoBox.classList.add('box-style');
            
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
            let space_down = height_background - posY;
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
function generate_spawnMap(){
    const windowHeight = window.innerHeight; /*Y*/
    const windowWidth = window.innerWidth;   /*X*/
    const boxSize = {"x":60,"y":60}
    const positions = []
    let contSpacesX = windowWidth / boxSize["x"]
    let contSpacesY = Math.floor(windowHeight / boxSize["y"])
    
    for (let c = 0; c < contSpacesX; c++){
        let sortX = c * 60
        for (let r = 1; r < contSpacesX; r++){
            let sortY = (r * 60)*-1
            let position = {"x":sortX,"y":sortY}
            positions.push(position)
        }
    }
    return positions
};
export let isVisibleList = []
export function observer(mode) {
    if (!elementLife) {return};
    const windowHeight = window.innerHeight; /*Y*/
    let loteinGame = document.querySelectorAll('.box-style')
    let list = []
    elementLife.innerText = life
    for (let i = 0; i < loteinGame.length; i++) {
        let item = loteinGame[i]
        let itemPosition = item.getBoundingClientRect()
        let itemY = itemPosition.top
        if (itemY > 0){
            list.push(loteinGame[i])
        }
        if (itemY >= windowHeight) {
            /*COMPARA O EL QUE SAO OBJETOS SALVOS DENTRO DE LIST COM O ITEM E O ELIMINA SE IGUAL*/
            list = list.filter(el => el !== item);
            if (mode === "game") {
                item.remove();
                life--
                elementLife.innerText = life
            }
            if (life <= 0 && mode === "game"){
                elementEndScore.innerText = score
                elementFilm.style.display = "flex"
                elementGameUi.style.display = "none"
            }
        }
    }

    isVisibleList.length = 0;
    isVisibleList.push(...list);
    requestAnimationFrame(() => observer(mode));
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
    console.log("aqui 1")
    elementScore.innerText = score++
    console.log("aqui 2")
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
    console.log(valor," dificuldade atualizada ",dif,"dif // ",vpx,"pxs");
    return [dif, vpx];
}

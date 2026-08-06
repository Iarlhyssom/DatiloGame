function the_game(){
    let construtor = true
    /*CAPTURA A DIV ONDE AS LETRAS SERAO CRIADAS*/
    const container = document.getElementById('gameDiv');
    /*STRING CONTENDO O ALFABETO*/
    list_lyrics = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    /*VELOCIDADE BASE DE QUEDA DOS BLOCOS*/
    const velocity_pxS = 120;
    /*MEDE A ALTURA TOTAL DA JANELA*/
    const height_background = window.innerHeight;
    let loteinGame = document.querySelectorAll('.box-style');

    if (loteinGame.length == 0){
        construtor = true
    }
    else{
        let lotecheck = []
        for (let i = 0; i < loteinGame.length; i++){
            let itemStyle = window.getComputedStyle(loteinGame[i])
            let itemY = parseInt(itemStyle.top, 10);
            lotecheck.push(itemY)
        }
        construtor = lotecheck.every(item => item > 0);
    }

    if (construtor == true){
        construtor = false;
        let positions = generate_spawnMap();

        /*LOOP DE CRIAÇÃO DOS BLOCOS DE LETRAS E ANIMAÇÃO*/
        for (let i = 0; i < list_lyrics.length; i++){
            /*CRIA UMA NOVA TAG DIV NA MEMORIA DA MAQUINA*/
            const novoBox = document.createElement('div');
            /*SORTEIA UM NUMERO BASEADO NA LISTA*/
            target_index = Math.floor(Math.random()*list_lyrics.length);
            /*PEGA A LETRA CORRESPONDENTE AO NUMERO SORTEADO*/
            target_lyric = list_lyrics[target_index];
            
            /*INSERE A LETRA SORTEADA NO ELEMENTO*/
            novoBox.textContent = target_lyric;
            /*APLICA O ESTILO AO ELEMENTO*/
            novoBox.classList.add('box-style');
            
            position_index = Math.floor(Math.random()*positions.length);
            target_position = positions[position_index];
            /*console.log(position_index+" index");
            console.log(positions.length+" array length");
            console.log(target_position+" Tg Position");*/

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
        /*console.log(positions.length+" array cont final")*/
        positions = []
        loteinGame = document.querySelectorAll('.box-style');

    }
};

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

    /*console.log(contSpacesX)
    console.log(windowWidth)
    console.log(contSpacesY)
    console.log(windowHeight)
    console.log(positions)*/
    return positions
};

function the_game(){
                /*CAPTURA A DIV ONDE AS LETRAS SERAO CRIADAS*/
                const container = document.getElementById('container-boxes');
                /*STRING CONTENDO O ALFABETO*/
                list_lyrics = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                /*VELOCIDADE BASE DE QUEDA DOS BLOCOS*/
                const velocity_pxS = 120;
                /*MEDE A ALTURA TOTAL DA JANELA*/
                const height_background = window.innerHeight;

                /*LOOP DE CRIAÇÃO DOS BLOCOS DE LETRAS E ANIMAÇÃO*/
                for (let i = 0; i < 26; i++){
                    /*CRIA UMA NOVA TAG DIV NA MEMORIA DA MAQUINA*/
                    const novoBox = document.createElement('div')
                    /*SORTEIA UM NUMERO BASEADO NA LISTA*/
                    target_index = Math.floor(Math.random()*list_lyrics.length);
                    /*PEGA A LETRA CORRESPONDENTE AO NUMERO SORTEADO*/
                    target_lyric = list_lyrics[target_index];
                    
                    /*INSERE A LETRA SORTEADA NO ELEMENTO*/
                    novoBox.textContent = target_lyric;
                    /*APLICA O ESTILO AO ELEMENTO*/
                    novoBox.classList.add('box-style')
                    
                    /*MEDE A LARGURA TOTAL DA JANELA DO NAVEGADOR E SUBTRAI 60PX (LARGURA DO ELEMENTO)*/
                    let width_window = window.innerWidth - 60;
                    /*SORTEIA UMA POSIÇÃO HORIZONTAL ALEATORIA DENTRO DA JANELA*/
                    let posX = Math.floor(Math.random()*width_window);
                    /*APLICA NO ESTILO INLINE (LEFT: XPX), ALOCANDO O ELEMENTO NA TELA EM LINHA*/
                    novoBox.style.left = posX + 'px';
                    
                    /*SORTEIA UM NUMERO ENTRE 0 E 399PX E SUBTRAI 500PX*/
                    let posY = Math.floor(Math.random()*400)-500;
                    /*ORGANIZA O ELEMENTO EM UM ESPAÇO ACIMA DA TELA VISIVEL*/
                    novoBox.style.top = posY + 'px';

                    /*SORTEIA UM NUMERO DECIMAL ENTRE 0 E 6 SEGUNDOS*/
                    let slow = Math.random() * 12;
                    /*MODIFICA O DELAY DA ANIMAÇÃO DO ELEMENTO*/
                    novoBox.style.animationDelay = slow + 's';

                    /*CALCULA A DISTANCIA REAL EM PIXELS DA POSIÇÃO Y DO ELEMENTO ATE O FINAL DA TELA VISIVEL*/
                    let space_down = height_background - posY;
                    /*CALCULA O TEMPO DE QUEDA BASEADA NA DISTANCIA*/
                    let timeDrop = space_down / velocity_pxS;

                    /*DEFINE A VELOCIDADE DE QUEDA DO ELEMENTO*/
                    novoBox.style.animationDuration = timeDrop + 's';

                    /*INSERE O ELEMENTO COMO CHILD DA DIV CONTAINER*/
                    container.appendChild(novoBox);
                };
            };
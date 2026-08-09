// Aguarda o botão existir na tela para adicionar o evento de clique
document.getElementById('button').addEventListener('click', function() {
    
    // 1. Configuração inicial (Roda UMA única vez ao clicar)
    const audioContext = new AudioContext();
    const audioElement = document.getElementById('player');
    
    const source = audioContext.createMediaElementSource(audioElement);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 32;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const dados = new Uint8Array(analyser.frequencyBinCount);
    const graphObjects = document.querySelectorAll('.barra')
    const graphTexts = document.querySelectorAll('.p')
    const cont = document.getElementById('cont')
    

    // 2. Esta função interna vai rodar em loop (60 vezes por segundo)
    function checarLoop() {
        requestAnimationFrame(checarLoop); // Agenda a próxima execução
        
        analyser.getByteFrequencyData(dados); // Pega os dados atuais do áudio
        const volumeRuler = dados[10]; // Pega a frequência mais baixa (bumbo)
        let hitvalor = 0
        for (let i = 0; i < graphObjects.length; i++){
            let percent = parseInt(dados[i],10) / 255;
            percent = Math.floor(percent * 100);
            graphTexts[i].innerText = percent
            graphObjects[i].style.height = `${percent}%`
        }
        for (let i = 0; i < dados.length; i++) {
            hitvalor = hitvalor + dados[i]
        }

        hitvalor = Math.floor(hitvalor / 255)
        hitvalor = Math.floor(hitvalor * 100)
        hitvalor = Math.floor(hitvalor / 100)
        cont.innerText = hitvalor
        let contador = 0
        
        switch (true) {
            case volumeRuler > 100:
                contador++
                console.log(contador)
                break
        }
    }

    // 3. Inicia o áudio e o loop de leitura
    audioContext.resume();
    audioElement.play();
    checarLoop(); // Dá o pontapé inicial no loop
});
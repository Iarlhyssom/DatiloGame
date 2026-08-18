import {addRanking,readRanking} from "../dbManager.js"

const inputNome = document.querySelector('.field:nth-of-type(1) input');
const inputScore = document.querySelector('.field:nth-of-type(2) input');
const botaoCadastrar = document.querySelector('button');
const labelSeek = document.querySelector('#seek');

botaoCadastrar.addEventListener('click',async function(event){
    let nome = inputNome.value;
    let score = inputScore.value;
    if (nome != '' && score != '') {
        try {
            nome = String(nome);
        } catch {
            console.warn('nome nao é string')
            return
        }
        try {
            score = Number(score)
        } catch {
            console.warn('score nao é number')
            return
        }
        let novo = {
            data:'20260816',
            nome: nome,
            score: score,
            ts:'1/s',
            time:'8.8/s'
        }
        addRanking(novo)
    }
    
    let registro = await readRanking()
    labelSeek.replaceChildren();
    for (let i = 0; i < registro.length; i++) {
        let novaLabel = document.createElement('label');
        novaLabel.innerText = JSON.stringify(registro[i])
        labelSeek.appendChild(novaLabel);
    };
    
})
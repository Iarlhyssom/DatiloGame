import {addRanking,readRanking, initRanking} from "../dbManager.js"

const inputNome = document.querySelector('.field:nth-of-type(1) input');
const inputScore = document.querySelector('.field:nth-of-type(2) input');
const botaoCadastrar = document.querySelector('button');
const labelSeek = document.querySelector('#seek');
const timeUTC_br = 10800000;

async function atualizar(){
    let registro = await readRanking()
    labelSeek.replaceChildren();
    for (let i = 0; i < registro.length; i++) {
        let novaLabel = document.createElement('label');
        novaLabel.innerText = JSON.stringify(registro[i])
        labelSeek.appendChild(novaLabel);
    };
}

botaoCadastrar.addEventListener('click',async function(event){
    let timeUTC = (new Date()).getTime()
    let isTime = timeUTC - timeUTC_br
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
            data:(isTime),
            nome: nome,
            score: score,
            ts:'1/s',
            time:'8.8/s'
        }
        addRanking(novo)
    }
    
    atualizar();
    
})



atualizar();
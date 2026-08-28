/*FUNCAO PARA LER DADOS NA LOCALSTORAGE*/
export function readLocal(type,ref){
    /*procura todos os registros no localStorage*/
    if (type === 'searchAll') {
        if (localStorage.length > 0) {
            let dict = {};
            let allKeys = Object.keys(localStorage)
            for (let i = 0; i < allKeys.length; i++) {
                let rowLocal = JSON.parse(localStorage.getItem(allKeys[i]))
                dict[allKeys[i]] = rowLocal
            }
            return dict;
        }
        else {
            console.warn("func readLocal [localStorage Vazio]")
            return undefined
        }
    }
    /*trava de seguraça, call incompleta*/
    if (type === undefined || ref === undefined) {
        return "func readLocal [passe algum argumento valido 'arg1 type, arg2 ref']"
    }
    /* procura uma chave especifica no localStorage */
    if (type === 'key') {
         return JSON.parse(localStorage.getItem(ref)); 
    }
    /* procura uma tag, independente da chave */
    else if (type === 'tag') {
        let group, object, dict, scan;
        let detected = []
        dict = readLocal('searchAll','none') /* captura todos os registros para o dict */

        /* trava de segurança, se dict for vazio ou nulo */
        if (dict === undefined) {
            console.warn("func readLocal [dict undefined]")
            return undefined;
        }

        /* itera sobre o dict */
        for (let i in dict) {
            group = dict[i]
            /* se for um array, adentra e procura a tag dentro */
            if (Array.isArray(group)) {
                for (let item in group) {
                    item = group[item];

                    scan = Object.keys(item);

                    if (scan[0] === ref) {
                        detected.push(item)
                    }
                }
            }
            /* se for um objeto, compara e retorna se equivalente */
            else if (typeof group === 'object') {
                scan = Object.keys(group)
                if (scan[0] === ref) {
                    detected.push(group)
                }
            }
            else {
                console.warn('func readLocal [element type erro]')
            }
        }
        if (detected.length > 1) {
            console.warn('func readLocal [mais de uma array com o mesmo nome]')
            console.warn(detected)
        }
        else{return detected;}
    }
    else {
        console.warn('func readLocal [type command erro]')
    }
}


/*FUNCAO PARA ESCREVER / SOBRESCREVER NO LOCALSTORAGE*/
export function writerLocal(command,key,value){
    /* este commando cria ou substitui uma chave inteira */
    if (command === 'create')
        if (key != undefined && value != undefined) {
            if (Array.isArray(value) || typeof value === 'object') {
                localStorage.setItem(key, JSON.stringify(value));
            }
            else {
                console.log("func writerLocal [value != array && value != object]")
                console.log("func writerLocal [value precisa ser array || object]")
            }
        }
        else if (key != undefined && value === undefined) {
            console.log("func writerLocal [informe value(object/array)]")
        }
        else {return "func writerLocal [key error]"}
    /* este atualiza uma chave existente */
    else if (command === 'update') {
        if (localStorage.length === 0){
            console.warn('func writerLocal [localStorage esta vazio amigo]')
            return undefined;
        }

        if (key != undefined || value != undefined) {
            let newArray = readLocal('key',key) || []; /*captura o alvo(array) do localStorage*/
            let alteracoes = 0

            for (let i in value) {
                let novoItem = value[i]
                let scan = Object.keys(novoItem) /*pega as keys dentro do novoItem*/
                let index = -1;

                for (let e = 0; e < newArray.length; e++) {
                    let oldItem = newArray[e]
                    if (oldItem.hasOwnProperty(scan)) { /*verifica se existe atributo/chave === scan no alvo*/
                        index = e /*guarda o index se existir*/
                        break;
                    }
                    
                }
                if (index != -1) {
                    newArray[index] = novoItem
                    alteracoes++
                }
                else {
                    newArray.push(novoItem)
                    alteracoes++
                }
            }
            /*verifica se foram feitas alterações*/
            if (alteracoes > 0) {
                writerLocal('create',key,newArray)
            }
            else {
                console.warn('func writerLocal [nenum dado alterado]')
            }

        }
        else {
            console.warn('func writerLocal [key ou value indefinido]')
        }
    }
    else {console.log(`func writerLocal [comando desconhecido] command '${command}'`)}
}

export function createLocals(){
    let config = [
        {musicVolume:0.6},
        {efectVolume:0.6},
        {uiMusicName:"default"}];

    let styleColor = {
        'bg-color': '#000000',
        'text-color': '#ffffff',
        'border-color': '#858080',
        'button-bg': '#000000'
    }
    
    let preferences = [
        {dificuldade:"FACIL"},
        {playlist:"default"}]

    let registro = [{nickName: "guest"}, {score: "0"}, {ts: "0/s"}, {time: "0/s"}]

    writerLocal("create","config",config)
    writerLocal("create","styleColor",styleColor)
    writerLocal("create","preferences",preferences)
    writerLocal("create","register",registro)
}

if (localStorage.length === 0) {
    createLocals()
}


/*FUNCAO PARA LER DADOS NA LOCALSTORAGE*/
export function readLocal(key,tag){
    if (key != undefined && tag === undefined) {
        return JSON.parse(localStorage.getItem(key)); 
    }
    else if (key != undefined && tag != undefined) {
        let keyContent = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(keyContent)){
            for (let i = 0; i < keyContent.length; i++){
                if (keyContent[i] && tag in keyContent[i]){
                    return keyContent[i][tag];
                };
            };    
        }
        return keyContent[tag]
        console.log(`func readLocal [tag nao encontrada] tag '${tag}'`)
    }
    else {console.log(`func readLocal [key nao encontrada] key '${key}'`); return undefined;}
}

/*FUNCAO PARA ESCREVER / SOBRESCREVER NO LOCALSTORAGE*/
export function writerLocal(command,key,value){
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
        else {console.log("func writerLocal [key error]")}
    else if (command === 'update') {
        let localKeys, keyContent, newObject
        if (localStorage.length > 0) {
            localKeys = Object.keys(localStorage)
            for (let i = 0; i < localKeys.length; i++) {
                keyContent = readLocal(localKeys[i])
                let newArray = []
                if (Array.isArray(keyContent)) {
                    let wasFound = 0
                    for (let i = 0; i < keyContent.length; i++) {
                        if (keyContent[i] && key in keyContent[i]){
                            newObject = {[key]:value}
                            newArray.push(newObject)
                            wasFound++
                        }
                        else {
                            newArray.push(keyContent[i])
                        }
                    }
                    if (wasFound > 0) {
                        writerLocal("create",localKeys[i],newArray)
                        return `operecao concluida update object '${newObject}', array '${localKeys[i]}'`
                    }
                    else {
                        console.log(`func writerLocal [nenhum objeto correspondente encontrado dentro de array: ${localKeys[i]}]`)
                        console.log(`func writerLocal [array: '${localKeys[i]} key: '${key}' value: '${value}']`)
                    }
                }
                else if (typeof keyContent === 'object' && key in keyContent) {
                    newObject = {[key]:value}
                    writerLocal("create",localKeys[i],newObject)
                    return "operecao concluida update object"
                }
            }
            console.log("func writerLocal [nenhum objeto ou array equivalente encontrado no localStorage]")
            console.log(`func writerLocal [key: '${key}' value: '${value}']`)
        }
        else {
            console.log("func writerLocal [o localStorage esta vazio, ultilize o commando 'create']")
        }
    }
    else {console.log(`func writerLocal [comando desconhecido] command '${command}'`)}
}

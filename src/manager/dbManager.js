/**
 * Abre (ou cria) a conexão com o banco IndexedDB.
 * Se a tabela estiver vazia, aciona a função de inicialização se fornecida.
 */
export function abrirBanco(NOME_BANCO, VERSAO, TABELA, funcInit) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(NOME_BANCO, VERSAO);

        // CONDICIONAL DE ESTRUTURA: Dispara quando o banco é novo ou a versão aumentou
        request.onupgradeneeded = (evento) => {
            const db = evento.target.result;
            // Se a tabela requisitada não existir no banco, ela é criada com a chave 'id'
            if (!db.objectStoreNames.contains(TABELA)) {
                db.createObjectStore(TABELA, { keyPath: "id" });
            }
        }; 

        // Dispara quando o banco abre com sucesso
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(TABELA, "readonly");
            const store = transaction.objectStore(TABELA);
            const countRequest = store.count(); 

            countRequest.onsuccess = () => {
                // CONDICIONAL DE DADOS: Se a tabela tiver 0 registros E uma função inicializadora for passada
                if (countRequest.result === 0 && typeof funcInit === "function") {
                    funcInit(db, TABELA); // Popula o banco com os dados padrão iniciais
                }
                resolve(db);
            };

            countRequest.onerror = () => reject("Erro ao contar os itens da tabela");
        };
        
        request.onerror = () => reject(request.error);
    }); 
}

/**
 * Adiciona um objeto novo na tabela.
 */
export async function addInDB(NOME_BANCO, VERSAO, TABELA, ITEM) {
    const db = await abrirBanco(NOME_BANCO, VERSAO, TABELA);
    return new Promise((resolve, reject) => {
        const transacao = db.transaction(TABELA, 'readwrite');
        const store = transacao.objectStore(TABELA);
        const request = store.add(ITEM);

        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
    });
}

/**
 * Remove um registro completo da tabela usando a chave primária (Key/ID).
 */
export async function deleteDBKey(NOME_BANCO, VERSAO, TABELA, Key) {
    const db = await abrirBanco(NOME_BANCO, VERSAO, TABELA);
    return new Promise((resolve, reject) => {
        const transacao = db.transaction(TABELA, 'readwrite');
        const store = transacao.objectStore(TABELA);
        const requisicao = store.delete(Key);

        requisicao.onsuccess = () => resolve(true);
        requisicao.onerror = (e) => reject(e.target.error);
    });
}

/**
 * Remove um elemento de dentro de um array interno guardado no registro.
 */
export async function deleteDBValue(NOME_BANCO, VERSAO, TABELA, Key, NOME_ARRAY, CAMPO_ID_INTERNO, REF) {
    const db = await abrirBanco(NOME_BANCO, VERSAO, TABELA);
    return new Promise((resolve, reject) => {
        const transacao = db.transaction(TABELA, 'readwrite');
        const store = transacao.objectStore(TABELA);
        const requisicaoBusca = store.get(Key);

        requisicaoBusca.onsuccess = (evento) => {
            const registroPai = evento.target.result;

            // CONDICIONAL: Verifica se o registro pai existe E se a propriedade do array existe nele
            if (registroPai && registroPai[NOME_ARRAY]) {
                // Filtra a lista removendo o item onde o ID bate com a referência
                registroPai[NOME_ARRAY] = registroPai[NOME_ARRAY].filter(
                    item => String(item[CAMPO_ID_INTERNO]) !== String(REF)
                );

                const requisicaoAtualizar = store.put(registroPai);
                requisicaoAtualizar.onsuccess = () => resolve(true);
                requisicaoAtualizar.onerror = (e) => reject(e.target.error);
            } else {
                // Se o registro ou o array não existirem, encerra com falha
                resolve(false);
            }
        };

        requisicaoBusca.onerror = (e) => reject(e.target.error);
    });
}

/**
 * Insere um novo item ao final de um array interno de um registro.
 */
export async function addDBValue(NOME_BANCO, VERSAO, TABELA, Key, NOME_ARRAY, NOVO_ITEM) {
    const db = await abrirBanco(NOME_BANCO, VERSAO, TABELA);
    return new Promise((resolve, reject) => {
        const transacao = db.transaction(TABELA, 'readwrite');
        const store = transacao.objectStore(TABELA);
        const requisicaoBusca = store.get(Key);

        requisicaoBusca.onsuccess = (evento) => {
            const registroPai = evento.target.result;

            // CONDICIONAL: Se o objeto pai existir no banco
            if (registroPai) {
                // CONDICIONAL: Se o array interno ainda não foi instanciado, cria um array vazio
                if (!registroPai[NOME_ARRAY]) registroPai[NOME_ARRAY] = [];
                
                registroPai[NOME_ARRAY].push(NOVO_ITEM);

                const requisicaoAtualizar = store.put(registroPai);
                requisicaoAtualizar.onsuccess = () => resolve(true);
                requisicaoAtualizar.onerror = (e) => reject(e.target.error);
            } else {
                // Se não encontrar o objeto pai
                resolve(false);
            }
        };

        requisicaoBusca.onerror = (e) => reject(e.target.error);
    });
}

/**
 * Cria a estrutura inicial com uma lista de ranking vazia caso a tabela seja recém-criada.
 */
export function initRanking(db, tabela) {
    const rankBlank = { id: 'rankinglist', register: [] };
    const transaction = db.transaction(tabela, "readwrite");
    const store = transaction.objectStore(tabela);
    store.add(rankBlank);
}

/**
 * Registra uma nova pontuação no ranking, consolidando duplicados, ordenando e mantendo os 10 melhores.
 */
export async function addRanking(REGISTER) {
    const banco = 'datiloDB';
    const table = 'ranking';
    const chave = 'rankinglist';
    const db = await abrirBanco(banco, 1, table, initRanking);

    return new Promise((resolve, reject) => {
        const trade = db.transaction(table, 'readwrite');
        const store = trade.objectStore(table);
        const requisicaoBusca = store.get(chave);

        requisicaoBusca.onsuccess = (evento) => {
            // CONDICIONAL / FALLBACK: Pega o registro do banco ou cria a estrutura padrão caso seja nulo
            let object = evento.target.result || { id: chave, register: [] };
            let newList = [...(object.register || []), REGISTER];

            // Ordena primeiro: Maior pontuação ganha; se empatar, o registro mais recente fica na frente
            newList.sort((a, b) => b.score - a.score || new Date(b.data) - new Date(a.data));

            // Remove nomes duplicados mantendo apenas o item com melhor desempenho (o primeiro que o Map encontrar)
            const map = new Map();
            for (const item of newList) {
                // CONDICIONAL: Só adiciona ao Map se aquele nome de jogador ainda não estiver presente
                if (!map.has(item.nome)) {
                    map.set(item.nome, item);
                }
            }

            // Converte de volta para Array e limita a lista nos 10 primeiros lugares
            object.register = Array.from(map.values()).slice(0, 10);

            // Atualiza o registro no IndexedDB com a nova lista consolidada
            const requestAtualizacao = store.put(object);
            requestAtualizacao.onsuccess = () => resolve(object.register);
            requestAtualizacao.onerror = (e) => reject(e.target.error);
        };

        requisicaoBusca.onerror = (e) => reject(e.target.error);
    });
}

/**
 * Lê e retorna a lista atualizada com os 10 melhores jogadores do ranking.
 */
export async function readRanking() {
    const banco = 'datiloDB';
    const table = 'ranking';
    const chave = 'rankinglist';
    const db = await abrirBanco(banco, 1, table, initRanking);

    return new Promise((resolve, reject) => {
        const trade = db.transaction(table, 'readonly');
        const store = trade.objectStore(table);
        const requisicaoBusca = store.get(chave);

        requisicaoBusca.onsuccess = (evento) => {
            const object = evento.target.result;
            // CONDICIONAL TERNÁRIA: Retorna a lista 'register' se ela existir, senão devolve um array vazio
            resolve(object && object.register ? object.register : []);
        };

        requisicaoBusca.onerror = (e) => reject(e.target.error);
    });
}

/**
 * Inicia a conexão com o banco de dados e cria a tabela no IndexedDB se ela não existir.
 * @param {string} NOME_BANCO - Nome do seu banco de dados
 * @param {number} VERSAO - Versão atual do banco
 * @param {string} TABELA - Nome do object store (tabela)
 */
export function abrirBanco(NOME_BANCO, VERSAO, TABELA) {
    // 1. Cria uma "Promessa" (garante que vai avisar se deu certo [resolve] ou errado [reject])
    return new Promise((resolve, reject) => {
      
        // 2. Pede para o navegador abrir o banco de dados com o nome e a versão escolhidos por parâmetro
        const request = indexedDB.open(NOME_BANCO, VERSAO);

        // 3. ALARME: Se o banco for novo ou a versão informada for maior que a atual, executa as linhas abaixo
        request.onupgradeneeded = function(evento) {
        
            // 4. Pega a instância do banco de dados que acabou de ser aberto para poder configurá-lo
            const db = evento.target.result;
        
            // 5. Verifica: "A tabela que eu quero manipular NÃO existe no banco?"
            if (!db.objectStoreNames.contains(TABELA)) {
                
                // 6. Se não existir, cria a tabela definindo que a propriedade 'id' dos objetos será a chave primária
                db.createObjectStore(TABELA, { keyPath: "id" });
            }
            evento.target.transaction.oncomplete = function() {
                resolve(db);
            };
        }; // 7. Fecha o alarme de atualização

        // 8. ALARME: Se o banco abriu com sucesso, avisa a Promessa que deu certo e entrega a conexão pronta
        request.onsuccess = () => {
            // Só faz o resolve aqui se o onupgradeneeded NÃO tiver sido disparado
            // (Evita disparar o resolve duas vezes)
            if (request.result.objectStoreNames.contains(TABELA)) {
                resolve(request.result);
            }
        };
        
        // 9. ALARME: Se o banco deu erro ao abrir, avisa a Promessa que falhou e entrega o motivo do erro
        request.onerror = () => reject(request.error);
    }); // 10. Fecha a Promessa
} // 11. Fecha a função

/**
 * Adiciona um objeto completo dentro de uma tabela do banco de dados.
 * @param {string} NOME_BANCO - Nome do seu banco de dados
 * @param {number} VERSAO - Versão atual do banco
 * @param {string} TABELA - Nome do object store (tabela)
 * @param {Object} ITEM - Objeto JavaScript que será salvo (deve conter a propriedade 'id')
 */
export async function addInDB(NOME_BANCO, VERSAO, TABELA, ITEM) {
  // Abre o banco usando a função assíncrona baseada em Promises
  abrirBanco(NOME_BANCO, VERSAO, TABELA)
    .then((db) => {
      // O banco abriu com sucesso e a conexão está disponível na variável 'db'
      const transacao = db.transaction(TABELA, 'readwrite');
      const store = transacao.objectStore(TABELA);
      
      // Executa o método para salvar o objeto na tabela
      store.add(ITEM);
      
      console.log("Dado salvo com sucesso!");
    })
    .catch((erro) => {
      // Captura e exibe no console caso ocorra alguma falha na abertura ou inserção
      console.error("Falha ao executar:", erro);
    });
}

/**
 * Remove um registro completo (uma linha inteira) da tabela baseado na sua chave primária (Key).
 * @param {string} NOME_BANCO - Nome do seu banco de dados
 * @param {number} VERSAO - Versão atual do banco
 * @param {string} TABELA - Nome do object store (tabela)
 * @param {string|number} Key - A chave primária (id) do registro que será deletado
 */
export async function deleteDBKey(NOME_BANCO, VERSAO, TABELA, Key) {
  try {
    // 1. Abre o banco de dados dinamicamente aguardando a resposta da Promise
    const db = await abrirBanco(NOME_BANCO, VERSAO, TABELA);

    // 2. Abre uma transação no modo de leitura e escrita ('readwrite')
    const transacao = db.transaction(TABELA, 'readwrite');
    const store = transacao.objectStore(TABELA);

    // 3. Executa a remoção do registro usando a chave (Key) informada
    const requisicao = store.delete(Key);

    // 4. Define o comportamento caso o registro seja apagado com sucesso
    requisicao.onsuccess = () => {
      console.log(`Chave "${Key}" removida com sucesso!`);
    };

    // 5. Define o comportamento caso ocorra algum erro durante a remoção
    requisicao.onerror = (evento) => {
      console.error("Erro ao deletar:", evento.target.error);
    };

  } catch (erro) {
    console.error("Erro ao acessar o banco:", erro);
  }
}

/**
 * Remove um item de dentro de um array interno de qualquer objeto salvo no IndexedDB.
 * @param {string} NOME_BANCO - Nome do seu banco de dados
 * @param {number} VERSAO - Versão atual do banco
 * @param {string} TABELA - Nome do object store (tabela)
 * @param {string|number} Key - A chave primária do registro pai que contém a lista
 * @param {string} NOME_ARRAY - O nome da propriedade que guarda o array (ex: 'musicas', 'filhos')
 * @param {string} CAMPO_ID_INTERNO - A propriedade de identificação dentro do array (ex: 'numero', 'id')
 * @param {any} REF - O valor do identificador do item que deve ser removido
 */
export async function deleteDBValue(NOME_BANCO, VERSAO, TABELA, Key, NOME_ARRAY, CAMPO_ID_INTERNO, REF) {
  try {
    // 1. Abre o banco de dados dinamicamente usando os parâmetros fornecidos
    const db = await abrirBanco(NOME_BANCO, VERSAO, TABELA);
    
    const transacao = db.transaction(TABELA, 'readwrite');
    const store = transacao.objectStore(TABELA);

    // 2. Cria uma requisição para buscar o registro pai pela chave primária (Key)
    const requisicaoBusca = store.get(Key);

    // 3. Executa o bloco abaixo quando o registro pai for encontrado com sucesso
    requisicaoBusca.onsuccess = (evento) => {
      const registroPai = evento.target.result;

      // 4. Verifica se o registro existe no banco e se a lista informada em NOME_ARRAY existe dentro dele
      if (registroPai && registroPai[NOME_ARRAY]) {
        
        // 5. Filtra a lista, mantendo apenas os itens cujo ID interno seja DIFERENTE da referência informada
        registroPai[NOME_ARRAY] = registroPai[NOME_ARRAY].filter(itemInterno => {
          // Convertendo ambos os valores para String para evitar problemas de comparação entre Texto e Número
          return String(itemInterno[CAMPO_ID_INTERNO]) !== String(REF);
        });

        // 6. Grava o objeto pai modificado de volta na tabela, substituindo a versão antiga (.put)
        const requisicaoAtualizar = store.put(registroPai);

        // 7. Confirma no console quando a alteração for persistida com sucesso no armazenamento do navegador
        requisicaoAtualizar.onsuccess = () => {
          console.log(`Item com ${CAMPO_ID_INTERNO} igual a '${REF}' foi removido de '${NOME_ARRAY}' com sucesso!`);
        };
        
      } else {
        console.log(`Registro pai ou a lista '${NOME_ARRAY}' não foram encontrados.`);
      }
    };

  } catch (erro) {
    console.error("Erro genérico ao processar remoção:", erro);
  }
}

/**
 * Adiciona um novo item dentro de um array interno de qualquer objeto salvo no IndexedDB.
 * @param {string} NOME_BANCO - Nome do seu banco de dados
 * @param {number} VERSAO - Versão atual do banco
 * @param {string} TABELA - Nome do object store (tabela)
 * @param {string|number} Key - A chave primária do registro pai que contém a lista
 * @param {string} NOME_ARRAY - O nome da propriedade que guarda o array (ex: 'musicas', 'filhos')
 * @param {Object} NOVO_ITEM - O novo objeto/item que será inserido dentro desse array
 */
export async function addDBValue(NOME_BANCO, VERSAO, TABELA, Key, NOME_ARRAY, NOVO_ITEM) {
  try {
    // 1. Abre o banco de dados dinamicamente usando os parâmetros fornecidos
    const db = await abrirBanco(NOME_BANCO, VERSAO, TABELA);
    
    const transacao = db.transaction(TABELA, 'readwrite');
    const store = transacao.objectStore(TABELA);

    // 2. Cria uma requisição para buscar o registro pai pela chave primária (Key)
    const requisicaoBusca = store.get(Key);

    // 3. Executa o bloco abaixo quando o registro pai for encontrado com sucesso
    requisicaoBusca.onsuccess = (evento) => {
      const registroPai = evento.target.result;

      // 4. Verifica se o registro pai existe
      if (registroPai) {
        
        // 5. Se o array interno ainda não existir no objeto, inicializa ele como um array vazio []
        if (!registroPai[NOME_ARRAY]) {
          registroPai[NOME_ARRAY] = [];
        }

        // 6. Insere o novo item no final da lista usando o .push()
        registroPai[NOME_ARRAY].push(NOVO_ITEM);

        // 7. Grava o objeto pai modificado de volta na tabela, substituindo a versão antiga (.put)
        const requisicaoAtualizar = store.put(registroPai);

        // 8. Confirma no console quando a alteração for persistida com sucesso
        requisicaoAtualizar.onsuccess = () => {
          console.log(`Novo item adicionado na lista '${NOME_ARRAY}' com sucesso!`);
        };
        
      } else {
        console.log(`Registro pai com a chave '${Key}' não foi encontrado.`);
      }
    };

  } catch (erro) {
    console.error("Erro genérico ao processar adição:", erro);
  }
}

// Objeto de teste representando a estrutura de uma playlist
const novaPlaylist = {
  id: "playlist-rock-iarlhy",
  nome: "Playlist Rock",
  criador: "Iarlhy",
  musicas: [ 
    { 
      numero: 1, 
      titulo: "Song One"
    },
    { 
      numero: 2, 
      titulo: "Song Two"
    }
  ]
};
// FUNÇOES ESPECIFICAS DO PROJETO ..

export async function addRanking(REGISTER) {
  const banco = 'datiloDB';
  const table = 'ranking';
  const chave = 'rankinglist';
  const db = await abrirBanco(banco,1,table);
  const trade = db.transaction(table,'readwrite');
  const store = trade.objectStore(table);
  const requisicaoBusca = store.get(chave);

  requisicaoBusca.onsuccess = (evento) => {
    let object = evento.target.result;
    let target = object['register'];
    let newList = [];
    console.log('velho ',object);
    for (let i = 0; i < target.length; i++) {
      let log = target[i]
      console.log(log)
      if (log['nome'] === REGISTER['nome']) {
        console.log('igual')
        if (REGISTER['score'] > log['score']) {
          console.log('é maior')
          console.log('log removido ',log)
          newList.push(REGISTER)
        }
        else {
          newList.push(log)
        }
      }
      else {
        newList.push(log)
      }
    }
    if (target.length < 10){
      newList.push(REGISTER)
    }
    else {
      let decimo = target[9]
      if (REGISTER['score'] > decimo['score']) {
        newList.push(REGISTER)
      }
    }
    
    newList.sort((a, b) => b.score - a.score);
    object['register'] = newList
    console.log('novo ',object)
    deleteDBKey(banco,1,table,chave)
    addInDB(banco,1,table,object)
  }
}

export async function readRanking() {
  const banco = 'datiloDB';
  const table = 'ranking';
  const chave = 'rankinglist';
  const db = await abrirBanco(banco, 1, table);
  const trade = db.transaction(table, 'readwrite');
  const store = trade.objectStore(table);
  const requisicaoBusca = store.get(chave);

  return new Promise((resolve, reject) => {
    requisicaoBusca.onsuccess = (evento) => {
      let object = evento.target.result;
      
      if (object && object['register']) {
        resolve(object['register']);
      } else {
        resolve("Nenhum registro encontrado"); 
      }
    };

    requisicaoBusca.onerror = (evento) => {
      reject("Erro ao ler o banco de dados");
    };
  });
}
/*
let rankinglist = {
  id:'rankinglist',
  register: [
    {
      data:'20260818',
      nome:'joao',
      score:211, //3
      ts:'1/s',
      time:'8.8/s'
    },
    {
      data:'20260818',
      nome:'maria',
      score:212, //2
      ts:'1/s',
      time:'8.8/s'
    },
    {
      data:'20260818',
      nome:'pedro',
      score:213, //1
      ts:'1/s',
      time:'8.8/s'
    }
  ]
}
*/
//addInDB('datiloDB',1,'ranking',rankinglist)

/*
let registro = {
  data:'20260816',
  nome:'renato',
  score:214, //1
  ts:'1/s',
  time:'8.8/s'
}
*/
//addRanking(registro)


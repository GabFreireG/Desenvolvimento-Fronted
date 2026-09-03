/**
 * Busca as tarefas do arquivo dados.json
 */
export async function carregarTarefas() {
  try {
    const resposta = await fetch('dados.json');
    
    if (!resposta.ok) {
      throw new Error(`Erro na requisição HTTP: ${resposta.status}`);
    }

    const dados = await resposta.json();

    if (Array.isArray(dados)) {
      return dados;
    }

    if (dados && Array.isArray(dados.tarefas)) {
      return dados.tarefas;
    }

    return [];
  } catch (erro) {
    console.error('Falha ao buscar tarefas no arquivo dados.json:', erro);
    throw erro;
  }
}

export const buscarTarefas = carregarTarefas;
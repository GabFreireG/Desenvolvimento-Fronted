import { carregarTarefas } from './api.js';
import { renderizarEstado } from './estados.js';
import { inicializarEfeitoEletrico } from './eletricidade.js';

async function inicializar() {
  renderizarEstado('carregando');

  try {
    const tarefas = await carregarTarefas();

    if (tarefas.length === 0) {
      renderizarEstado('vazio', 'Nenhuma tarefa encontrada no arquivo de dados.');
    } else {
      renderizarEstado('sucesso', tarefas);
    }
  } catch (erro) {
    let mensagemErro = 'Falha ao carregar as tarefas.';

    if (erro.name === 'TypeError') {
      mensagemErro = 'Erro de rede: Não foi possível conectar ao servidor. Verifique se você está online.';
    } else if (erro.name === 'SyntaxError') {
      mensagemErro = 'Erro de formato: O arquivo JSON contém erros de sintaxe ou estrutura inválida.';
    } else if (erro.name === 'HttpError' || erro.status) {
      mensagemErro = `Erro de protocolo: Falha na requisição HTTP (Status ${erro.status || 'desconhecido'}).`;
    }

    renderizarEstado('erro', mensagemErro);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarEfeitoEletrico();

  const formFiltros = document.getElementById('formFiltros');
  if (formFiltros) {
    formFiltros.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  }

  inicializar();
});
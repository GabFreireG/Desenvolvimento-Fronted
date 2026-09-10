import { carregarTarefas } from './api.js';
import { renderizarEstado } from './estados.js';
import { inicializarEfeitoEletrico } from './eletricidade.js';

// Estado único da aplicação
const estado = {
  tarefas: [],
  busca: '',
  status: 'todos',
  prioridade: 'todas',
  ordenacao: 'padrao',
  carregamento: true,
  erro: null
};

// Função de derivação pura: obtém a lista filtrada/ordenada sem alterar estado.tarefas
function derivarTarefasVisiveis(estadoAtual) {
  let resultado = [...estadoAtual.tarefas];

  if (estadoAtual.busca) {
    const termo = estadoAtual.busca.toLowerCase();
    resultado = resultado.filter(t => t.titulo.toLowerCase().includes(termo));
  }

  if (estadoAtual.status !== 'todos') {
    resultado = resultado.filter(t => t.status === estadoAtual.status);
  }

  if (estadoAtual.prioridade !== 'todas') {
    resultado = resultado.filter(t => t.prioridade === estadoAtual.prioridade);
  }

  if (estadoAtual.ordenacao === 'prazoAsc') {
    resultado.sort((a, b) => new Date(a.prazo) - new Date(b.prazo));
  } else if (estadoAtual.ordenacao === 'prazoDesc') {
    resultado.sort((a, b) => new Date(b.prazo) - new Date(a.prazo));
  }

  return resultado;
}

// Ciclo único de atualização e renderização
function atualizarInterface() {
  if (estado.carregamento) {
    renderizarEstado('carregando', null, estado);
    return;
  }

  if (estado.erro) {
    renderizarEstado('erro', estado.erro, estado);
    return;
  }

  if (estado.tarefas.length === 0) {
    renderizarEstado('origemVazia', 'Nenhuma tarefa encontrada no arquivo de dados.', estado);
    return;
  }

  const tarefasVisiveis = derivarTarefasVisiveis(estado);

  if (tarefasVisiveis.length === 0) {
    renderizarEstado('resultadoVazio', 'Nenhuma tarefa corresponde aos critérios selecionados.', estado);
  } else {
    renderizarEstado('sucesso', tarefasVisiveis, estado);
  }
}

async function inicializar() {
  estado.carregamento = true;
  estado.erro = null;
  atualizarInterface();

  try {
    const dados = await carregarTarefas();
    estado.tarefas = dados;
    estado.carregamento = false;
  } catch (erro) {
    estado.carregamento = false;
    if (erro.name === 'TypeError') {
      estado.erro = 'Erro de rede: Não foi possível conectar ao servidor. Verifique se você está online.';
    } else if (erro.name === 'SyntaxError') {
      estado.erro = 'Erro de formato: O arquivo JSON contém erros de sintaxe ou estrutura inválida.';
    } else if (erro.name === 'HttpError' || erro.status) {
      estado.erro = `Erro de protocolo: Falha na requisição HTTP (Status ${erro.status || 'desconhecido'}).`;
    } else {
      estado.erro = 'Falha ao carregar as tarefas.';
    }
  }

  atualizarInterface();
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarEfeitoEletrico();

  const formFiltros = document.getElementById('formFiltros');
  const campoBusca = document.getElementById('buscaTitulo');
  const selectOrdenacao = document.getElementById('ordenacaoPrazo');
  const btnLimparFiltros = document.getElementById('btnLimparFiltros');

  if (formFiltros) {
    formFiltros.addEventListener('submit', (event) => {
      event.preventDefault();
      atualizarInterface();
    });

    formFiltros.addEventListener('change', (event) => {
      if (event.target.name === 'filtroStatus') {
        estado.status = event.target.value;
        atualizarInterface();
      } else if (event.target.name === 'filtroPrioridade') {
        estado.prioridade = event.target.value;
        atualizarInterface();
      }
    });
  }

  if (campoBusca) {
    campoBusca.addEventListener('input', (event) => {
      estado.busca = event.target.value;
      atualizarInterface();
    });
  }

  if (selectOrdenacao) {
    selectOrdenacao.addEventListener('change', (event) => {
      estado.ordenacao = event.target.value;
      atualizarInterface();
    });
  }

  if (btnLimparFiltros) {
    btnLimparFiltros.addEventListener('click', () => {
      estado.busca = '';
      estado.status = 'todos';
      estado.prioridade = 'todas';
      estado.ordenacao = 'padrao';

      if (campoBusca) campoBusca.value = '';
      if (selectOrdenacao) selectOrdenacao.value = 'padrao';

      const radioStatusTodos = document.querySelector('input[name="filtroStatus"][value="todos"]');
      if (radioStatusTodos) radioStatusTodos.checked = true;

      const radioPrioridadeTodas = document.querySelector('input[name="filtroPrioridade"][value="todas"]');
      if (radioPrioridadeTodas) radioPrioridadeTodas.checked = true;

      atualizarInterface();
    });
  }

  inicializar();
});
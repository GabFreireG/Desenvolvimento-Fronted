import { carregarTarefas } from './api.js';
import { renderizarTarefas } from './renderizacao.js';
import { exibirEstado } from './estados.js';
import { inicializarEfeitoEletrico } from './eletricidade.js';

let tarefasAtuais = [];

function anunciarStatus(mensagem) {
  const regiaoStatus = document.getElementById('regiaoStatus');
  if (regiaoStatus) {
    regiaoStatus.textContent = mensagem;
  }
}

function aplicarFiltrosEBusca() {
  const buscaInput = document.getElementById('buscaTitulo').value.toLowerCase().trim();
  const statusSelecionado = document.querySelector('input[name="filtroStatus"]:checked')?.value || 'todos';
  const prioridadeSelecionada = document.querySelector('input[name="filtroPrioridade"]:checked')?.value || 'todas';

  const tarefasFiltradas = tarefasAtuais.filter(tarefa => {
    const atendeBusca = tarefa.titulo.toLowerCase().includes(buscaInput);
    const atendeStatus = statusSelecionado === 'todos' || tarefa.status === statusSelecionado;
    const atendePrioridade = prioridadeSelecionada === 'todas' || tarefa.prioridade === prioridadeSelecionada;

    return atendeBusca && atendeStatus && atendePrioridade;
  });

  exibirEstado('limpar');

  if (tarefasFiltradas.length === 0) {
    renderizarTarefas([]);
    exibirEstado('vazio');
    anunciarStatus('Nenhuma tarefa encontrada para os filtros selecionados.');
  } else {
    renderizarTarefas(tarefasFiltradas);
    anunciarStatus(`${tarefasFiltradas.length} tarefa(s) exibida(s).`);
  }
}

async function inicializar() {
  exibirEstado('carregando');
  anunciarStatus('Carregando tarefas...');

  try {
    tarefasAtuais = await carregarTarefas();
    exibirEstado('limpar');
    renderizarTarefas(tarefasAtuais);
    anunciarStatus('Tarefas carregadas com sucesso.');
  } catch (erro) {
    console.error('Erro na inicialização:', erro);
    exibirEstado('erro', 'Não foi possível carregar as tarefas. Verifique o arquivo dados.json.');
    anunciarStatus('Erro ao carregar as tarefas.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Ativa o ouvinte do efeito elétrico proporcional
  inicializarEfeitoEletrico();

  const formFiltros = document.getElementById('formFiltros');
  const btnAplicarFiltros = document.getElementById('btnAplicarFiltros');

  if (formFiltros) {
    formFiltros.addEventListener('submit', (event) => {
      event.preventDefault();
      aplicarFiltrosEBusca();
    });
  }

  if (btnAplicarFiltros) {
    btnAplicarFiltros.addEventListener('click', () => {
      aplicarFiltrosEBusca();
    });
  }

  inicializar();
});
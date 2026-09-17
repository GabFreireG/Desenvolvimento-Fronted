import { carregarTarefas } from './api.js';
import { renderizarEstado } from './estados.js';
import { inicializarEfeitoEletrico } from './eletricidade.js';
import { renderizarGridMeses, renderizarDiasDoMes } from './calendario.js';

const estado = {
  tarefas: [],
  busca: '',
  mes: '08',
  mesSelecionado: 7,
  diaSelecionado: null,
  prioridade: 'todas',
  ordenacao: 'padrao',
  agruparPrioridade: 'nenhum',
  ordenarPorDia: 'asc',
  modoMeses: 'detalhado',
  carregamento: true,
  erro: null,
  ano: 2026
};

function inicializarRelogio() {
  const relogioEl = document.getElementById('relogioDigital');
  if (!relogioEl) return;

  function atualizarHora() {
    const agora = new Date();
    const hh = String(agora.getHours()).padStart(2, '0');
    const mm = String(agora.getMinutes()).padStart(2, '0');
    const ss = String(agora.getSeconds()).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();

    relogioEl.innerHTML = `
      <div class="relogio-hora">${hh}:${mm}:${ss}</div>
      <div class="relogio-data">${dia}/${mes}/${ano}</div>
    `;
  }

  atualizarHora();
  setInterval(atualizarHora, 1000);
}

function excluirTarefa(id) {
  estado.tarefas = estado.tarefas.filter(t => t.id !== id);
  atualizarInterface();
}

function derivarTarefasVisiveis(estadoAtual) {
  let resultado = [...estadoAtual.tarefas];

  if (estadoAtual.busca) {
    const termo = estadoAtual.busca.toLowerCase();
    resultado = resultado.filter(t => t.titulo.toLowerCase().includes(termo));
  }

  if (estadoAtual.mes !== 'todos') {
    resultado = resultado.filter(t => {
      if (!t.prazo) return false;
      const partes = t.prazo.split('-');
      return partes[1] === estadoAtual.mes;
    });
  }

  if (estadoAtual.diaSelecionado) {
    resultado = resultado.filter(t => t.prazo === estadoAtual.diaSelecionado);
  }

  if (estadoAtual.prioridade !== 'todas') {
    resultado = resultado.filter(t => t.prioridade === estadoAtual.prioridade);
  }

  // Ordenação por Dia
  resultado.sort((a, b) => {
    const diaA = parseInt(a.prazo ? a.prazo.split('-')[2] : 0, 10);
    const diaB = parseInt(b.prazo ? b.prazo.split('-')[2] : 0, 10);
    return estadoAtual.ordenarPorDia === 'asc' ? diaA - diaB : diaB - diaA;
  });

  return resultado;
}

function atualizarInterface() {
  if (estado.carregamento) {
    renderizarEstado('carregando', null, estado, excluirTarefa);
    return;
  }

  if (estado.erro) {
    renderizarEstado('erro', estado.erro, estado, excluirTarefa);
    return;
  }

  renderizarGridMeses(
    estado,
    (mesIndex) => {
      estado.mesSelecionado = mesIndex;
      estado.mes = String(mesIndex + 1).padStart(2, '0');
      estado.diaSelecionado = null;

      const selectMes = document.getElementById('filtroMes');
      if (selectMes) selectMes.value = estado.mes;

      atualizarInterface();
    },
    (novoModo) => {
      estado.modoMeses = novoModo;
      atualizarInterface();
    }
  );

  renderizarDiasDoMes(
    estado,
    (diaFormatado) => {
      estado.diaSelecionado = estado.diaSelecionado === diaFormatado ? null : diaFormatado;
      atualizarInterface();
    },
    () => {
      estado.diaSelecionado = null;
      atualizarInterface();
    }
  );

  const tarefasVisiveis = derivarTarefasVisiveis(estado);

  if (tarefasVisiveis.length === 0) {
    renderizarEstado('resultadoVazio', 'Nenhuma tarefa encontrada para a seleção.', estado, excluirTarefa);
  } else {
    renderizarEstado('sucesso', tarefasVisiveis, estado, excluirTarefa);
  }
}

function configurarModal() {
  const modal = document.getElementById('modalNovaTarefa');
  const btnAbrir = document.getElementById('btnAbrirModalCriar');
  const btnFechar = document.getElementById('btnFecharModal');
  const btnCancelar = document.getElementById('btnCancelarModal');
  const formModal = document.getElementById('formNovaTarefa');

  if (!modal) return;

  const abrirModal = () => modal.showModal();
  const fecharModal = () => modal.close();

  if (btnAbrir) btnAbrir.addEventListener('click', abrirModal);
  if (btnFechar) btnFechar.addEventListener('click', fecharModal);
  if (btnCancelar) btnCancelar.addEventListener('click', fecharModal);

  if (formModal) {
    formModal.addEventListener('submit', (e) => {
      e.preventDefault();
      const novaTarefa = {
        id: Date.now(),
        titulo: document.getElementById('novaTitulo').value,
        projeto: document.getElementById('novoProjeto').value,
        responsavel: document.getElementById('novoResponsavel').value,
        prazo: document.getElementById('novoPrazo').value,
        prioridade: document.getElementById('novaPrioridade').value,
        status: document.getElementById('novoStatus').value
      };

      estado.tarefas.unshift(novaTarefa);
      formModal.reset();
      fecharModal();
      atualizarInterface();
    });
  }
}

async function inicializar() {
  inicializarRelogio();
  configurarModal();
  estado.carregamento = true;
  estado.erro = null;
  atualizarInterface();

  try {
    const dados = await carregarTarefas();
    estado.tarefas = dados;
    estado.carregamento = false;
  } catch (erro) {
    estado.carregamento = false;
    estado.erro = 'Falha ao carregar as tarefas.';
  }

  atualizarInterface();
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarEfeitoEletrico();

  const campoBusca = document.getElementById('buscaTitulo');
  const seletorMes = document.getElementById('filtroMes');
  const seletorPrioridade = document.getElementById('filtroPrioridade');
  const seletorOrdenacao = document.getElementById('ordenacaoPrazo');
  const selectAgrupar = document.getElementById('agruparPrioridade');
  const selectOrdenarDia = document.getElementById('ordenarPorDia');
  const btnLimpar = document.getElementById('btnLimparFiltros');

  if (campoBusca) {
    campoBusca.addEventListener('input', (e) => {
      estado.busca = e.target.value;
      atualizarInterface();
    });
  }

  if (seletorMes) {
    seletorMes.value = estado.mes;
    seletorMes.addEventListener('change', (e) => {
      estado.mes = e.target.value;
      estado.mesSelecionado = e.target.value === 'todos' ? null : parseInt(e.target.value, 10) - 1;
      estado.diaSelecionado = null;
      atualizarInterface();
    });
  }

  if (seletorPrioridade) {
    seletorPrioridade.addEventListener('change', (e) => {
      estado.prioridade = e.target.value;
      atualizarInterface();
    });
  }

  if (seletorOrdenacao) {
    seletorOrdenacao.addEventListener('change', (e) => {
      estado.ordenacao = e.target.value;
      atualizarInterface();
    });
  }

  if (selectAgrupar) {
    selectAgrupar.addEventListener('change', (e) => {
      estado.agruparPrioridade = e.target.value;
      atualizarInterface();
    });
  }

  if (selectOrdenarDia) {
    selectOrdenarDia.addEventListener('change', (e) => {
      estado.ordenarPorDia = e.target.value;
      atualizarInterface();
    });
  }

  if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
      estado.busca = '';
      estado.mes = '08';
      estado.mesSelecionado = 7;
      estado.diaSelecionado = null;
      estado.prioridade = 'todas';
      estado.ordenacao = 'padrao';
      estado.agruparPrioridade = 'nenhum';
      estado.ordenarPorDia = 'asc';

      if (campoBusca) campoBusca.value = '';
      if (seletorMes) seletorMes.value = '08';
      if (seletorPrioridade) seletorPrioridade.value = 'todas';
      if (seletorOrdenacao) seletorOrdenacao.value = 'padrao';
      if (selectAgrupar) selectAgrupar.value = 'nenhum';
      if (selectOrdenarDia) selectOrdenarDia.value = 'asc';

      atualizarInterface();
    });
  }

  inicializar();
});
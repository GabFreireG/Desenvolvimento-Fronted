import { renderizarTarefas } from './renderizacao.js';

export function renderizarEstado(estado, dados) {
  const containerEstado = document.getElementById('containerEstado');
  const regiaoStatus = document.getElementById('regiaoStatus');

  if (estado === 'carregando') {
    renderizarTarefas([]);
    if (containerEstado) {
      containerEstado.textContent = 'Carregando tarefas...';
      containerEstado.className = 'estado-feedback';
    }
    if (regiaoStatus) {
      regiaoStatus.textContent = 'Carregando tarefas, por favor aguarde.';
    }
  } else if (estado === 'sucesso') {
    if (containerEstado) {
      containerEstado.textContent = '';
      containerEstado.className = '';
    }
    const lista = Array.isArray(dados) ? dados : [];
    renderizarTarefas(lista);
    if (regiaoStatus) {
      regiaoStatus.textContent = `${lista.length} tarefa(s) carregada(s) com sucesso.`;
    }
  } else if (estado === 'vazio') {
    renderizarTarefas([]);
    const mensagemVazio = typeof dados === 'string' && dados ? dados : 'Nenhuma tarefa cadastrada.';
    if (containerEstado) {
      containerEstado.textContent = mensagemVazio;
      containerEstado.className = 'estado-feedback';
    }
    if (regiaoStatus) {
      regiaoStatus.textContent = mensagemVazio;
    }
  } else if (estado === 'erro') {
    renderizarTarefas([]);
    const mensagemErro = typeof dados === 'string' && dados ? dados : 'Ocorreu um erro ao carregar as tarefas.';
    if (containerEstado) {
      containerEstado.textContent = mensagemErro;
      containerEstado.className = 'estado-feedback erro';
    }
    if (regiaoStatus) {
      regiaoStatus.textContent = mensagemErro;
    }
  }
}
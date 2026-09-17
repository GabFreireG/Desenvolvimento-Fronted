import { renderizarTarefas } from './renderizacao.js';

export function renderizarEstado(estado, dados, estadoGlobal, aoExcluir) {
  const containerEstado = document.getElementById('containerEstado');
  const regiaoStatus = document.getElementById('regiaoStatus');
  const contadorTarefas = document.getElementById('contadorTarefas');

  const totalOriginal = estadoGlobal ? estadoGlobal.tarefas.length : 0;

  if (estado === 'carregando') {
    renderizarTarefas([], aoExcluir);
    if (containerEstado) {
      containerEstado.textContent = 'Carregando agenda...';
      containerEstado.className = 'estado-feedback';
    }
    if (contadorTarefas) contadorTarefas.textContent = '';
  } else if (estado === 'sucesso') {
    if (containerEstado) {
      containerEstado.textContent = '';
      containerEstado.className = '';
    }
    const lista = Array.isArray(dados) ? dados : [];
    renderizarTarefas(lista, aoExcluir);

    const mensagemContador = `${lista.length} de ${totalOriginal} tarefas exibidas`;
    if (contadorTarefas) contadorTarefas.textContent = mensagemContador;
    if (regiaoStatus) regiaoStatus.textContent = mensagemContador;
  } else if (estado === 'resultadoVazio') {
    renderizarTarefas([], aoExcluir);
    const msg = typeof dados === 'string' ? dados : 'Nenhuma tarefa encontrada para a seleção.';
    if (containerEstado) {
      containerEstado.textContent = msg;
      containerEstado.className = 'estado-feedback';
    }
    if (contadorTarefas) contadorTarefas.textContent = `0 de ${totalOriginal} tarefas exibidas`;
  } else if (estado === 'erro') {
    renderizarTarefas([], aoExcluir);
    const msg = typeof dados === 'string' ? dados : 'Erro ao carregar a agenda.';
    if (containerEstado) {
      containerEstado.textContent = msg;
      containerEstado.className = 'estado-feedback erro';
    }
  }
}
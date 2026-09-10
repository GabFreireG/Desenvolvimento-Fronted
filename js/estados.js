import { renderizarTarefas } from './renderizacao.js';

export function renderizarEstado(estado, dados, estadoGlobal) {
  const containerEstado = document.getElementById('containerEstado');
  const regiaoStatus = document.getElementById('regiaoStatus');
  const contadorTarefas = document.getElementById('contadorTarefas');

  const totalOriginal = estadoGlobal ? estadoGlobal.tarefas.length : 0;

  if (estado === 'carregando') {
    renderizarTarefas([]);
    if (containerEstado) {
      containerEstado.textContent = 'Carregando tarefas...';
      containerEstado.className = 'estado-feedback';
    }
    if (regiaoStatus) {
      regiaoStatus.textContent = 'Carregando tarefas, por favor aguarde.';
    }
    if (contadorTarefas) {
      contadorTarefas.textContent = '';
    }
  } else if (estado === 'sucesso') {
    if (containerEstado) {
      containerEstado.textContent = '';
      containerEstado.className = '';
    }
    const lista = Array.isArray(dados) ? dados : [];
    renderizarTarefas(lista);

    const mensagemContador = `${lista.length} de ${totalOriginal} tarefas exibidas`;
    if (regiaoStatus) {
      regiaoStatus.textContent = mensagemContador;
    }
    if (contadorTarefas) {
      contadorTarefas.textContent = mensagemContador;
    }
  } else if (estado === 'origemVazia') {
    renderizarTarefas([]);
    const mensagemVazio = typeof dados === 'string' && dados ? dados : 'Nenhuma tarefa cadastrada.';
    if (containerEstado) {
      containerEstado.textContent = mensagemVazio;
      containerEstado.className = 'estado-feedback';
    }
    if (regiaoStatus) {
      regiaoStatus.textContent = mensagemVazio;
    }
    if (contadorTarefas) {
      contadorTarefas.textContent = '0 tarefas disponíveis';
    }
  } else if (estado === 'resultadoVazio') {
    renderizarTarefas([]);
    const mensagemSemResultado = typeof dados === 'string' && dados ? dados : 'Nenhum resultado encontrado para os filtros aplicados.';
    if (containerEstado) {
      containerEstado.textContent = mensagemSemResultado;
      containerEstado.className = 'estado-feedback';
    }
    if (regiaoStatus) {
      regiaoStatus.textContent = mensagemSemResultado;
    }
    if (contadorTarefas) {
      contadorTarefas.textContent = `0 de ${totalOriginal} tarefas exibidas`;
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
    if (contadorTarefas) {
      contadorTarefas.textContent = '';
    }
  }
}
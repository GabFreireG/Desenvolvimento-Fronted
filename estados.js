export function exibirEstado(tipo, mensagem = '') {
  const containerKanban = document.querySelector('.kanban-grid');
  let elementoFeedback = document.getElementById('estadoFeedback');

  if (tipo === 'limpar') {
    if (elementoFeedback) elementoFeedback.remove();
    return;
  }

  if (!elementoFeedback) {
    elementoFeedback = document.createElement('div');
    elementoFeedback.id = 'estadoFeedback';
    elementoFeedback.className = 'estado-feedback';
    if (containerKanban && containerKanban.parentNode) {
      containerKanban.parentNode.insertBefore(elementoFeedback, containerKanban);
    }
  }

  if (tipo === 'carregando') {
    elementoFeedback.textContent = 'Carregando tarefas...';
  } else if (tipo === 'erro') {
    elementoFeedback.textContent = mensagem || 'Ocorreu um erro ao carregar as tarefas.';
  } else if (tipo === 'vazio') {
    elementoFeedback.textContent = mensagem || 'Nenhuma tarefa encontrada com os filtros aplicados.';
  }
}
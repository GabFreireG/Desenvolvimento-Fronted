function obterColunas() {
  return {
    aFazer: document.querySelector('section[aria-labelledby="aFazer"] ul'),
    emAndamento: document.querySelector('section[aria-labelledby="emAndamento"] ul'),
    emRevisao: document.querySelector('section[aria-labelledby="emRevisao"] ul'),
    concluida: document.querySelector('section[aria-labelledby="tarefasConcluidas"] ul')
  };
}

function limparColunas() {
  const colunas = obterColunas();
  Object.values(colunas).forEach(coluna => {
    if (coluna) coluna.innerHTML = '';
  });
}

function criarCartaoTarefa(tarefa) {
  const li = document.createElement('li');
  const dataFormatada = new Date(tarefa.prazo + 'T00:00:00').toLocaleDateString('pt-BR');

  li.innerHTML = `
    <article>
      <h4>${tarefa.titulo}</h4>
      <dl>
        <dt>Projeto:</dt>
        <dd>${tarefa.projeto}</dd>

        <dt>Responsável:</dt>
        <dd>${tarefa.responsavel}</dd>

        <dt>Prazo:</dt>
        <dd><time datetime="${tarefa.prazo}">${dataFormatada}</time></dd>

        <dt>Prioridade:</dt>
        <dd>${tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1)}</dd>
      </dl>
    </article>
  `;

  return li;
}

export function renderizarTarefas(tarefas) {
  limparColunas();

  if (!Array.isArray(tarefas)) return;

  const colunas = obterColunas();

  tarefas.forEach(tarefa => {
    const colunaDestino = colunas[tarefa.status];
    if (colunaDestino) {
      const cartaoElemento = criarCartaoTarefa(tarefa);
      colunaDestino.appendChild(cartaoElemento);
    }
  });
}
function formatarStatus(status) {
  const mapa = {
    aFazer: 'A Fazer',
    emAndamento: 'Em Andamento',
    emRevisao: 'Em Revisão',
    concluida: 'Concluída'
  };
  return mapa[status] || status;
}

function criarCartaoTarefa(tarefa, aoExcluir) {
  const div = document.createElement('div');
  const dataFormatada = new Date(tarefa.prazo + 'T00:00:00').toLocaleDateString('pt-BR');

  const article = document.createElement('article');
  article.className = 'card-tarefa';

  article.innerHTML = `
    <div class="card-header-tarefa">
      <h4>${tarefa.titulo}</h4>
      <button type="button" class="btn-excluir" title="Excluir tarefa" aria-label="Excluir tarefa">
        <svg class="icone-lixeira" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
    <dl>
      <dt>Projeto:</dt>
      <dd>${tarefa.projeto}</dd>

      <dt>Responsável:</dt>
      <dd>${tarefa.responsavel}</dd>

      <dt>Prazo:</dt>
      <dd><time datetime="${tarefa.prazo}">${dataFormatada}</time></dd>

      <dt>Prioridade:</dt>
      <dd>${tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1)}</dd>

      <dt>Status:</dt>
      <dd><span class="badge-status ${tarefa.status}">${formatarStatus(tarefa.status)}</span></dd>
    </dl>
  `;

  const btnExcluir = article.querySelector('.btn-excluir');
  if (btnExcluir) {
    btnExcluir.addEventListener('click', (e) => {
      e.stopPropagation();

      if (article.classList.contains('card-eletrocutando')) return;
      article.classList.add('card-eletrocutando');

      setTimeout(() => {
        aoExcluir(tarefa.id);
      }, 450);
    });
  }

  div.appendChild(article);
  return div.firstElementChild;
}

export function renderizarTarefas(tarefas, aoExcluir, agruparPrioridade = 'nenhum') {
  const container = document.getElementById('containerCardsTarefas');
  if (!container) return;

  container.innerHTML = '';

  if (!Array.isArray(tarefas) || tarefas.length === 0) {
    return;
  }

  if (agruparPrioridade === 'importancia') {
    const grupos = {
      alta: { titulo: '🔥 Alta Importância', tarefas: [] },
      media: { titulo: '⚡ Média Importância', tarefas: [] },
      baixa: { titulo: '🌱 Baixa Importância', tarefas: [] }
    };

    tarefas.forEach(t => {
      const p = t.prioridade || 'baixa';
      if (grupos[p]) grupos[p].tarefas.push(t);
      else grupos.baixa.tarefas.push(t);
    });

    Object.keys(grupos).forEach(chave => {
      const grupo = grupos[chave];
      if (grupo.tarefas.length > 0) {
        const secaoGrupo = document.createElement('div');
        secaoGrupo.className = 'grupo-prioridade-secao';

        const tituloGrupo = document.createElement('h3');
        tituloGrupo.className = `titulo-grupo-prioridade prioridade-${chave}`;
        tituloGrupo.textContent = `${grupo.titulo} (${grupo.tarefas.length})`;

        const gridCards = document.createElement('div');
        gridCards.className = 'cards-grid';

        grupo.tarefas.forEach(tarefa => {
          gridCards.appendChild(criarCartaoTarefa(tarefa, aoExcluir));
        });

        secaoGrupo.appendChild(tituloGrupo);
        secaoGrupo.appendChild(gridCards);
        container.appendChild(secaoGrupo);
      }
    });
  } else {
    const gridCards = document.createElement('div');
    gridCards.className = 'cards-grid';

    tarefas.forEach(tarefa => {
      gridCards.appendChild(criarCartaoTarefa(tarefa, aoExcluir));
    });

    container.appendChild(gridCards);
  }
}
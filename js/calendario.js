const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const INICIAIS_MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export function renderizarGridMeses(estado, aoSelecionarMes, aoMudarModo) {
  const conteinerCalendario = document.getElementById('gridMeses');
  if (!conteinerCalendario) return;

  conteinerCalendario.innerHTML = '';

  const gridWrapper = document.createElement('div');
  
  if (estado.modoMeses === 'compacto') {
    gridWrapper.className = 'grid-meses-compacto';
    INICIAIS_MESES.forEach((inicial, index) => {
      const estaAtivo = estado.mesSelecionado === index;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn-mes-inicial ${estaAtivo ? 'ativo' : ''}`;
      btn.textContent = inicial;
      btn.addEventListener('click', () => aoSelecionarMes(index));
      gridWrapper.appendChild(btn);
    });
  } else {
    gridWrapper.className = 'grid-meses-6x2';
    NOMES_MESES.forEach((nomeMes, index) => {
      const estaAtivo = estado.mesSelecionado === index;
      const card = document.createElement('div');
      card.className = `card-mes ${estaAtivo ? 'ativo' : ''}`;
      card.innerHTML = `<span class="nome-mes">${nomeMes}</span>`;
      card.addEventListener('click', () => aoSelecionarMes(index));
      gridWrapper.appendChild(card);
    });
  }

  conteinerCalendario.appendChild(gridWrapper);

  // Controles discretos em ícones alinhados abaixo do primeiro mês (canto esquerdo)
  const rodapeControles = document.createElement('div');
  rodapeControles.className = 'controles-discretos-rodape';

  const btnNome = document.createElement('button');
  btnNome.type = 'button';
  btnNome.className = `btn-modo-discreto ${estado.modoMeses === 'detalhado' ? 'ativo' : ''}`;
  btnNome.title = 'Visualização Completa';
  btnNome.setAttribute('aria-label', 'Visualização Completa');
  btnNome.innerHTML = `
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="14" y2="18"></line>
    </svg>
  `;
  btnNome.addEventListener('click', () => aoMudarModo('detalhado'));

  const divisor = document.createElement('span');
  divisor.className = 'divisor-discreto';
  divisor.textContent = '|';

  const btnSigla = document.createElement('button');
  btnSigla.type = 'button';
  btnSigla.className = `btn-modo-discreto ${estado.modoMeses === 'compacto' ? 'ativo' : ''}`;
  btnSigla.title = 'Visualização em Siglas';
  btnSigla.setAttribute('aria-label', 'Visualização em Siglas');
  btnSigla.innerHTML = `
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <rect x="3" y="5" width="18" height="14" rx="3"></rect>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  `;
  btnSigla.addEventListener('click', () => aoMudarModo('compacto'));

  rodapeControles.appendChild(btnNome);
  rodapeControles.appendChild(divisor);
  rodapeControles.appendChild(btnSigla);

  conteinerCalendario.appendChild(rodapeControles);
}

function renderizarEstatisticasMes(tarefasDoMes, nomeMes) {
  const painel = document.getElementById('painelEstatisticasMes');
  if (!painel) return;

  const total = tarefasDoMes.length;
  const concluidas = tarefasDoMes.filter(t => t.status === 'concluida').length;
  const emAndamento = tarefasDoMes.filter(t => t.status === 'emAndamento').length;
  const altaPrioridade = tarefasDoMes.filter(t => t.prioridade === 'alta').length;
  const porcentagem = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  painel.innerHTML = `
    <h4>📊 Resumo de ${nomeMes}</h4>
    
    <div class="progresso-container">
      <div class="progresso-rotulo">
        <span>Conclusão das Tarefas</span>
        <span><strong>${porcentagem}%</strong> (${concluidas}/${total})</span>
      </div>
      <div class="barra-progresso-bg">
        <div class="barra-progresso-fill" style="width: ${porcentagem}%;"></div>
      </div>
    </div>

    <div class="grid-mini-stats">
      <div class="item-mini-stat">
        <span class="valor">${emAndamento}</span>
        <span class="rotulo">Em Andamento</span>
      </div>
      <div class="item-mini-stat">
        <span class="valor">${altaPrioridade}</span>
        <span class="rotulo">Alta Prioridade</span>
      </div>
    </div>
  `;
}

export function renderizarDiasDoMes(estado, aoSelecionarDia, aoVerTodasDoMes) {
  const secaoMesDetalhado = document.getElementById('secaoMesDetalhado');
  const tituloMesAtual = document.getElementById('tituloMesAtual');
  const gridDiasMes = document.getElementById('gridDiasMes');
  const btnVerTodasMes = document.getElementById('btnVerTodasMes');

  if (!gridDiasMes) return;

  if (estado.mesSelecionado === null || estado.mesSelecionado === undefined) {
    if (secaoMesDetalhado) secaoMesDetalhado.style.display = 'none';
    return;
  }

  secaoMesDetalhado.style.display = 'flex';
  const mesIndex = estado.mesSelecionado;
  const mesNumStr = String(mesIndex + 1).padStart(2, '0');
  const ano = estado.ano || 2026;

  if (tituloMesAtual) {
    tituloMesAtual.textContent = `Dias de ${NOMES_MESES[mesIndex]} de ${ano}`;
  }

  if (btnVerTodasMes) {
    btnVerTodasMes.style.display = estado.diaSelecionado ? 'inline-block' : 'none';
    btnVerTodasMes.onclick = (e) => {
      e.preventDefault();
      aoVerTodasDoMes();
    };
  }

  const tarefasDoMes = estado.tarefas.filter(t => {
    if (!t.prazo) return false;
    const partes = t.prazo.split('-');
    return partes[1] === mesNumStr;
  });

  renderizarEstatisticasMes(tarefasDoMes, NOMES_MESES[mesIndex]);

  gridDiasMes.innerHTML = '';
  const qtdDias = new Date(ano, mesIndex + 1, 0).getDate();

  for (let dia = 1; dia <= qtdDias; dia++) {
    const diaNumStr = String(dia).padStart(2, '0');
    const dataFormatada = `${ano}-${mesNumStr}-${diaNumStr}`;
    const tarefasDoDia = estado.tarefas.filter(t => t.prazo === dataFormatada);

    const celula = document.createElement('div');
    const estaAtivo = estado.diaSelecionado === dataFormatada;

    celula.className = `dia-celula ${estaAtivo ? 'ativo' : ''}`;
    
    let conteudoHtml = `<span class="dia-numero">${dia}</span>`;
    
    if (tarefasDoDia.length > 0) {
      conteudoHtml += `<div class="indicador-tarefas">`;
      tarefasDoDia.forEach(() => {
        conteudoHtml += `<span class="ponto-tarefa"></span>`;
      });
      conteudoHtml += `</div>`;

      const titulos = tarefasDoDia.map(t => `• ${t.titulo}`).join('\n');
      celula.setAttribute('data-tooltip', `Dia ${dia}:\n${titulos}`);
    }

    celula.innerHTML = conteudoHtml;
    celula.addEventListener('click', () => aoSelecionarDia(dataFormatada));

    gridDiasMes.appendChild(celula);
  }
}
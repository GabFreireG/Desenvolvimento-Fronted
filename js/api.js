// Gerador de dados de exemplo com pelo menos 9 tarefas por mês (Jan a Dez)
function gerarTarefasAnuais() {
  const projetos = ['Design System', 'API Backend', 'App Mobile', 'Marketing', 'Infraestrutura'];
  const responsaveis = ['Ana Silva', 'Carlos Eduardo', 'Mariana Costa', 'Lucas Pereira', 'Beatriz Lima'];
  const prioridades = ['baixa', 'media', 'alta'];
  const statusLista = ['aFazer', 'emAndamento', 'emRevisao', 'concluida'];
  
  const tarefas = [];
  let idCounter = 1;

  for (let mes = 1; mes <= 12; mes++) {
    const mesStr = String(mes).padStart(2, '0');
    
    for (let i = 1; i <= 9; i++) {
      const dia = String((i * 3) % 28 + 1).padStart(2, '0');
      
      tarefas.push({
        id: idCounter++,
        titulo: `Tarefa ${i} do Mês ${mesStr}`,
        projeto: projetos[i % projetos.length],
        responsavel: responsaveis[i % responsaveis.length],
        prazo: `2026-${mesStr}-${dia}`,
        prioridade: prioridades[i % prioridades.length],
        status: statusLista[i % statusLista.length]
      });
    }
  }

  return tarefas;
}

export async function carregarTarefas() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(gerarTarefasAnuais());
    }, 100);
  });
}
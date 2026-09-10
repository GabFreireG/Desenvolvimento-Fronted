export async function carregarTarefas() {
  const resposta = await fetch('dados.json');

  if (!resposta.ok) {
    const erroHttp = new Error(`Erro HTTP ${resposta.status}`);
    erroHttp.name = 'HttpError';
    erroHttp.status = resposta.status;
    throw erroHttp;
  }

  const dados = await resposta.json();

  if (!dados || !Array.isArray(dados.tarefas)) {
    throw new SyntaxError('O arquivo JSON não possui a estrutura esperada com a chave "tarefas".');
  }

  return dados.tarefas;
}
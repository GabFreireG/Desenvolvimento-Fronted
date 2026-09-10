function obterPontosLocaisNaBorda(largura, altura) {
  const lado = Math.floor(Math.random() * 4);
  const margem = 2;

  let x1 = 0, y1 = 0, x2 = 0, y2 = 0;

  switch (lado) {
    case 0:
      x1 = Math.random() * largura;
      y1 = margem;
      x2 = x1 + (Math.random() * 60 - 30);
      y2 = margem + Math.random() * 8;
      break;
    case 1:
      x1 = largura - margem;
      y1 = Math.random() * altura;
      x2 = largura - margem - Math.random() * 8;
      y2 = y1 + (Math.random() * 30 - 15);
      break;
    case 2:
      x1 = Math.random() * largura;
      y1 = altura - margem;
      x2 = x1 + (Math.random() * 60 - 30);
      y2 = altura - margem - Math.random() * 8;
      break;
    default:
      x1 = margem;
      y1 = Math.random() * altura;
      x2 = margem + Math.random() * 8;
      y2 = y1 + (Math.random() * 30 - 15);
      break;
  }

  x2 = Math.max(2, Math.min(largura - 2, x2));
  y2 = Math.max(2, Math.min(altura - 2, y2));

  return { x1, y1, x2, y2 };
}

function desenharRaio(ctx, x1, y1, x2, y2, segmentos = 4, desvio = 4) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);

  for (let i = 1; i < segmentos; i++) {
    const t = i / segmentos;
    const targetX = x1 + (x2 - x1) * t;
    const targetY = y1 + (y2 - y1) * t;

    const offsetX = (Math.random() - 0.5) * desvio;
    const offsetY = (Math.random() - 0.5) * desvio;

    ctx.lineTo(targetX + offsetX, targetY + offsetY);
  }

  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function dispararEfeitoEletrico(botao) {
  if (!botao) return;

  botao.classList.remove('eletrico-ativo');
  void botao.offsetWidth;
  botao.classList.add('eletrico-ativo');

  let canvas = botao.querySelector('.canvas-eletrico');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'canvas-eletrico';
    botao.appendChild(canvas);
  }

  const rect = botao.getBoundingClientRect();
  const largura = rect.width;
  const altura = rect.height;

  canvas.width = largura;
  canvas.height = altura;
  canvas.style.top = '0px';
  canvas.style.left = '0px';

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let frames = 0;
  const totalFrames = 12;

  function animar() {
    ctx.clearRect(0, 0, largura, altura);

    if (frames >= totalFrames) {
      ctx.clearRect(0, 0, largura, altura);
      return;
    }

    const qtdRaios = Math.max(3, Math.floor(largura / 50));

    for (let r = 0; r < qtdRaios; r++) {
      const p = obterPontosLocaisNaBorda(largura, altura);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 5;
      desenharRaio(ctx, p.x1, p.y1, p.x2, p.y2, 4, 5);

      ctx.strokeStyle = '#e4e4e7';
      ctx.lineWidth = 1;
      ctx.shadowColor = '#d4d4d8';
      ctx.shadowBlur = 3;
      desenharRaio(ctx, p.x1, p.y1, p.x2, p.y2, 4, 5);
    }

    frames++;
    requestAnimationFrame(animar);
  }

  animar();
}

export function inicializarEfeitoEletrico() {
  document.addEventListener('click', (event) => {
    const botao = event.target.closest('button');
    if (botao) {
      dispararEfeitoEletrico(botao);
    }
  });
}
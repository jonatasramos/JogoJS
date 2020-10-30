//Game Battle Zone

var p1y = p2y = 40, // posição x e y dos players
pt  = 10, // altura dos players
ph  = 70, // largura dos players
bx  = by  = 50, // posição y e x da bola
bd  = 7, // diametro da bola
xv  = yv = 6, // velocidade dos eixos x e y da bola
score1 = score2 = 0, // pontuação dos players
ais = 3, // velocidade do player que é a máquina
play = stop = startTime = false, drawRect = textBattle = true, // variaveis type bolean
magenta = 0.2, blue = 0.5, red = 1, // cores do texto inicial
cont = 0.1, timeTemp = 3, tempX = tempY = offset = temp = 0, // variaveis temporarias
gradient, player1_gradient, // variavel que contem as cores
velTemp = 0.5, // velocidade temporaria, ela muda para que o jogo se movimente mais rapido
audio_battle, audio_1, audio_2, point; // variaveis dos audios

// carrega o jogo
window.onload = function() {
  audio_battle = document.getElementById('sound_intro');

  audio_1      = document.getElementById('sound_1');
  audio_2      = document.getElementById('sound_2');
  point        = document.getElementById('point');

  // audio_battle.play();
  var canvas =  document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  // atualiza o jogo
  setInterval(update, 1000/30);

  // inicia a função que faz circular traços no retangulo inicial
  if (drawRect) {
    traces();
  }

  // pega a movimentação do mouse
  canvas.addEventListener('mousemove', function(e) {
    if (!stop) {
      p1y  = e.clientY - ph/2;
      temp = e.clientY - 110;
    }
  });

  // inicia o jogo
  document.addEventListener('keyup', function(e) {
    key = e.keyCode;
    var space = 32, P_key = 80, R_key = 82;

    // verifica se o espaço foi pressionado e inicia o jogo
    if (key == space) {
      textBattle = false;
      startTime  = true;
      drawRect   = false;
      interval   = setInterval(recursive, 1000);
    }

    // verifica se a tecla p foi pressionada e pausa o jogo
    if (key == P_key) {
      pause();
    }

    // Reestarta o jogo
    if (key == R_key) {
      if (play) {
        restart();
      }
    }
  });
}

// reposiciona a bola após o ponto de algum jogador
function reset() {
  bx = canvas.width/2;
  by = canvas.height/2;
  xv =- xv;
  yv = 5;
}

// função que atualiza o jogo
function update() {

  gradient = ctx.createLinearGradient(0,0,canvas.width,0);
  gradient.addColorStop(magenta, "magenta");
  gradient.addColorStop(blue, "blue");
  gradient.addColorStop(red, "red");

  // coloca a cor preta no fundo do cenário
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // verifica se a variavel play é verdadeira e inicia o jogo
  if (play) {
    bx += xv;
    by += yv;

    //recua a bola quando ela encosta no topo
    if (by < 0 && yv < 0) {
      yv =- yv;
    }

    //recua a bola quando ela encosta na parte de baixo
    if (by > canvas.height && yv > 0) {
      yv =- yv;
    }

    // verifica se houve colisão com o player 1
    if (bx < 0) {
      if (by > p1y && by < p1y+ph) {
        xv =- xv;
        dy = by - (p1y+ph/2);
        yv = dy * velTemp;
        audio_1.play();
      } else {
        score2++;
        reset();
        point.play();
      }

      if (yv <= 0) {
        ais =- yv;
      } else {
        ais = 3;
      }
    }

    // verifica se houve colisão com o player 2
    if (bx > canvas.width) {
      if (by > p2y && by < p2y+ph) {
        xv =- xv;
        dy = by - (p2y+ph/2);
        yv = dy * velTemp;
        audio_2.play();
      } else {
        score1++;
        reset();
        point.play();
      }

      if (yv <= 0) {
        ais =- yv;
      } else {
        ais = 3;
      }

    }

    // faz a movimentação automática do player 2
    if (!stop) {
      if (p2y + ph/2 < by) {
        p2y += ais;
      } else {
        p2y -= ais;
      }
    }

    // desenha os players
    // ctx.fillRect(0, p1y, pt, ph);
    // player 1
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.lineWidth = 9;
    ctx.moveTo(5, ph+temp);
    ctx.lineTo(5, 140+temp);
    ctx.stroke();

     // player 2
    // ctx.strokeStyle = '#fff';
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.lineWidth = 9;
    ctx.moveTo(canvas.width-5, pt+p2y);
    ctx.lineTo(canvas.width-5, 75+p2y);
    ctx.stroke();
    // ctx.fillRect(canvas.width-pt, p2y, pt, ph);

    // desenha a bola na tela
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(bx-bd/2, by, bd, 0, Math.PI * 2, true);
    ctx.fill();

    // mostra os pontos dos players
    ctx.fillStyle = "#0f0";
    ctx.font      = "6pt emulogic";
    ctx.fillText("Player 1", 50, 20);
    ctx.fillText("score: "+score1, 50, 35);
    ctx.fillText("Player 2", canvas.width-140, 20);
    ctx.fillText("score: "+score2, canvas.width-140, 35);

  } else {
    if (textBattle) {
      // Coloca o titulo do jogo antes de comessar
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur    = 2;
      ctx.shadowColor   = "#000";
      ctx.font          ="30px emulogic";
      ctx.fillStyle     = gradient;
      ctx.fillText("Battle Poing", canvas.width/2-178, canvas.height/2 - 30);

      // Coloca o texto "press space"
      gradient.addColorStop(magenta, "magenta");
      ctx.fillStyle = gradient;
      ctx.font      = "15px emulogic";
      ctx.fillText("Press space", 240, canvas.height/2 + 10);
    }
  }

  // coloca o texto de pause no centro da tela
  if (stop && !textBattle && !startTime) {
    ctx.font      = "30px emulogic";
    ctx.fillStyle = gradient;
    ctx.fillText("Paused", 240, canvas.height/2 - 30);
  }

  // inicia a contagem regressiva
  if (startTime) {
    ctx.font      = "30px emulogic";
    ctx.fillStyle = "#fff";
    ctx.fillText(timeTemp, canvas.width/2, canvas.height/2);
  }
}

// função que cria a contagem regressiva
function recursive() {
  if (timeTemp > 1) {
    timeTemp--;
    audio_battle.volume -= 0.3;
  }else {
    audio_battle.pause();
    play      = true;
    clearInterval(interval);
    timeTemp  = "";
    startTime = false;
  }
}

//função de pausa
function pause() {
  if (!stop) {
    tempX = xv;
    tempY = yv;
    xv    = yv = 0;
    stop  = true;
    audio_battle.play();
  }else {
    audio_battle.pause();
    stop = false;
    xv   = tempX;
    yv   = tempY;
  }
}

// restarta o jogo
function restart() {
  p1y = p2y = 40;
  pt  = 10;
  ph  = 70;
  bx  = by  = 50;
  bd  = 7;
  xv  = yv = 6;
  score1  = score2 = 0;
  ais     = 3;
  play    = stop = startTime = false, textBattle = drawRect = true;
  magenta = magenta2 = 0.2, blue = 0.5, red = 1;
  cont    = 0.1, timeTemp = 3, tempX = tempY = 0;
  velTemp = 0.3;
  audio_battle.volume = 1;
  traces();
  // audio_battle.play();
}

// função que traceja as linhas do retangulo inical
function traces() {
  offset++;
  if (offset > 16) {
    offset = 0;
  }
  drawRectangle();
  if (!drawRect) {
    clearInterval(a);
  } else {
    a = setTimeout(traces, 20);
  }
}

// Função que desenha o retangulo inical
function drawRectangle() {
  ctx.lineWidth      = 2;
  ctx.strokeStyle    = gradient;
  ctx.setLineDash([4, 2]);
  ctx.lineDashOffset = -offset;
  ctx.strokeRect(canvas.width/2-200, canvas.height/2-100, 400, 200);
}

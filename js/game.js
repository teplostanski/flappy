let cvs = document.getElementById('canvas');
let ctx = cvs.getContext('2d');

// загрузка изображений
let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();

bird.src = './img/bird.png';
bg.src = './img/bg.png';
fg.src = './img/fg.png';
pipeUp.src = './img/pipeUp.png';
pipeBottom.src = './img/pipeBottom.png';

// Звук
let fly = new Audio();
let score_audio = new Audio();

fly.src = './audio/fly.mp3';
score_audio.src = './audio/score.mp3'

// Расстояние между верхней и нижней трубой
let gap = 90; //90px

// Бинд кнопки полёта(любая кнопка)
document.addEventListener('keydown', moveUp);
document.addEventListener('mousedown', moveUp);

function moveUp() {
  yPos -= 35; // Эта функция поднимает птицу на 35 пикселей вверх по оси y при нажатии клавиши
  fly.play();
}

// Рендер труб
let pipe = [];

// Создаём в этом пустом масиве нулевой объект
pipe[0] = {
  x: cvs.width, // Координата по х
  y: 0 // И координата по у для каждого блока
}

let score = 0;
// Позиция птицы
let xPos = 10;
let yPos = 150;

let grav = 1.7;

// Отображение объектов в канвасе
function draw() {
  ctx.drawImage(bg, 0, 0); // drawImage это метод, помещаем в него бэкграунд и расположение по x и по y

  // Рандомная отрисовка труб путём прохода циклом по массиву
  for (let i = 0; i < pipe.length; i++) {
    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y); // Вместо статических координат, используем координаты из массива, по одному элементу i по х и по у
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);

    // Чтобы трубы передвигались, мы берём конкретную трубу из массива, берем его позицию по х и отнимаем 1
    pipe[i].x--;

    if(pipe[i].x == 104) { //Если труба доходит до 104 пикселей по горизонтали то,
      pipe.push({ //Добавляем в массив рандомные позиции труб
        x : cvs.width, // Чтобы трубы поязлялись за экраном
        y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height // floor для округления чисел
      })
    }

    // Условие в котором проверяется столкновение птицы с трубой
    if(xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + pipeUp.width && (yPos <= pipe[i].y + pipeUp.height || yPos + bird.height >= pipe[i].y + pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height) {
      location.reload();
    }// Если птича находится в пределах начала или конца ширины или высоты трубы или коснулись fg то перезагрузится страница

    // Счётчик очков
    if(pipe[i].x == 5) {
      score++;
      score_audio.play();
    }
  }

  ctx.drawImage(fg, 0, cvs.height - fg.height); //cvs.height - fg.height конструкция позволяет гибко размещать фронтгрунд в противоположенной стороне по оси y

  ctx.drawImage(bird, xPos, yPos);

  yPos += grav; // Здесь меняется позиция птицы по оси y

  ctx.fillStyle = '#000';
  ctx.font = '20px Ubuntu Mono';
  ctx.fillText('Счёт: ' + score, 10, cvs.height - 20);

  // Нужно чтобы метод draw вызывался постоянно и тянул птицу вниз
  requestAnimationFrame(draw);
}

// Нужно вызвать функцию отрисовки, но хорошей практикой является вызов функции уже после того как подгрузятся спрайты, поэтому берём последний спрайт и после того как он загрузится вызвать метод draw
pipeBottom.onload = draw;

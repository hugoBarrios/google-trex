const FPS = 50;
var ancho = 700;
var alto = 300;
var suelo = 200;
var canvas, ctx, body;
var animaterun = false;
var imgRex1, imgNube, imgCatus, imgSuelo, snHit, snPress, snScore;
var trex = {
  y: suelo,
  vy: 0,
  gravedad: 2,
  salto: 28,
  vymax: 9,
  saltando: false,
};
var nivel = {
  velocidad: 9,
  puntuacion: 0,
  puntuacionMax: 0,
  muerto: false,
  dia: false,
};
var cactus = {
  x: ancho + 100,
  y: suelo,
};
var nube = {
  x: 400,
  y: 100,
  velocidad: 1,
};
var nube2 = {
  x: 100,
  y: 50,
  velocidad: 2,
};
var sueloG = {
  x: 0,
  y: suelo + 25,
};
//obtener puntuacion de juegos pasados
if (localStorage.getItem("puntuacionMax") == undefined) {
  localStorage.setItem("puntuacionMax", nivel.puntuacionMax);
} else {
  nivel.puntuacionMax = localStorage.getItem("puntuacionMax");
}
// bucle principal
setInterval(() => {
  principal();
}, 1000 / FPS);
//animacion correr
setInterval(() => {
  animarTrex();
}, 1000 / 5);

setInterval(() => {
  tiempo(nivel.dia);
}, 10000);
//init
document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("canvas");
  body = document.getElementById("body")
  ctx = canvas.getContext("2d");
  cargarImagenes();
  cargarSonidos();
});
//escucha de teclas
document.addEventListener("keydown", (e) => {
  if (e.key == " " || e.key == "w" || e.key == "ArrowUp") {
    if (nivel.muerto == false) {
      if (trex.saltando == true) {
        // console.log("saltando");
      } else {
        imgRex1.src = "assets/img/dino1.png";
        saltar();
      }
    } else {
      nivel.velocidad = 9;
      nube.velocidad = 1;
      nivel.muerto = false;
      cactus.x = ancho + 100;
      nube.x = ancho + 100;
      nivel.puntuacion = 0;
    }
  }
});
// funcion pricipal
function principal() {
  borrarCanvas();
  gravedad();
  colicion();
  dibujaRex();
  logicaCactus();
  dibujarCatus();
  logicaNube();
  dibujarNube();
  logicaNube2();
  dibujarNube2();
  logicaSuelo();
  dibujarSuelo();
  puntuacion();
}
//borrar canvas
function borrarCanvas() {
  canvas.width = ancho;
  canvas.heigth = alto;
}
// cargar assets
function cargarImagenes() {
  imgRex1 = new Image();
  imgNube = new Image();
  imgCatus = new Image();
  imgSuelo = new Image();
  imgRex1.src = "assets/img/dino1.png";
  imgNube.src = "assets/img/nube.png";
  imgCatus.src = "assets/img/catus.png";
  imgSuelo.src = "assets/img/suelo.png";
}

function cargarSonidos() {
  snHit = new Audio("assets/sound/hit.mp3");
  snHit.muted = true;
  snPress = new Audio("assets/sound/press.mp3");
  snPress.muted = true;
}

//dibujar
function dibujaRex() {
  ctx.drawImage(imgRex1, 0, 0, 44, 48, 100, trex.y, 50, 50);
}

function dibujarCatus() {
  ctx.drawImage(imgCatus, 0, 0, 16, 35, cactus.x, cactus.y, 25, 50);
}

function dibujarNube() {
  ctx.drawImage(imgNube, 0, 0, 49, 21, nube.x, nube.y, 82, 31);
}

function dibujarNube2() {
  ctx.drawImage(imgNube, 0, 0, 49, 21, nube2.x, nube2.y, 150, 50);
}

function dibujarSuelo() {
  ctx.drawImage(imgSuelo, sueloG.x, 0, 700, 16, 0, sueloG.y, 700, 30);
}
//logica
function colicion() {
  // cactus.x
  // trex.y

  if (cactus.x >= 100 && cactus.x <= 150) {
    if (trex.y >= suelo) {
      snHit.muted = false;
      snHit.play();
      cactus.x = ancho + 100;
      nivel.muerto = true;
      nivel.velocidad = 0;
      nube.velocidad = 0;
      if (nivel.puntuacion > nivel.puntuacionMax) {
        nivel.puntuacionMax = nivel.puntuacion;
        localStorage.removeItem("puntuacionMax");
        localStorage.setItem("puntuacionMax", nivel.puntuacionMax);
      }
    }
  }
}
function gravedad() {
  if (trex.saltando == true) {
    if (trex.y - trex.vy - trex.gravedad > suelo) {
      trex.saltando = false;
      trex.vy = 0;
      trex.y = suelo;
      imgRex1.src = "assets/img/dino1.png";
    } else {
      trex.vy -= trex.gravedad;
      trex.y -= trex.vy;
    }
  }
}

function saltar() {
  trex.saltando = true;
  snPress.muted = false;  
  snPress.play();
  trex.vy = trex.salto;
}

function logicaCactus() {
  if (cactus.x < -100) {
    cactus.x = ancho + 100;
    nivel.puntuacion++;
    nivel.velocidad += 0.2;
  } else {
    cactus.x -= nivel.velocidad;
  }
}

function logicaNube() {
  if (nube.x < -100) {
    nube.x = ancho + 100;
  } else {
    nube.x -= nube.velocidad;
  }
}

function logicaNube2() {
  if (nube2.x < -150) {
    nube2.x = ancho + 50;
  } else {
    nube2.x -= nube.velocidad;
  }
}

function logicaSuelo() {
  if (sueloG.x > 700) {
    sueloG.x = 0;
  } else {
    sueloG.x += nivel.velocidad;
  }
}

function puntuacion() {
  ctx.font = "20px impact";
  ctx.fillStyle = "#555555";
  ctx.fillText(`puntuación maxima: ${nivel.puntuacionMax}`, 300, 20);
  ctx.fillText(`puntuación actual: ${nivel.puntuacion}`, 300, 50);

  if (nivel.muerto) {
    ctx.font = "60px impact";
    ctx.fillText("GAME OVER", 240, 150);
    ctx.font = "20px impact";
    ctx.fillText("pulsa espacio para continuar", 250, 200);
  }
}

function animarTrex() {
  if (trex.saltando == false && nivel.muerto == false && animaterun) {
    imgRex1.src = "assets/img/run2.png";
    animaterun = false;
  } else {
    imgRex1.src = "assets/img/run1.png";
    animaterun = true;
  }
}
function tiempo(tiempo) {
if(!nivel.muerto){
  if(tiempo){
      body.classList.remove('black1');
    canvas.classList.remove('black');
    canvas.classList.add("white")
  }else{
    canvas.classList.remove('white');
    canvas.classList.add("black")
    body.classList.add("black1")
  }
  nivel.dia = !nivel.dia;  
}
}

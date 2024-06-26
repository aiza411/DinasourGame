let board;
let boardHeight = 300;
let boardWidth = 750;
let context;

let dinoWidth = 100;
let dinoHeight = 90;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
  X: dinoX,
  Y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};
let id = null;
let cactus = [];
let cactus_width = [50, 69, 90];
let cactus_height = 80;

let cactusX = 700;
let cactusY = boardHeight - cactus_height;

let cactus1_Img;
let cactus2_Img;
let cactus3_Img;

let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d");
  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", startGame);
};

function startGame() {
  if (id) {
    clearInterval(id);
  }

  gameOver = false;
  score = 0;
  dino.Y = dinoY;
  cactus = [];

  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d");
  dinoImg = new Image();
  dinoImg.src = "../assets/dino.png";
  dinoImg.onload = function () {
    console.log("here");
    context.drawImage(dinoImg, dino.X, dino.Y, dino.width, dino.height);
  };

  cactus1_Img = new Image();
  cactus1_Img.src = "../assets/cactusGreen1.png";

  cactus2_Img = new Image();
  cactus2_Img.src = "../assets/cactusGreen2.png";

  cactus3_Img = new Image();
  cactus3_Img.src = "../assets/cactusGreen3.png";

  //Theme
  const dropdownItems = document.querySelectorAll(".dropdown-item");

  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      const themeId = this.id;
      switch (themeId) {
        case "theme1":
          board.style.backgroundImage = "url('../assets/background.jpg')";
          break;
        case "theme2":
          board.style.backgroundImage = "url('../assets/night_background.jpg')";
          break;
        case "theme3":
          board.style.backgroundImage =
            "url('../assets/underwater_background.jpg')";
          break;
        default:
          board.style.backgroundImage = "url('../assets/background.jpg')";
      }
    });
  });

  requestAnimationFrame(update);

  id = setInterval(SpawnCactus, 1000);
  document.addEventListener("keydown", MoveDino);
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    context.fillStyle = "white";
    context.font = "30px courier";
    score++;
    context.fillText("Game Over", 300, 100);
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  velocityY += gravity;
  dino.Y = Math.min(dino.Y + velocityY, dinoY);

  console.log("velX", velocityX);
  console.log("velY", velocityY);

  context.drawImage(dinoImg, dino.X, dino.Y, dino.width, dino.height);
  for (let i = 0; i < cactus.length; i++) {
    let cactus1 = cactus[i];
    cactus1.x += velocityX;
    context.drawImage(
      cactus1.img,
      cactus1.x,
      cactus1.y,
      cactus1.width,
      cactus1.height
    );

    if (DetectCollision(dino, cactus1)) {
      gameOver = true;
      dinoImg.src = "../assets/dino.png";
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.X, dino.Y, dino.width, dino.height);
      };
    }
  }

  context.fillStyle = "white";
  context.font = "20px courier";
  score++;
  context.fillText(score, 5, 20);
}

function MoveDino(e) {
  if (gameOver) {
    return;
  }

  if ((e.code = "Space" || e.code == "ArrowUp") && dino.Y == dinoY) {
    velocityY = -10;
  }
}

function SpawnCactus() {
  if (gameOver) {
    return;
  }

  let cactus_obj = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactus_height,
  };

  let CactusChance = Math.random();

  if (CactusChance > 0.9) {
    cactus_obj.img = cactus3_Img;
    cactus_obj.width = cactus_width[2];
    cactus.push(cactus_obj);
  } else if (CactusChance > 0.7) {
    cactus_obj.img = cactus2_Img;
    cactus_obj.width = cactus_width[1];
    cactus.push(cactus_obj);
  } else if (CactusChance > 0.5) {
    cactus_obj.img = cactus1_Img;
    cactus_obj.width = cactus_width[0];
    cactus.push(cactus_obj);
  }

  if (cactus.length > 5) {
    cactus.shift();
  }
}

function DetectCollision(a, b) {
  return (
    a.X < b.x + b.width &&
    a.X + a.width > b.x &&
    a.Y < b.y + b.height &&
    a.Y + a.height > b.y
  );
}

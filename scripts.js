numberOfPositiveImages = 3;
numberOfNegativeImages = 4;

// HELPER FUNCTIONS
function loadSingleImage(imageType, index){
  return new Promise(function(resolve, reject){
    var img = new Image();
    img.src = "./assets/images/" + imageType + index + ".png";
    img.onload = function(){
      resolve(img);
    }
    img.onerror = function(e){
      console.error("image could not be loaded: " + imageType + index);
      reject(e);
    }
  });
}

function loadImages(numberOfImages, imageType){
    var images = new Array();
    var promises = new Array();

    for(var i = 1; i < numberOfImages+1; i++ ){
        promises.push(loadSingleImage(imageType, i));
    }

    return Promise.all(promises).then(function(loadedImages){
      return loadedImages;
    });
}

function randStartingXcoord(imgWidth){
  var min = 10;
  var max = canvas.width - imgWidth - 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randStartingYcoord(imgHeight){
  var min = 10;
  var max = canvas.height - imgHeight - 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawText(canvas, ctx){
  ctx.font = "20px Arial";
  ctx.fillStyle = "#d9d9d9";
  ctx.textAlign = "center";
  ctx.fillText("Hire as many good employees as possible", canvas.width/2, canvas.height/2);

  ctx.font = "15px Arial";
  ctx.fillStyle = "#bfbfbf";
  ctx.textAlign = "center";
  ctx.fillText("(Click to hire)", canvas.width/2, canvas.height/2 + 20);

  ctx.font = "20px Arial";
  ctx.fillStyle = "#d9d9d9";
  ctx.textAlign = "right";
  ctx.fillText("Score: ", canvas.width - 100, 30);
}

// inputs: image, optional: specific width to set, specific height to set,
// custom x coordinate to start at, custom y coordinate to start at
// returns: nothing
// expected outcome: draws the inputted image on the canvas
function drawImg(ctx, img, w ,h ,x ,y){
  // create the intial image
  function imgInit(){
    var randScale = (Math.random() * (3 - .5 + 1) + .5)/10;
    if(null == w){
      w = randScale;
    }
    if(null == h){
      h = randScale;
    }
    if(null == x){
      x = randStartingXcoord(img.width * w);
    }
    if(null == y){
      y = randStartingYcoord(img.height * h);
    }
    ctx.drawImage(img,x,y, img.width * w, img.height * h);

    // img.onload = function(){
    //   ctx.drawImage(img,x,y, img.width * w, img.height * h);
    // }
  }
  imgInit();

  // create the movement of the image
  function movement(){

  }
  setInterval(movement, 10);
}

function randImgGeneration(ctx, imageSet){
  var min = 0;
  var max = imageSet.length-1;
  var choice = Math.floor(Math.random() * (max - min + 1)) + min;
  drawImg(ctx, imageSet[choice]);
}

// GAME CODE
function gameInit() {
  // get all resources
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var positiveImages = loadImages(numberOfPositiveImages, "pizza");
  var negativeImages = loadImages(numberOfNegativeImages, "animal");
  var imageLoader = [positiveImages, negativeImages];
  Promise.all(imageLoader).then(function(images){
    positiveImages = images[0];
    negativeImages = images[1];

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            /**
             * Your drawings need to be inside this function otherwise they will be reset when
             * you resize the browser window and the canvas goes will be cleared.
             */
            playGame(canvas, ctx, positiveImages, negativeImages);
    }
    resizeCanvas();
  });
}

// where all canvas activity should go in order to maintain resizability
function playGame(canvas, ctx, positiveImages, negativeImages) {
  drawText(canvas, ctx);
  // number of random images to generate
  var maxImgs = 2;
  for(i=0; i<maxImgs; i++){
    randImgGeneration(ctx, positiveImages);
    randImgGeneration(ctx, negativeImages);
  }
}

//window.onload = new Konami(playGame);
window.onload = gameInit;

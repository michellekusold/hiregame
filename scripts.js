numberOfPositiveImages = 3;
numberOfNegativeImages = 4;

// IMAGE HELPER FUNCTIONS
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

function randStartingXcoord(canvas, imgDim){

  var min = imgDim;
  var max = canvas.getWidth() - imgDim - 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randStartingYcoord(canvas, imgDim){
  var min = imgDim;
  var max = canvas.getHeight() - imgDim - 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDegree(){
  return Math.random() * (360 - 0 + 1);
}

function randScale(canvas, img){
  var scale = (Math.random() * (8 - 1 + 1) + 1)/10;
  while(img.height * scale> canvas.getHeight() || img.width * scale > canvas.getWidth()){
    scale = (Math.random() * (8 - 1 + 1) + 1)/10;
  }
  return scale;
}

function getSizingDim(img, scale){
  if(scale){
    if(img.width > img.height){
      return img.width * scale;
    }
    return img.height * scale;
  }
  if(img.width > img.height){
    return img.width;
  }
  return img.height;
}

// function drawText(canvas){
//   ctx.font = "20px Arial";
//   ctx.fillStyle = "#d9d9d9";
//   ctx.textAlign = "center";
//   ctx.fillText("Hire as many good employees as possible", canvas.width/2, canvas.height/2);
//
//   ctx.font = "15px Arial";
//   ctx.fillStyle = "#bfbfbf";
//   ctx.textAlign = "center";
//   ctx.fillText("(Click to hire)", canvas.width/2, canvas.height/2 + 20);
//
//   ctx.font = "20px Arial";
//   ctx.fillStyle = "#d9d9d9";
//   ctx.textAlign = "right";
//   ctx.fillText("Score: ", canvas.width - 100, 30);
// }



// inputs: image, optional: specific width to set, specific height to set,
// custom x coordinate to start at, custom y coordinate to start at
// returns: nothing
// expected outcome: draws the inputted image on the canvas
function drawImg(canvas, img, w ,h ,x ,y){
    var scale = randScale(canvas, img);
    var biggestDim = getSizingDim(img);
    if(null == w){
      w = scale;
    }
    if(null == h){
      h = scale;
    }
    if(null == x){
      x = randStartingXcoord(canvas, biggestDim * w);
    }
    if(null == y){
      y = randStartingYcoord(canvas, biggestDim * h);
    }

    var newImage = new fabric.Image(img, {
      centeredScaling: true,
      centeredRotation: true,
      hasControls: false,
      selectable: false,
      hoverCursor: "pointer",
      left:x,
      top:y,
      scaleX: scale,
      scaleY: scale,
      angle: randDegree()
    });
    canvas.add(newImage);

    var walls = {
      top: 0,
      right: canvas.getWidth(),
      bottom: canvas.getHeight(),
      left:0
    }
    var scaleSwitch = true;
    var scaleSize = randScale(canvas, img);
    var animationScale = "-=" + scaleSize;
    function bounceLeft(){
      var newx = randStartingXcoord(canvas, getSizingDim(newImage, scale));
      var newy = randStartingYcoord(canvas, getSizingDim(newImage, scale));

      if(scaleSwitch){
        animationScale = "+=" + scaleSize;
        scaleSwitch = false;
      }
      else{
        animationScale = "-=" + scaleSize;
        scaleSwitch = true;
      }

      var randDuration = Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000;
      newImage.animate({left: newx, top: newy, angle: '+=45', scaleX:animationScale, scaleY: animationScale},{
        onChange:canvas.renderAll.bind(canvas),
        duration: randDuration,
        easing: fabric.util.ease.easeInCubic,
        onComplete: bounceLeft
      });
    }
    bounceLeft();
    canvas.renderAll();
}

function randImgGeneration(canvas, imageSet){
  var min = 0;
  var max = imageSet.length-1;
  var choice = Math.floor(Math.random() * (max - min + 1)) + min;
  drawImg(canvas, imageSet[choice]);
}

/****************** GAME CODE ********************/
function gameInit() {
  // get all resources
  var canvas = new fabric.Canvas('canvas');
  var positiveImages = loadImages(numberOfPositiveImages, "pizza");
  var negativeImages = loadImages(numberOfNegativeImages, "animal");
  var imageLoader = [positiveImages, negativeImages];
  Promise.all(imageLoader).then(function(images){
    positiveImages = images[0];
    negativeImages = images[1];

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.clear();
        canvas.setDimensions({width:window.innerWidth, height:window.innerHeight});
        canvas.calcOffset();
        /**
         * Your drawings need to be inside this function otherwise they will be reset when
         * you resize the browser window and the canvas goes will be cleared.
         */
        playGame(canvas, positiveImages, negativeImages);
    }
    resizeCanvas();
  });
}

// where all canvas activity should go in order to maintain resizability
function playGame(canvas, positiveImages, negativeImages) {
  //drawText(canvas);
  // number of random images to generate
  var maxImgs = 5;
  for(i=0; i<maxImgs; i++){
    randImgGeneration(canvas, positiveImages);
    randImgGeneration(canvas, negativeImages);
  }
}

//window.onload = new Konami(playGame);
window.onload = gameInit;

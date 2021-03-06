canvas = null;
numberOfPositiveImages = 5;
numberOfNegativeImages = 4;
positiveImages = null;
negativeImages = null;
activePositiveImages = 0;
activeNegativeImages = 0;
score = null;
scoreObj = null;
closeObj = null;
closeImage = null;
feedback = null;

goodMessages = [
  "Your new employee created cohesive branding for your project. +1",
  "Your new employee did user testing to improve UX. +1",
  "Your new employee is good at making puns. +1",
  "Your new employee coded faster than the speed of light. +1",
  "Your new employee comes to work looking spiffy. +1",
  "Your new employee utilizes Sass to slay visual inconsistencies. +1",
  "Your new employee bikes uphill to work both ways. +1",
  "Your new employee squashes bugs with unit testing. +1"
];

badMessages = [
  "Your new employee isn't potty trained. -1",
  "Your new employee codes by walking across the keyboard. Bugs were created. -1",
  "Your new employee has a low life expectancy. (Is the health insurance worth it?) -1",
  "Your new employee contracted fleas. The bugs spread into the code. -1",
  "Your new employee is a catty communicater. They always have a bone to pick with someone. -1",
  "Your new employee doesn't speak human. Their code comments are indecipherable. -1",
  "Your new employee licked the outlet. -1",
  "Hair everywhere. -1"
];

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

function randStartingXcoord(imgDim){
  var min = imgDim;
  var max = canvas.getWidth() - imgDim - 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randStartingYcoord(imgDim){
  var min = imgDim;
  var max = canvas.getHeight() - imgDim - 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDegree(){
  return Math.random() * (360 - 0 + 1);
}

function randScale(img){
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

function winGame(){
  var modal = new fabric.Rect({
    selectable: false,
    fill: 'white',
    opacity: 1,
    width: canvas.getWidth() * .9,
    height: canvas.getHeight()*.3
  });

  var message = new fabric.Text("Hey, you're really good at this.\nIf you want, you can make this game a reality by calling me at\n (440) 665-2581\n\nThanks for playing :)",
  {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: "black",
      textAlign: "center",
      selectable: false
  });
  canvas.add(modal, message);
  canvas.centerObject(modal);
  canvas.centerObject(message);
  canvas.bringToFront(closeObj);
  canvas.renderAll();

}

function changeScore(){
  if(!score){
    score = 0;
  }
  var scoretext = "Score: " + score;
  if(score >=10){
    winGame();
  }
  if(score <=-5){
    score = -4;
  }
  return scoreObj.setText(scoretext);
}

function drawText(){
  var instructions = new fabric.Text('Hire as many good employees as possible\n(Click to hire)',
  {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: "#d9d9d9",
      textAlign: "center",
      selectable: false
  });

  var scoreText = "Score: ";
  if(score){
    scoreText += score;
  }
  scoreObj = new fabric.Text(scoreText,
  {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: "#d9d9d9",
      textAlign: "right",
      left: canvas.getWidth() - 100,
      top: 30
  });
  canvas.add(instructions, scoreObj);
  canvas.centerObject(instructions);
  canvas.bringToFront(closeObj);
  canvas.renderAll();
  return instructions;
}

function adjustGame(isGood){
  var randMessage = Math.floor(Math.random() * (8));
  if(isGood){
    activePositiveImages--;
    score++;
    feedback.setText(goodMessages[randMessage]);
    if(activePositiveImages < 2){
      for(var i=0; i<2; i++){
        randImgGeneration(positiveImages, true);
        activePositiveImages++;
      }
    }
  }
  else{
    activeNegativeImages--;
    score--;
    feedback.setText(badMessages[randMessage]);
    if(activeNegativeImages < 2){
      for(var i=0; i<2; i++){
        randImgGeneration(negativeImages, false);
        activeNegativeImages++;
      }
    }
  }
  feedback.sendToBack();
  canvas.centerObject(feedback);
  changeScore();
}


// inputs: image, optional: specific width to set, specific height to set,
// custom x coordinate to start at, custom y coordinate to start at,
// returns: nothing
// expected outcome: draws the inputted image on the canvas
function drawImg(img, isGood, w ,h ,x ,y){
    var scale = randScale(img);
    var biggestDim = getSizingDim(img);
    if(null == w){
      w = scale;
    }
    if(null == h){
      h = scale;
    }
    if(null == x){
      x = randStartingXcoord(biggestDim * w);
    }
    if(null == y){
      y = randStartingYcoord(biggestDim * h);
    }

    var newImage = new fabric.Image(img, {
      centeredScaling: true,
      centeredRotation: true,
      hasControls: false,
      hasBorders: false,
      hoverCursor: "pointer",
      left:x,
      top:y,
      scaleX: scale,
      scaleY: scale,
      angle: randDegree()
    });
    newImage.on('selected', function(){
      adjustGame(isGood);
      canvas.getActiveObject().remove();
    });
    canvas.add(newImage);

    var walls = {
      top: 0,
      right: canvas.getWidth(),
      bottom: canvas.getHeight(),
      left:0
    }
    var scaleSwitch = true;
    var scaleSize = randScale(img);
    var animationScale = "-=" + scaleSize;
    function bounce(){
      var newx = randStartingXcoord(getSizingDim(newImage, scale));
      var newy = randStartingYcoord(getSizingDim(newImage, scale));

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
        onComplete: bounce
      });
    }
    bounce();
    canvas.bringToFront(closeObj);
    canvas.renderAll();
}

function randImgGeneration(imageSet, isGood){
  var min = 0;
  var max = imageSet.length-1;
  var choice = Math.floor(Math.random() * (max - min + 1)) + min;
  drawImg(imageSet[choice], isGood);
}

/****************** GAME CODE ********************/
function gameInit() {
  // get all resources
  canvas = new fabric.Canvas('canvas');
  positiveImages = loadImages(numberOfPositiveImages, "face");
  negativeImages = loadImages(numberOfNegativeImages, "animal");
  closeImage = loadImages(1, "close");
  var imageLoader = [positiveImages, negativeImages, closeImage];
  Promise.all(imageLoader).then(function(images){
    positiveImages = images[0];
    negativeImages = images[1];
    closeImage = images[2][0];

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
        playGame();
    }
    resizeCanvas();
  });
}

// where all canvas activity should go in order to maintain resizability
function playGame() {
  closeObj = new fabric.Image(closeImage, {
    hasControls: false,
    hasBorders: false,
    top: 10,
    left: 10,
    scaleX: .3,
    scaleY: .3,
    hoverCursor: "pointer"
  });
  closeObj.on('selected', function(){
    canvas.clear();
    var c = document.getElementById("canvas");
    var c2 = document.getElementsByClassName("upper-canvas")[0];
    var parent = document.getElementsByClassName("canvas-container")[0];
    parent.removeChild(c2);
    parent.removeChild(c);
    parent.parentNode.removeChild(parent);
  });
  canvas.add(closeObj);
  canvas.bringToFront(closeObj);
  canvas.renderAll();


  feedback = drawText();
  // number of random images to generate
  var maxImgs = 3;
  for(i=0; i<maxImgs; i++){
    randImgGeneration(positiveImages, true);
    activePositiveImages++;
    randImgGeneration(negativeImages, false);
    activeNegativeImages++;
  }
}

window.onload = new Konami(function(){
  canvas = null;
  numberOfPositiveImages = 3;
  numberOfNegativeImages = 4;
  positiveImages = null;
  negativeImages = null;
  activePositiveImages = 0;
  activeNegativeImages = 0;
  score = null;
  scoreObj = null;
  closeObj = null;
  closeImage = null;
  var c = document.createElement('canvas');
  c.id="canvas";
  document.body.appendChild(c);
  gameInit();
});
//window.onload = gameInit;

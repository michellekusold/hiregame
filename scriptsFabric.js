numberOfPositiveImages = 3;
numberOfNegativeImages = 4;

//window.onload = new Konami(playGame);
window.onload = playGame;

function playGame(){
  window.addEventListener('resize', gameInit, false);
  gameInit();
  var score = 0;
}

function gameInit(){
  var game = canvasInit();
  var canvas = game.canvas;
  var resources = game.images;
}

function canvasInit(){
    // set the canvas size to fill the current screen
    var canvas = this._canvas = new fabric.Canvas('canvas', {opacity:0});
    canvas.clear();
    canvas.on('mouse:down', function(options) {
      if (options.target) {
        console.log('an object was clicked! ', options.target.type);
        canvas.remove(options.target);
      }
    });
    canvas.setHeight(window.innerHeight);
    canvas.setWidth(window.innerWidth);
    canvas.renderAll();
    var images = resourceInit(canvas);
    return {canvas: canvas, images: images};
}

function resourceInit(canvas){
  var positiveImages = loadImages(canvas, numberOfPositiveImages, "pizza");
  console.log(positiveImages);
  var negativeImages = loadImages(canvas, numberOfNegativeImages, "animal");
  console.log(negativeImages);
  return {positive: positiveImages, negative: negativeImages};
}

function loadImages(canvas, numberOfImages, imageType){
  var images = [];
  for(var i = 1; i < numberOfImages+1; i++ ){
    var randScale = (Math.random() * (3 - .5 + 1) + .5)/10;;
    var imgUrl = "./assets/images/" + imageType + i + ".png";
    var img = new fabric.Image.fromURL(imgUrl, function(canvasImg){
      canvasImg.hasBorders = false;
      canvasImg.centeredScaling = true;
      canvasImg.centeredRoation = true;
      canvasImg.hasControls = false;
      canvasImg.hoverCursor = "pointer";
      canvasImg.selectable = false;
      canvasImg.scaleX = (canvas.width / canvasImg.width) * randScale;
      canvasImg.scaleY = (canvas.height / canvasImg.height) * randScale;
      canvasImg.left = randStartingXcoord(canvas, canvasImg);
      canvasImg.top = randStartingYcoord(canvas, canvasImg);
      canvasImg.angle = randDegree();
      canvas.add(canvasImg);
     });
     images.push(img);
  }
  return images;
}

function randDegree(){
  return Math.random() * (360 - 0 + 1);
}



function randStartingXcoord(canvas, image){
  var width = image.width * image.scaleX;

  var min = 10;
  var max = canvas.width - width - 50;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randStartingYcoord(canvas, image){
  var height = image.height * image.scaleY;

  var min = 10;
  var max = canvas.height - height - 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//
// // initialize the board & game
// function init() {
//     // get all resources
//     var canvas = document.getElementById('canvas'),
//             ctx = canvas.getContext('2d'),
//             cat = document.getElementById("kitty"),
//             dog = document.getElementById("dog"),
//
//
//     // resize the canvas to fill browser window dynamically
//     window.addEventListener('resize', resizeCanvas, false);
//    function resizeCanvas() {
//             canvas.width = window.innerWidth;
//             canvas.height = window.innerHeight;
//
//             /**
//              * Your drawings need to be inside this function otherwise they will be reset when
//              * you resize the browser window and the canvas goes will be cleared.
//              */
//             drawStuff();
//     }
//     resizeCanvas();
//
//     // where all canvas activity should go in order to maintain resizability
//     function drawStuff() {
//       // directions
//       ctx.font = "20px Arial";
//       ctx.fillStyle = "#d9d9d9";
//       ctx.textAlign = "center";
//       ctx.fillText("Hire as many good employees as possible", canvas.width/2, canvas.height/2);
//
//       ctx.font = "15px Arial";
//       ctx.fillStyle = "#bfbfbf";
//       ctx.textAlign = "center";
//       ctx.fillText("(Click to hire)", canvas.width/2, canvas.height/2 + 20);
//
//       ctx.font = "20px Arial";
//       ctx.fillStyle = "#d9d9d9";
//       ctx.textAlign = "right";
//       ctx.fillText("Score: ", canvas.width - 100, 30);
//       // draw image function
//       function drawImg(img,w,h,x,y){
//         // create the intial image
//         function imgInit(){
//           if(null == x){
//             x=randStartingXcoord();
//           }
//           if(null == y){
//             y=randStartingYcoord();
//           }
//           if(null == w){
//             w=.9;
//           }
//           if(null == h){
//             h=.9;
//           }
//           ctx.drawImage(img,x,y, img.width * w, img.height * h);
//
//           img.onload = function(){
//             ctx.drawImage(img,x,y, img.width * w, img.height * h);
//           }
//         }
//         imgInit();
//
//         // create the movement of the image
//         function movement(){
//
//         }
//         setInterval(movement, 10);
//       }
//
//
//       function randStartingXcoord(){
//         var min = 5;
//         var max = canvas.width - 5;
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//       }
//       function randStartingYcoord(){
//         var min = 5;
//         var max = canvas.height - 50;
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//       }
//
//       /* This max number reflects how many image options there are */
//       function randImgGeneration(){
//         var min = 1;
//         var max = 7;
//         var choice = Math.floor(Math.random() * (max - min + 1)) + min;
//         var img;
//         switch(choice){
//           case 1:
//             img = cat;
//             break;
//           case 2:
//             img = dog;
//             break;
//           case 3:
//             img = face1;
//             break;
//           case 4:
//             img = face2;
//             break;
//           case 5:
//             img = face3;
//             break;
//           case 6:
//             img = face4;
//             break;
//           case 7:
//             img = face5;
//             break;
//           default:
//             img = face1;
//           }
//           //TODO: just resize resources appropriately then you can get rid of scaling that doesn't have to do with screen proportions
//           if(img == cat){
//             drawImg(img,.5,.5);
//           }
//           else{
//             drawImg(img,.9,.9);
//           }
//         }
//
//         maxImgs = 2
//         for(i=0; i<maxImgs; i++){
//           randImgGeneration();
//         }
//         /*
//       // draw cat
//       drawImg(cat,.5,.5);
//       // draw dog
//       drawImg(dog,.9,.9);
//       drawImg(face1,.9,.9);
//       drawImg(face2,.9,.9);
//       drawImg(face3,.9,.9);
//       drawImg(face4,.9,.9);
//       drawImg(face5,.9,.9);*/
//
//     }
// };
//

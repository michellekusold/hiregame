// initialize the board & game
function init() {
    // get all resources
    var canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            cat = document.getElementById("kitty"),
            dog = document.getElementById("dog"),
            face1 = document.getElementById("face1"),
            face2 = document.getElementById("face2"),
            face3 = document.getElementById("face3"),
            face4 = document.getElementById("face4"),
            face5 = document.getElementById("face5");

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            /**
             * Your drawings need to be inside this function otherwise they will be reset when
             * you resize the browser window and the canvas goes will be cleared.
             */
            drawStuff();
    }
    resizeCanvas();

    // where all canvas activity should go in order to maintain resizability
    function drawStuff() {
      // directions
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
      // draw image function
      function drawImg(img,w,h,x,y){
        // create the intial image
        function imgInit(){
          if(null == x){
            x=randStartingXcoord();
          }
          if(null == y){
            y=randStartingYcoord();
          }
          if(null == w){
            w=.9;
          }
          if(null == h){
            h=.9;
          }
          ctx.drawImage(img,x,y, img.width * w, img.height * h);

          img.onload = function(){
            ctx.drawImage(img,x,y, img.width * w, img.height * h);
          }
        }
        imgInit();

        // create the movement of the image
        function movement(){

        }
        setInterval(movement, 10);
      }


      function randStartingXcoord(){
        var min = 5;
        var max = canvas.width - 5;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      function randStartingYcoord(){
        var min = 5;
        var max = canvas.height - 50;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      /* This max number reflects how many image options there are */
      function randImgGeneration(){
        var min = 1;
        var max = 7;
        var choice = Math.floor(Math.random() * (max - min + 1)) + min;
        var img;
        switch(choice){
          case 1:
            img = cat;
            break;
          case 2:
            img = dog;
            break;
          case 3:
            img = face1;
            break;
          case 4:
            img = face2;
            break;
          case 5:
            img = face3;
            break;
          case 6:
            img = face4;
            break;
          case 7:
            img = face5;
            break;
          default:
            img = face1;
          }
          //TODO: just resize resources appropriately then you can get rid of scaling that doesn't have to do with screen proportions
          if(img == cat){
            drawImg(img,.5,.5);
          }
          else{
            drawImg(img,.9,.9);
          }
        }

        maxImgs = 2
        for(i=0; i<maxImgs; i++){
          randImgGeneration();
        }
        /*
      // draw cat
      drawImg(cat,.5,.5);
      // draw dog
      drawImg(dog,.9,.9);
      drawImg(face1,.9,.9);
      drawImg(face2,.9,.9);
      drawImg(face3,.9,.9);
      drawImg(face4,.9,.9);
      drawImg(face5,.9,.9);*/

    }
};

window.onload = init;

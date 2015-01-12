var canvas, w, h,ctx,ball,platforma,game = true,blocks,rowHeight,row,col,score = 0,start,color,colors,win = false,colLen = 20,rowLen = 6;


onload = init;


start = new Audio('start.mp3');
colors = ['orange','gray','lightgreen','lightblue','lightyellow','lightgray'];
color = [];

function Ball(x,y){
    this.x = x;
    this.y = y;
    this.color = 'red';
    this.radius = 5;
    this.dx = 2;
    this.dy = 2;
}

function Platforma(x,y){
    this.x = x;
    this.y = y;
    this.color = 'black';
    this.width = 100;
    this.height = 5;
    this.dx = 50;
}

function Blocks(width,height,cols,rows){
    this.width = width;
    this.height = height;
    this.cols = cols;
    this.rows = rows;
    this.padding = 1;
    this.obj;
    this.bonus;
    this.lifes;
}


function init(){
    start.play();
    canvas = document.getElementById('canvas');//debugger;
    ctx = canvas.getContext('2d');
    ctx.font = '30px Arial';

    w = canvas.width;
    h = canvas.height;

    ball = new Ball(w / 2,h / 2);

    platforma = new Platforma(w / 2,h - 20);
    platforma.x -= platforma.width / 2;

    blocks = new Blocks(w/colLen-1,20,colLen,rowLen);
    blocks.obj = [];
    blocks.bonus = [];
    blocks.lifes = [];
    for(var i = 0;i < blocks.rows;i++){
        blocks.obj[i] = [];
        blocks.bonus[i] = [];
        color[i] = [];
        blocks.lifes[i] = [];
        for(var j = 0;j < blocks.cols;j++){
            blocks.obj[i][j] = 1;
            blocks.bonus[i][j] = Math.ceil(Math.random() * 2);
            color[i][j] = colors[0];
            blocks.lifes[i][j] = 1;
        }
    }

    for(var i = 0;i < blocks.cols;i++){
        blocks.lifes[blocks.rows - 1][i] = 2;
    }
//console.log('lifes:',blocks.lifes);
//console.log('bonus:',blocks.bonus);
//console.log('obj:',blocks.obj);

    render();
}

function render(){
    if(game){
    ctx.clearRect(0,0,w,h);
    background();

    var scoreText = 'Score:' + score;
    ctx.strokeStyle = 'gray';
    ctx.strokeText(scoreText,20,h/2);


    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.radius,0,2 * Math.PI,true);
    ctx.closePath();
    ctx.fill();

    rowHeight = blocks.height + blocks.padding;
    rowWidth = blocks.width + blocks.padding;
    row = Math.floor(ball.y / rowHeight);
    col = Math.floor(ball.x / rowWidth);

    if(ball.y < blocks.rows * rowHeight && row >= 0 && col >= 0 && blocks.obj[row][col] === 1){
        if(blocks.lifes[row][col] > 1){
            blocks.lifes[row][col] -= 1;
            color[row][col] = colors[1];//console.log(color[row][col]);
            var sound = new Audio('contact.mp3');
            sound.play();
        }else{
            blocks.obj[row][col] = 0;
            ball.dy = -ball.dy;
            score++;
            var sound = new Audio('remove.mp3');
            sound.play();
//            console.log('score:',score,';col*row:',colLen*rowLen);
            if(score === colLen * rowLen){
                game = false;
                win = true;
            }
            switch (blocks.bonus[row][col]){
                case 1:
//                    platforma.width -=  5;
//                    setTimeout(function(){platforma.width +=  5},2000);
                    break;
                case 2:
//                    ball.dy += 5;
//                    setTimeout(function(){ball.dy -= 2},2000);
                    break;
            }
        }


    }

//    ctx.fillStyle = 'orange';
    ctx.strokeStyle = 'black';
        for(var i = 0;i < blocks.rows;i++){
//            ctx.fillStyle = colors[i];
            for(var j = 0;j < blocks.cols;j++){
                if(blocks.obj[i][j] === 1){
                    ctx.fillStyle = color[i][j];//console.log('->',color[i][j]);
                    ctx.beginPath();
                    ctx.fillRect(j * (blocks.width + blocks.padding),i * (blocks.height + blocks.padding),blocks.width,blocks.height);
                    ctx.strokeRect(j * (blocks.width + blocks.padding),i * (blocks.height + blocks.padding),blocks.width,blocks.height);
                    ctx.closePath();
                }
            }
        }


    ctx.fillStyle = platforma.color;
    ctx.beginPath();
    ctx.fillRect(platforma.x,platforma.y,platforma.width,platforma.height);
    ctx.closePath();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if((ball.x + ball.radius + ball.dx> w) || (ball.x - ball.radius + ball.dx)< 0){
        ball.dx = -ball.dx;
//        ball.dy = -ball.dy;
    }
    if((ball.y + ball.radius + ball.dy> h) || (ball.y - ball.radius + ball.dy)< 0){
        ball.dy = -ball.dy;
//        ball.dy = -ball.dy;
    }
    if(ball.y + ball.radius + ball.dy > h - platforma.height - 20 && ball.y + ball.radius + ball.dy < h){//console.log(2);
        if(ball.x + ball.radius  >= platforma.x &&
           ball.x + ball.radius  < platforma.x + platforma.width){
                ball.dy = -ball.dy;
        }else{
            //game over
            game = false;
            gameOver();
        }

    }
    window.requestAnimationFrame(render);
    }else if(!win){
        gameOver();
    }else if(win){
        gameWin();
    }
}

function keyPress(e){
    switch (e.keyCode){
        case 37:
            if(platforma.x > 0){
                platforma.x -= platforma.dx;
            }
            break;
        case 38:
        case 39:
            if(platforma.x + platforma.width < w){
                platforma.x += platforma.dx;
            }
            break;
        case 40:
            break;
    }
        render2();
}

function render2(){
    ctx.clearRect(platforma.x,platforma.y,platforma.width,platforma.height);
    ctx.fillStyle = platforma.color;
    ctx.beginPath();
    ctx.fillRect(platforma.x,platforma.y,platforma.width,platforma.height);
    ctx.closePath();
}

function gameOver(){
    ctx.clearRect(0,0,w,h);
    var text = 'Game Over; Your Score:' + score;
//    background();
    var sound = new Audio('stop.mp3');
    sound.play();

    ctx.fillStyle = 'black';
    text_length = ctx.measureText(text).width;
    ctx.fillText(text,w/2 - text_length/2,h/2);
}
function background(){
    bg = new Image();
    bg.src = 'frac.jpg';
    ctx.drawImage(bg,0,0,w,h);
}

function gameWin(){
    ctx.clearRect(0,0,w,h);
    var text = 'Game Win; Your Score:' + score;
    ctx.fillStyle = 'black';
    text_length = ctx.measureText(text).width;
    ctx.fillText(text,w/2 - text_length/2,h/2);
}

//document.addEventListener('keydown',keyPress);
document.addEventListener('mousemove',function (e){
        if(!platforma){
            console.log('platfotma dosnt');
        }
        platforma.x = e.offsetX - platforma.width / 2;
    }
);




var refreshTimeout = 3000;
var roundTimeout = 50;

var rounds = 50;

var canvas = null;
var ctx = null;

var w = 800;
var h = 600;
var r = 200,//Math.floor(Math.random() * 256),
    g = 200,//Math.floor(Math.random() * 256),
    b = 200,//Math.floor(Math.random() * 256),
    a = 255;


pallet = [
    [255,255,255],
    [187,234,254],
    [255,247,0]
];


function init(){

    canvas = document.getElementById('c');

    fitCanvas();

    ctx = canvas.getContext('2d');
}

function fitCanvas(){
    canvas.width = document.body.clientWidth; 
    canvas.height = document.body.clientHeight; 
    w = canvas.width;
    h = canvas.height;

}

function run(){
    clearWorld();

    cRound = rounds;
    drawRound()
    



}


function clearWorld(){
    //clean canvas
    ctx.fillRect(0, 0, w, h);


    newRandPallet(4)

    randColor();
}

function newRandPallet(colors){
    pallet = []
    for(var i=0;i<colors;i++){
        pallet.push([
            rand(0,255),
            rand(0,255),
            rand(0,255)
        ])
    }
}

function setColor(i){
    c = pallet[i];
    r = c[0];
    g = c[1];
    b = c[2];
    a = 255;
    ctx.strokeStyle = "rgba("+r+","+g+","+b+","+(a)+")";

}
function randColor(){
    setColor(rand(0,pallet.length-1))
}


function drawRound(){
    cRound--;
    if(cRound == 0){
        window.setTimeout(run,refreshTimeout)
        return
    }
    //imageData = ctx.getImageData(0, 0, w, h);

    randColor();
    drawFrac();
    
    // if(rand(0,3)==1){
    //  randColor();
    //  drawLine();

    // }
    // else{
    //  setColor(0);
    //  drawSpray();

    // }

    //ctx.putImageData(imageData, 0, 0);
    window.setTimeout(drawRound,roundTimeout)

}

function rand(start,stop){
    return Math.floor(Math.random() * (stop - start+1)) + start;
}
function fuzz(x, f){
    return x + Math.random()*f - f/2;
}


function handDrawMovement(x0, x1, t){
    return x0 + (x0-x1)*(
            15*Math.pow(t, 4) -
            6*Math.pow(t, 5) -
            10*Math.pow(t,3)
    )
}
function handDrawLine(ctx, x0, y0, x1, y1){
    ctx.moveTo(x0, y0)

    var d = Math.sqrt((x1-x0)*(x1-x0)+(y1-y0)*(y1-y0))

    var steps = d/25;
    if(steps < 4) {
        steps = 4;
    }

    // fuzzyness
    var f = 8.0;
    for(var i = 1; i <= steps; i++)
    {
        var t1 = i/steps;
        var t0 = t1-1/steps
        var xt0 = handDrawMovement(x0, x1, t0)
        var yt0 = handDrawMovement(y0, y1, t0)
        var xt1 = handDrawMovement(x0, x1, t1)
        var yt1 = handDrawMovement(y0, y1, t1)
        ctx.quadraticCurveTo(fuzz(xt0, f), fuzz(yt0, f), xt1, yt1)
        ctx.moveTo(xt1, yt1)
    }
}


function drawLine()
{
    var startX = rand(0,w),
        startY = rand(0,h),
        endX = rand(0,w),
        enyY = rand(0,h),
        sparyCount=1;





    while(sparyCount--){

        var r=4,
            offX = startX + rand(-r,r),
            offY = startY + rand(-r,r),
            endoffX = endX + rand(-r,r),
            endoffY = enyY + rand(-r,r);

        ctx.lineWidth = 1;
        ctx.beginPath();
        handDrawLine(ctx,offX, offY,endoffX, endoffY)
        //ctx.moveTo(offX, offY);
        ctx.lineTo(endoffX, endoffY);
        ctx.stroke();
    }
}


function drawSpray()
{


    var sparyCount = 100;


    var pix = ctx.createImageData(1,1); // only do this once per page
    var d  = pix.data;                        // only do this once per page
    d[0]   = r;
    d[1]   = g;
    d[2]   = b;
    d[3]   = a;

    while(sparyCount--){
        var x = rand(0,w),
            y = rand(0,h);

        if(x<0 || y < 0 || x > w || y >h){
        console.log("x " + x + ", y " + y)
            sparyCount++;
            continue;
        }

        ctx.putImageData( pix, x, y ); 

    }

}

function drawFrac(){
    var sparyCount = 1000,
        r = 14;


    var pix = ctx.createImageData(1,1); // only do this once per page
    var d  = pix.data;                        // only do this once per page
    d[0]   = r;
    d[1]   = g;
    d[2]   = b;
    d[3]   = a;

        var x = rand(0,w),
            y = rand(0,h);

    while(sparyCount--){

        x = x + Math.cos(x)*r;
        y = y + Math.sin(y)*r;

        if(x<0 || y < 0 || x > w || y >h){
            //console.log("x " + x + ", y " + y)
            //sparyCount++;
            continue;
        }

        ctx.putImageData( pix, x, y ); 

    }
}





$(document).ready(function() {
    init();
    run();

});
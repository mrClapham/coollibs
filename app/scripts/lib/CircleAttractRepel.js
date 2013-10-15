/**
 * Created by grahamclapham on 09/10/2013.
 */


function CircleAttractRepel(){
this.center = 100;
}


CircleAttractRepel.prototype.setCenter = function(value){
    !isNaN(value) ? this.center=value : this.centre = this.centre;
}

CircleAttractRepel.drawCircle = function(ctx,x ,y,r){
    // ctx is the Context 2D.
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.stroke();
    ctx.fillStyle = "rgb(150,29,28)";
    ctx.fill();
}


CircleAttractRepel.prototype.drawCircles = function drawCircles(ctx, center, radius, angle){
    var currentAngle = 0;
    var steps = 360/angle;
    for(var i=0; i<steps; i++){
        var points = circleToXY(radius, currentAngle);
        console.log(points.y)
        drawCircle(ctx, points.x+center, points.y+center, 4 );
//                    var tx = addText(i, points.x+center, points.y+center, currentAngle);
//                    $('#canvasHolder').append(tx) ;
        currentAngle += angle;
    }
}
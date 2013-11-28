/**
 * Created with JetBrains WebStorm.
 * User: grahamcapham
 * Date: 22/10/2013
 * Time: 13:17
 * To change this template use File | Settings | File Templates.
 */
function SpiroGraph(targ){
    this.init(targ)
}
// METHODS

SpiroGraph.prototype.init = function(targ, config){

    this.targ = targ;
    this.width = 900;
    this.height = 900;
    this.centerX = 500;
    this.centerY = 500;
    this.radius = 280;
    this.angle = 0;
    this.canvas = document.getElementById(this.targ).appendChild(this.makeCanvas(1000, 1000));
    this.ctx = this.canvas.getContext("2d");
    this.currentAngle = 0;
    this.innerAngle = 0
    this.animInterval = null
    for(var prop in config){
        this[prop] = config[prop]
    }

    this.drawSpiral(this.ctx , this.centerX, this.centerY, this.radius,.001)
}


SpiroGraph.prototype.makeCanvas = function(width, height, id){
    var canvas = document.createElement("canvas");
    canvas.className    = "myClass";
    canvas.width        = width;
    canvas.height       = height;

    canvas.id = id;
    return canvas
}


SpiroGraph.drawCircle = function(ctx,x ,y,r, colour, border ){
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fillStyle = colour;
    ctx.strokeStyle=colour;

    !border ? ctx.fill() : ctx.stroke();
}



SpiroGraph.prototype.drawCircles =  function (ctx, centerX, centerY, radius, angle){
    this.currentAngle = 0;
    var steps = 360/angle;
    console.log("Steps : "+steps)
    for(var i=0; i<steps; i++){
        var points = SpiroGraph.circleToXY({x:centerX, y:centerY}, radius, currentAngle);
        console.log(points.y)
        SpiroGraph.drawCircle(ctx, points.x, points.y, 4 );
        this.currentAngle += angle;
    }
}

SpiroGraph.prototype.drawSpiral =  function (ctx, centerX, centerY, radius, angle){
    this.currentAngle = 0;
    var steps = 360/angle;
    console.log("Steps : "+steps)

    var _rad1, _rad2, _rad3;

    _rad1 = radius;
    _rad2 = 60;
    _rad3 = _rad2 / 10;

    SpiroGraph.drawCircle(ctx, centerX, centerY, radius , '#00cccc', true);

    var points = SpiroGraph.circleToXY({x:centerX, y:centerY}, _rad1,  this.currentAngle);

    var points2 = SpiroGraph.circleToXY({x:points.x, y:points.y}, _rad2,  this.currentAngle);
    // SpiroGraph.drawCircle(ctx, points2.x, points2.y, _rad2, '#ff0000', true );

    var points3 = SpiroGraph.circleToXY({x:points2.x, y:points2.y}, _rad2,  this.currentAngle);
    // SpiroGraph.drawCircle(ctx, points3.x, points3.y, _rad3, '#ff0000', true);


//    for(var i=0; i<steps; i++){
//        var points = SpiroGraph.circleToXY({x:centerX, y:centerY}, _rad1,  this.currentAngle);
//        SpiroGraph.drawCircle(ctx, points.x, points.y, 2, '#00ff00', false );
//
//        var gearRatio1 = (2 * Math.PI * _rad1) /  (2 * Math.PI * _rad2);
//        var gearRatio2 = (2 * Math.PI * _rad2) /  (2 * Math.PI * _rad3);
//
//        var points2 = SpiroGraph.circleToXY({x:points.x, y:points.y}, _rad2,  this.currentAngle  * gearRatio1);
//        SpiroGraph.drawCircle(ctx, points2.x, points2.y, 1, '#cc00cc', false );
//
//        var points3 = SpiroGraph.circleToXY({x:points2.x, y:points2.y}, _rad3,  this.currentAngle * gearRatio2);
//        SpiroGraph.drawCircle(ctx, points3.x, points3.y, 1 , '#00ffff', false);
//
//        this.currentAngle += angle;
//    }
    var _this = this

    this.animInterval = setInterval(function(){_this.drawGuidePath.call(_this) }, 4)

}

SpiroGraph.prototype.clear = function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
}

SpiroGraph.prototype.drawGuidePath = function(){
// this.clear()
    var _rad1, _rad2, _rad3;

    _rad1 = this.radius;
    _rad2 = 160;
    _rad3 = 82;

    var gearRatio1 = (2 * Math.PI * _rad1-_rad2) /  (2 * Math.PI * _rad2);
    var gearRatio2 = (2 * Math.PI * _rad1-_rad2) /  (2 * Math.PI * _rad3);

    SpiroGraph.drawCircle(this.ctx, this.centerX, this.centerY, this.radius , '#cccccc', true);
// innere circle
    var points = SpiroGraph.circleToXY({x:this.centerX, y:this.centerY}, _rad1-_rad2, this.currentAngle);

    var points2 = SpiroGraph.circleToXY({x:points.x, y:points.y}, _rad2, this.innerAngle*gearRatio1);

    //SpiroGraph.drawCircle(this.ctx, points.x, points.y, _rad2 , '#00ffff', true);

    SpiroGraph.drawCircle(this.ctx, points2.x, points2.y, 1, '#00ffff', false );

    var points3 = SpiroGraph.circleToXY({x:points2.x, y:points2.y}, -_rad3, this.innerAngle*gearRatio1);
    SpiroGraph.drawCircle(this.ctx, points3.x, points3.y, 1, '#ff00ff', false);

    this.currentAngle += 1
    this.innerAngle -= 1
}





// STATIC FUNCTIONS

/**
 * Convert degrees to radians
 * @param value
 * @returns {number}
 */
    SpiroGraph.toRadians = function(value){
    if(!isNaN(value)){
        return  value * Math.PI/180
    }else{
        throw new Error("Please provide a number value to convert to radians @function toRadians(value). ");
    }
}


/**
 * Converts a radius and angle into x and y positions, relative to the center of a circle.
 * @param radius
 * @param angle
 */
SpiroGraph.circleToXY = function (centre, radius, angle){
    var points = {x:0, y:0};

    if(!isNaN(centre.x) && !isNaN(centre.y) && !isNaN(radius) && !isNaN(angle) ){
        var radians =  SpiroGraph.toRadians(angle);
        points.x = centre.x + (radius * Math.cos(radians));
        points.y = centre.y + (radius * Math.sin(radians));
    }

    return points;
}
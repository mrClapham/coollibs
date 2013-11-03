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
    this.width = 800;
    this.height = 800;
    this.centerX = 500;
    this.centerY = 500;
    this.radius = 180;
    this.angle = 0;
    this.canvas = document.getElementById(this.targ).appendChild(this.makeCanvas(1000, 1000));
    this.ctx = this.canvas.getContext("2d");


    for(var prop in config){
        this[prop] = config[prop]
    }

    this.drawSpiral(this.ctx , this.centerX, this.centerY, this.radius,.01)
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
    var currentAngle = 0;
    var steps = 360/angle;
    console.log("Steps : "+steps)
    for(var i=0; i<steps; i++){
        var points = SpiroGraph.circleToXY({x:centerX, y:centerY}, radius, currentAngle);
        console.log(points.y)
        SpiroGraph.drawCircle(ctx, points.x, points.y, 4 );
        currentAngle += angle;
    }
}

SpiroGraph.prototype.drawSpiral =  function (ctx, centerX, centerY, radius, angle){
    var currentAngle = 0;
    var steps = 360/angle;
    console.log("Steps : "+steps)

    var _rad1, _rad2, _rad3;

    _rad1 = radius;
    _rad2 = _rad1 / 5;
    _rad3 = _rad2 / 6;

    SpiroGraph.drawCircle(ctx, centerX, centerY, radius , '#ff0000', true);

    var points = SpiroGraph.circleToXY({x:centerX, y:centerY}, _rad1, currentAngle);

    var points2 = SpiroGraph.circleToXY({x:points.x-_rad2, y:points.y-_rad2}, _rad2, currentAngle);
    SpiroGraph.drawCircle(ctx, points2.x, points2.y, _rad2, '#ff0000', true );

    var points3 = SpiroGraph.circleToXY({x:points2.x-_rad3, y:points2.y-_rad3}, _rad3, currentAngle);
    SpiroGraph.drawCircle(ctx, points3.x, points3.y, _rad3, '#ff0000', true);


    for(var i=0; i<steps; i++){

        var points = SpiroGraph.circleToXY({x:centerX, y:centerY}, _rad1, currentAngle);
        //SpiroGraph.drawCircle(ctx, points.x, points.y, 2 );

        var points2 = SpiroGraph.circleToXY({x:points.x-_rad2, y:points.y-_rad2}, _rad2, currentAngle*12);
        SpiroGraph.drawCircle(ctx, points2.x, points2.y, .25, '#cc00cc', false );

        var points3 = SpiroGraph.circleToXY({x:points2.x-_rad3, y:points2.y-_rad3}, _rad3, currentAngle*55);
        SpiroGraph.drawCircle(ctx, points3.x, points3.y, .25 , '#00ffff', false);

        currentAngle += angle;
    }
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
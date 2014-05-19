/**
 * Created with JetBrains WebStorm.
 * User: grahamcapham
 * Date: 22/10/2013
 * Time: 13:17
 * To change this template use File | Settings | File Templates.
 */

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();


function SpiroGraph(targ){
    this.init(targ);
}
// METHODS

SpiroGraph.prototype.init = function(targ, config){
    this.targ               = targ;
    this.width              = 1000;
    this.height             = 1000;
    this.centerX            = 500;
    this.centerY            = 500;
    this.radius             = 430;
    this.radius2            = 81;
    this.radius3            = 54;
    this.angle              = 0;
    this.increment          = 2
    this.canvas             = document.getElementById(this.targ).appendChild(this.makeCanvas(this.width, this.height));
    this.canvasGiudes       = document.getElementById(this.targ).appendChild(this.makeCanvas(this.width, this.height));
    this.canvasLines        = document.getElementById(this.targ).appendChild(this.makeCanvas(this.width, this.height));
    this.guideThickness     = .5
    this.ctx                = this.canvas.getContext("2d");
    this.ctxGuides          = this.canvasGiudes.getContext("2d");
    this.ctxLines           = this.canvasLines.getContext("2d");
    // colours
    this.outerColor         = 'rgba(0,255,255,0.2)';
    this.innerColour        = 'rgba(255,0,255,0.2)';
    this.innerLineThickness = .02;
    this.outerLineThickness = .02;

    this.currentAngle       = 0;
    this.innerAngle         = 0
    this.animInterval       = null;

    // Add the proerties from the initial config file
    for(var prop in config){
        this[prop] = config[prop]
    }
    // the lines part
    this.ctxLines.beginPath();
    this.ctxLines.strokeStyle='rgba(255,255,0,0.2)';

    //this.ctxLines.moveTo(0,0);

    this.drawSpiral(this.ctx , this.centerX, this.centerY, this.radius,.01)
}


SpiroGraph.prototype.makeCanvas = function(width, height, id){
    var canvas = document.createElement("canvas");
    canvas.className        = "myClass";
    canvas.width            = width;
    canvas.height           = height;
    canvas.style.position   = 'absolute';
    canvas.style.top        = '0';
    canvas.style.left       = '0';

    return canvas
}


SpiroGraph.prototype.drawCircle = function(ctx,x ,y,r, colour, border ){
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fillStyle = colour;
    ctx.strokeStyle=colour;
    ctx.setLineWidth(this.guideThickness)
    !border ? ctx.fill() : ctx.stroke();
}


SpiroGraph.prototype.drawCircles =  function (ctx, centerX, centerY, radius, angle){
    this.currentAngle = 0;
    var steps = 360/angle;
    console.log("Steps : "+steps)
    for(var i=0; i<steps; i++){
        var points = SpiroGraph.circleToXY({x:centerX, y:centerY}, radius, currentAngle);
        console.log(points.y)
        this.drawCircle(ctx, points.x, points.y, 4 );
        this.currentAngle += angle;
    }
}
/**
 * The function which starts the process of drawing the spirals.
 * @param ctx
 * @param centerX
 * @param centerY
 * @param radius
 * @param angle
 */
SpiroGraph.prototype.drawSpiral =  function (ctx, centerX, centerY, radius, angle){
    this.currentAngle = 0;
    var steps = 360/angle;
    console.log("Steps : "+steps)

    this.drawCircle(ctx, centerX, centerY, radius , '#cccccc', true);

    var points = SpiroGraph.circleToXY({x:centerX, y:centerY}, this.radius,  this.currentAngle);

    var points2 = SpiroGraph.circleToXY({x:points.x, y:points.y}, this.radius2,  this.currentAngle);
    // this.drawCircle(ctx, points2.x, points2.y, this.radius2, '#ff0000', true );
    var points3 = SpiroGraph.circleToXY({x:points2.x, y:points2.y}, this.radius2,  this.currentAngle);

    console.log('drawSpiral called')

    var _this = this

    // this.animInterval = setInterval(function(){_this.drawGuidePath.call(_this) }, 4)
    requestAnimationFrame(function(){_this.drawGuidePath.call(_this)})
}

SpiroGraph.prototype.clear = function(ctx){
    ctx.clearRect(0, 0, this.width, this.height);
}

SpiroGraph.prototype.drawGuidePath = function(){
    this.clear(this.ctxGuides)

    var gearRatio1 = (2 * Math.PI * this.radius-this.radius2) /  (2 * Math.PI * this.radius2);
    var gearRatio2 = (2 * Math.PI *  this.radius-this.radius2) /  (2 * Math.PI * this.radius3);

// inner circle
    var points = SpiroGraph.circleToXY({x:this.centerX, y:this.centerY}, this.radius-this.radius2, this.currentAngle);
    var points2 = SpiroGraph.circleToXY({x:points.x, y:points.y}, this.radius2, this.innerAngle*gearRatio1);

    //this.drawCircle(this.ctx, points2.x, points2.y,.5, '#00ffff', false );

    var points3 = SpiroGraph.circleToXY({x:points2.x, y:points2.y}, -this.radius3, this.innerAngle*gearRatio1);

    this.drawCircle(this.ctxGuides, this.centerX, this.centerY, this.radius , '#000000', true);
    this.drawCircle(this.ctxGuides, points.x, points.y, this.radius2 , '#454545', true);
    this.drawCircle(this.ctxGuides, points3.x, points3.y,3, '#ff00ff', false);
    this.drawCircle(this.ctxGuides, points2.x, points2.y,3, '#00ffff', false);

    // this.drawCircle(this.ctx, points3.x, points3.y,.5, '#cccccc', false);


    // this.ctx.stroke();

    this.ctx.lineTo(points2.x, points2.y);
    this.ctx.strokeStyle = this.innerColour;
    this.ctx.setLineWidth(this.innerLineThickness);
    this.ctx.stroke();

    this.ctxLines.lineTo(points3.x, points3.y);
    this.ctxLines.strokeStyle = this.outerColor;
    this.ctxLines.setLineWidth(this.outerLineThickness);
    this.ctxLines.stroke();




    this.currentAngle += this.increment
    this.innerAngle -= this.increment
    var _this = this
    requestAnimationFrame(function(){_this.drawGuidePath.call(_this)});

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

// Methods
/**
 * The overall radius of the whole image.
 * @param value
 */
SpiroGraph.prototype.setRadius = function(value){
    this.radius = value;
}
SpiroGraph.prototype.getRadius = function(){
    return this.radius;
}

SpiroGraph.prototype.setRadius2 = function(value){
    this.radius2 = value;
}
SpiroGraph.prototype.getRadius2 = function(){
    return this.radius2;
}
//-----------
SpiroGraph.prototype.setRadius3 = function(value){
    this.radius3 = value;
}
SpiroGraph.prototype.getRadius3 = function(){
    return this.radius3;
}

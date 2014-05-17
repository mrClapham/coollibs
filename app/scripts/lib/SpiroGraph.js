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


function SpiroGraph(targ, config){
    this.targ = targ;
    if(config){
        this.config = config;
    }
    this.init()
}
// METHODS

SpiroGraph.prototype.init = function(){
    this.width = 1000;
    this.height = 1000;
    this.centerX = 500;
    this.centerY = 500;
    this.radius = 430;
    this.radius2 = 201;
    this.radius3 = 54;
    this.angle = 0;
    this._gearRatio1 = 0
    this.increment = 2
    this.canvas = document.getElementById(this.targ).appendChild(this.makeCanvas(this.width, this.height));
    this.canvasGiudes = document.getElementById(this.targ).appendChild(this.makeCanvas(this.width, this.height));
    this.canvasLines = document.getElementById(this.targ).appendChild(this.makeCanvas(this.width, this.height));
    this.guideThickness = .5
    this.ctx = this.canvas.getContext("2d");
    this.ctxGuides = this.canvasGiudes.getContext("2d");
    this.ctxLines = this.canvasLines.getContext("2d");
    // colours
    this.outerColor = "#cccccc";
    this.innerColour = 'rgba(255,0,255,0.2)';
    this.guideColourOuter = '#FF00FF'
    this.guideColourInner = '#00FFFF'

    this.innerLineThickness = .5;
    this.outerLineThickness = .5;
    this.currentAngle = 0;
    this.innerAngle = 0
    this.anmInterval = null
    // the points
    this._points = [];
    this._points2 = [];
    this._points3 = []
    this._playing = true
    for(var prop in this.config){
        this[prop] = this.config[prop]
    }

    this.drawSpiral(this.ctx , this.centerX, this.centerY, this.radius, .1)
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

SpiroGraph.prototype.drawSpiral =  function (ctx, centerX, centerY, radius, angle){
    this.currentAngle = 0;
    var steps = 360/angle;


    this._points = SpiroGraph.circleToXY({x:this.centerX, y:this.centerY}, this.radius,  this.currentAngle);

    this._points2 = SpiroGraph.circleToXY({x:this._points.x, y:this._points.y}, this.radius2,  this.currentAngle);
    //this.drawCircle(ctx, points2.x, points2.y, this.radius2, '#ffff00', true );

    this._points3 = SpiroGraph.circleToXY({x:this._points2.x, y:this._points2.y}, this.radius2,  this.currentAngle);

    var _this = this

    // this.animInterval = setInterval(function(){_this.drawGuidePath.call(_this) }, 70)
    requestAnimationFrame(function(){
        if(_this.getPlaying() ){
            _this.draw.call(_this)
        }
    })
}

SpiroGraph.prototype.clear = function(ctx){
    ctx.clearRect(0, 0, this.width, this.height);
}

SpiroGraph.prototype.clearAll = function(){
  this.clear(this.ctx)
  this.clear(this.ctxGuides)
  this.clear(this.ctxLines)
  this.ctxLines.moveTo(0,0)
  this.ctxLines.beginPath()
}




SpiroGraph.prototype.drawGuidePath = function(){
    this.clear(this.ctxGuides)
    this.plotPoints();

    this.drawCircle(this.ctxGuides, this.centerX, this.centerY, this.radius , this.guideColourInner, true);
    this.drawCircle(this.ctxGuides, this._points.x, this._points.y, this.radius2 ,  this.guideColourOuter, true);
    var _tracerCircle = this.drawCircle(this.ctxGuides, this._points3.x, this._points3.y,3, '#00ff00', false);

}

SpiroGraph.prototype.plotPoints =function(){
    this._gearRatio1 = (2 * Math.PI * this.radius-this.radius2) /  (2 * Math.PI * this.radius2);
    this._points = SpiroGraph.circleToXY({x:this.centerX, y:this.centerY}, this.radius-this.radius2, this.currentAngle);
    this._points2 = SpiroGraph.circleToXY({x:this._points.x, y:this._points.y}, this.radius2, this.innerAngle*this._gearRatio1);
    this._points3 = SpiroGraph.circleToXY({x:this._points2.x, y:this._points2.y}, -this.radius3, this.innerAngle* this._gearRatio1);
}

SpiroGraph.prototype.drawSpiro = function(){
   // var gearRatio2 = (2 * Math.PI *  this.radius-this.radius2) /  (2 * Math.PI * this.radius3);

// inner circle
    this.plotPoints();
    this.drawCircle(this.ctx, this._points2.x, this._points2.y,.5, '#00ffff', false );
//    this.drawCircle(this.ctxGuides, this.centerX, this.centerY, this.radius , '#000000', true);

//    this.drawCircle(this.ctxGuides, points2.x, points2.y,3, '#00ffff', false);

    // the dot on the drawn line -- this.drawCircle(this.ctx, this._points3.x, this._points3.y,1.5, '#00ff00', true);
    /// This draws the radiating lines fron the two dots - inner and outer
    this.ctx.stroke();
    this.ctx.moveTo(this._points3.x, this._points3.y);

    this.ctx.lineTo(this._points2.x, this._points2.y);
    this.ctx.strokeStyle = this.innerColour;
    this.ctx.setLineWidth(this.innerLineThickness);
    this.ctx.stroke();

    ///
    this.ctxLines.lineTo(this._points3.x, this._points3.y);
    this.ctxLines.strokeStyle = this.outerColor;
    this.ctxLines.setLineWidth(this.outerLineThickness);
    this.ctxLines.stroke();

    this.currentAngle += this.increment
    this.innerAngle -= this.increment

}

SpiroGraph.prototype.draw = function(){
    var _this = this

    _this.drawGuidePath();
    if(_this.getPlaying()){
        _this.drawSpiro()

    }
    requestAnimationFrame(function(){_this.draw.call(_this)});

}


SpiroGraph.prototype.onRadiiChanged = function(){
    this.clearAll()
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

SpiroGraph.prototype.onPlayingChanged = function(){

}

// Methods
/**
 * The overall radius of the whole image.
 * @param value
 */
SpiroGraph.prototype.setRaduis = function(value){
    this.radius = value;
    this.onRadiiChanged();
}
SpiroGraph.prototype.getRaduis = function(){
    return this.radius;
}

SpiroGraph.prototype.setRaduis2 = function(value){
    this.radius2 = value;
    this.onRadiiChanged();
}
SpiroGraph.prototype.getRaduis2 = function(){
    return this.radius2;
}
//-----------
SpiroGraph.prototype.setRaduis3 = function(value){
    this.radius3 = value;
    this.onRadiiChanged();
}
SpiroGraph.prototype.getRaduis3 = function(){
    return this.radius3;
}

SpiroGraph.prototype.setPlaying = function(value){
    this._playing = value;
}
SpiroGraph.prototype.getPlaying = function(){
    return this._playing;
}






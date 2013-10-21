require.config({
    paths:{
        jquery:         "vendor/jquery",
        d3:             "vendor/d3.v3.min",
        easel:          "vendor/easel/easeljs-0.7.0.min",
        circCollision:  "lib/circlesCollisionDetect",
        angular:        "vendor/angular.min"
    }
});

require(['jquery','d3', 'easel', 'circCollision', 'angular' ], function($, d3, easel, circ, ng){



    var app = angular.module('baseApp', []);

    app.controller('baseController', function($scope){

    })

    app.directive('controlsDirective', function(scope, element, attrs){
        return {
            retrict: "E",
            link:function(scope, element, attrs){
                element.bind('mousenter', function(){
                    console.log("Mouseneter called")
                })
            }
        }

    })

    //-----

    function fibonaciSpiral(id){
        this.maxLeaves_     = 300
        // golden mea proportion
        this.g_             = 1/1.618033989;
        this.ga_            = 360 - 360 * this.g_;
        // The starting radius
        this.rad_           = 20;
        this.rGrowth_       = 1.005;
        this.cur_           = this.maxLeaves_;
        this.rot_           = 0;
        this.width          = 600;
        this.height         = 600;
        this.timer          = null;
        this.targ           = null;
        this.canvas         = null;
        this.degrees        = 0;
        this.stage          = null;
        this.id             = id
        //this.init(id)
    }

    fibonaciSpiral.prototype.setTarget = function(targ){
        console.log("setTarget")
        if(document.getElementById(targ)){
            this.targ=document.getElementById(targ);
            this.render();
        }
    }

    fibonaciSpiral.prototype.createStage = function(){
        console.log("createStage")
        this.stage =  new createjs.Stage("mainCanv");
        // this.targ.appendChild(this.canvas);


    }

    fibonaciSpiral.prototype.render = function(){
        console.log("render")

        this.targ.setAttribute('width', this.width+'px');
        this.targ.setAttribute('height', this.height+'px');
        this.targ.setAttribute('background-color', '#ff00ff');


        var canvas = document.createElement('canvas');
        canvas.id     = this.id;
        canvas.width  = this.width;
        canvas.height = this.height;
        canvas.style.zIndex   = 8;
        canvas.style.position = "absolute";
        canvas.style.border   = "1px solid";

    }

    fibonaciSpiral.plotPoints = function(startX, startY, degrees, radius){
        var points = []
        var x = Math.cos(radius * (degrees * Math.PI/180));
        var y = Math.sin(radius * (degrees * Math.PI/180));
           x+=startX;
           y+=startY;
        points = [x,y]

        return points;

    }

    fibonaciSpiral.makeCircle = function(){
        var circle = new createjs.Shape();
        circle.graphics.beginFill("#ff00ff").drawCircle(90, 90, 50);
        return circle;
    }

    fibonaciSpiral.prototype.onFrame = function(){

        var startX, startY, radius;
        startX = 300;
        startY = 300;
        radius = 200;
        this.degrees += 4;
        var points = fibonaciSpiral.plotPoints(startX, startY, this.degrees, radius)
        var circ = fibonaciSpiral.makeCircle()
        this.stage.addChild( circ)
        // console.log(circ )
        //console.log(this.stage)
    }

    fibonaciSpiral.prototype.startTimer = function(){
        var this_ = this
        this.timer = setInterval(function(){
            this_.onFrame();
        }, 1000)
    }

    fibonaciSpiral.prototype.init = function(id){
        this.createStage(id);
    }

    var _fib = new fibonaciSpiral('canvasId1')
    _fib.setTarget("fibDiv")
    _fib.createStage();
    //_fib.startTimer();


    console.log("Hello wide world", _fib)

});
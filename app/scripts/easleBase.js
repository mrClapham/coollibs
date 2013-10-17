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

    function fibonaciSpiral(){
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
    }

    fibonaciSpiral.prototype.setTarget = function(targ){

        if(document.getElementById(targ)){
            this.targ=document.getElementById(targ);
            this.render();
        }
    }

    fibonaciSpiral.prototype.render = function(){
        this.targ.setAttribute('width', this.width+'px');
        this.targ.setAttribute('height', this.height+'px');
        this.targ.setAttribute('background-color', '#ff00ff');


        var canvas = document.createElement('canvas');
        canvas.id     = "CursorLayer";
        canvas.width  = this.width;
        canvas.height = this.height;
        canvas.style.zIndex   = 8;
        canvas.style.position = "absolute";
        canvas.style.border   = "1px solid";


        this.targ.appendChild(canvas);
    }

    fibonaciSpiral.prototype.onFrame = function(){
        if(this.cur_){
            this.cur_= -this.cur_;
        }
        this.rot_ += this.ga_;
        this.rot -= parseInt(this.rot_ / 360) * 360;
        this.rad *= this.rGrowth_ ;
        var x = Math.cos(this.rot_ * Math.PI * 180) * this.rad_;
        var y = Math.sin(this.rot_ * Math.PI * 180) * this.rad_;
        console.log("rot leaves ",x)
    }

    fibonaciSpiral.prototype.startTimer = function(){
        var this_ = this
        this.timer = setInterval(function(){
            this_.onFrame();
        }, 1000)
    }

    var _fib = new fibonaciSpiral()
    _fib.setTarget("fibDiv")
    _fib.startTimer();

    var circCollis = new circ()


    console.log("Hello wide world", _fib)


});
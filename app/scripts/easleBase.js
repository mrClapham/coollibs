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

    var circCollis = new circ()


    console.log("Hello world", circCollis)


});
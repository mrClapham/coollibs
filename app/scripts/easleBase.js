require.config({
    paths:{
        jquery:"vendor/jquery",
        d3:"vendor/d3.v3.min",
        easel:"vendor/easel/easeljs-0.7.0.min"

    }
});

require(['jquery','d3', 'easel' ], function($, d3, easel){

        console.log("Hello world")
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

});
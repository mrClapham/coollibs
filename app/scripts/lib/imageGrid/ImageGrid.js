/**
 * Created by grahamclapham on 19/05/2014.
 */
var ImageGrid = (function (name){

    var _private = {
        _name:name,
        _image:null,
        _gridSpacing:5
    };

    var _scope = function(name){

   // private functions
   var  init = function(){
        console.log("initCaller ",_private._name)
        console.log("_gridSpacing ",_private._gridSpacing)
       }

    var _onGridSpacingChanged = function(){
            console.log(_private._gridSpacing+ " " + _private._name)
    }
        init();

    };

    _scope.prototype = {

            getWidth:function(){
                return _private.width
            },
            setWidth:function(value){
                _private.width = value;
            },
            getGridSpacing:function(){
               return  _private._gridSpacing;
            },
            setGridSpacing:function(value){
                _private._gridSpacing = value;
                _onGridSpacingChanged();
            }
    }

    return _scope;

})();

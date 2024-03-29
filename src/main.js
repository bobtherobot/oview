
window.oview = window.oview || {};
window.oview.main = (function(){

	"use strict";


    function Main(params){
        this.init(params);
    }

    var p = Main.prototype;

	p.ui = null;
    p.userOpts = null;
    p.callNum = null;

    p.toolbar = null;
    p.display = null;
    p.root = null;

	p.init = function(params){
        if(typeof params == 'string'){
            params = {
                elem : params
            }
        }
        params = params || {};

        if( ! params.elem ){
            throw new TypeError("No element to put this into!");
        }

        this.ui = {};
        this.userOpts = params;
        this.callNum = 1;

        this.makeUi = new oview.MakeUi({
            main : this,
            elem : params.elem
        });
        this.root = this.makeUi.root;

        this.ui = this.makeUi.list;

        this.save = new oview.Save(this);
        this.toolbar = new oview.Toolbar(this);
        this.display = new oview.Display(this);

	}
	
    p.add = function(obj, header, klass){

        if(typeof obj == 'string'){
            obj = window.oview.utils.JSONparse(obj);
        }
        window.oview.process.make(obj, header, this, klass);
    }

    p.destroy = function(){
        
    }

    window.oview.make = function(params){
        return new oview.Main(params);
    }

    window.oview.Main = Main;

	// return {
    //     init : init,
    //     add : add
	// }

}());

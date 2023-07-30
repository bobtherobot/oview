window.oview = window.oview || {};
window.oview.toolbar = (function(){
	
	"use strict";

    var version = "1";

	var userOptDefaults = {
		reverse : false,
		filter : "",
		asMin : false,
		searchMask : false,
		regx : false
	}

    function Toolbar(main){
        this.init(main);
    }

    var p = Toolbar.prototype;

	p.useSearchMask = null;
	p.ui = null;
	p.userOpts = null;
	p.saveDialogOpen = null;
	p.filterHistory = null; // to to instanciate InputHistory
	p.asMin = null;


    p.closeAll_bound = null;
    p.saveDataClick_bound = null;
    p.filterChange_bound = null;
    p.reverseClick_bound = null;
    p.clearOuput_bound = null;
    p.toggleMinClick_bound = null;
    p.regxClick_bound = null;
    p.toggleSearchMask_bound = null;

    p.userOptRef = null;

    p.main;

	p.init = function(main){

        this.main = main;

        this.useSearchMask = 0;
        this.userOpts = {};
        this.saveDialogOpen = false;
        this.filterHistory; // to to instanciate InputHistory
        this.asMin = false;
        
		this.ui = main.ui;


        this.closeAll_bound = this.closeAll.bind(this);
        this.saveDataClick_bound = this.saveDataClick.bind(this);
        this.filterChange_bound = this.filterChange.bind(this);
        this.reverseClick_bound = this.reverseClick.bind(this);
        this.clearOuput_bound = this.clearOuput.bind(this);
        this.toggleMinClick_bound = this.toggleMinClick.bind(this);
        this.regxClick_bound = this.regxClick.bind(this);
        this.toggleSearchMask_bound = this.toggleSearchMask.bind(this);


        this.setReverse_bound = this.setReverse.bind(this);
        this.setFilter_bound = this.setFilter.bind(this);
        this.setAsMin_bound = this.setAsMin.bind(this);
        this.setSearchMask_bound = this.setSearchMask.bind(this);
        this.setRegx_bound = this.setRegx.bind(this);

        this.filterHistoryChange_bound = this.filterHistoryChange.bind(this);

        this.userOptRef = {
            reverse 	: this.setReverse_bound,
            filter 		: this.setFilter_bound,
            asMin 		: this.setAsMin_bound,
            searchMask 	: this.setSearchMask_bound,
            regx 		: this.setRegx_bound
        }

		this.ui.clickMask.addEventListener("click", this.closeAll_bound);
		this.ui.save.addEventListener("click", this.saveDataClick_bound);
		this.ui.filter.addEventListener("input", this.filterChange_bound);
		this.ui.reverse.addEventListener("click", this.reverseClick_bound);
		this.ui.clear.addEventListener("click", this.clearOuput_bound);
		this.ui.toggleMin.addEventListener("click", this.toggleMinClick_bound);
		this.ui.regx.addEventListener("click", this.regxClick_bound);
		this.ui.searchMask.addEventListener("click", this.toggleSearchMask_bound);



        // gotta jump out of the stack
        setTimeout(() => {
            

            this.filterHistory = new oview.InputHistory({
                elem : this.ui.filter,
                block : this.ui.filterHistory,
                onchange : this.filterHistoryChange_bound,
                userOpts : this.userOpts,
                clickMask : this.ui.clickMask
            });

            var opts = oview.utils.JSONparse( localStorage.getItem("userOpts") );
            this.appyUserOpts(opts || userOptDefaults, true);

        }, 100)
        

		

		
	}


	p.toggleMinClick = function(){
		this.setAsMin( ! this.asMin);
	}

	p.setAsMin = function(val){
		this.asMin = val;
		if( ! val ){
			this.ui.toggleMin.classList.remove("oview-asMin")
		} else {
			this.ui.toggleMin.classList.add("oview-asMin")
		}
		this.setUserOpt("asMin", val)
		this.main.display.setAsMin(val);
	}

	p.toggleSearchMask = function(){
		if(this.useSearchMask == 0){
			this.useSearchMask = 1;
		} else if(this.useSearchMask == 1){
			this.useSearchMask = 2;
		} else if(this.useSearchMask == 2){
			this.useSearchMask = 0;
		} else {
			this.useSearchMask = 0;
		}
		this.setSearchMask(this.useSearchMask);
	}

	p.setSearchMask = function(val){
		this.useSearchMask = val;
		var icon = this.ui.searchMask.querySelector("i");

		icon.classList.remove("oview-closed");
		icon.classList.remove("oview-inverse");
		var klass = null;
		if( val == 1 ){
			klass = "oview-closed";
		} else if( val == 2 ){
			klass = "oview-inverse";
		}
		if(klass){
			icon.classList.add(klass)
		}
		
		this.setUserOpt("useSearchMask", val)
		this.main.display.setSearchMask(val);
	}

	// ---------------
	// modals
	// ---------------

	p.closeAll = function(){
		this.clickMaskHide();
		this.closeSaveDialog();
	}

	p.clickMaskShow = function(evt){
		this.ui.clickMask.style.display = "block";
	}
	p.clickMaskHide = function(evt){
		this.ui.clickMask.style.display = "none";
	}


	// save
	p.saveDataClick = function(evt){
		if( this.saveDialogOpen ){
			this.closeSaveDialog()
		} else {
			this.openSaveDialog()
		}
	}

	p.openSaveDialog = function(){
		this.clickMaskShow()
		this.saveDialogOpen = true;
		var elem = this.ui.saveDialog;
		elem.style.display = "inline-block";
		//ui.save.classList.add("oview-on");

		this.ui.save.classList.add("oview-active");
		var icon = this.ui.save.querySelector("i");
		icon.classList.add("oview-opened");
	}

	p.closeSaveDialog = function(){
		this.saveDialogOpen = false;
		this.ui.saveDialog.style.display = "none";
		//ui.save.classList.remove("oview-on");
		this.ui.save.classList.remove("oview-active");
		var icon = this.ui.save.querySelector("i");
		icon.classList.remove("oview-opened");
	}

	// ---------------
	// buttons
	// ---------------

	p.setUserOpt = function(key, val){
		this.userOpts[key] = val;
        this.userOpts.version = version;
        localStorage.setItem("userOpts", JSON.stringify(this.userOpts));
	}

	p.appyUserOpts = function(obj, fromInit){
		obj = obj || {};

		this.ui.filter.value = obj.filter || userOptDefaults.filter;

		for(var prop in userOptDefaults){
			var val = obj[prop] || userOptDefaults[prop];
			if(typeof val == 'undefined'){
				val = userOptDefaults[prop];
			}
            
            if(this.userOptRef[prop]){
                this.userOptRef[prop](val);
            } else {
                console.log("not userOptRef prop", prop)
            }
			
		}
	}

	

	

	// reverse
	p.reverseClick = function(evt){
		this.setReverse( ! this.userOpts.reverse );
	}

	p.setReverse = function(val){
        if(this.ui){
            var icon = this.ui.reverse.querySelector("i");
            if(val){
                icon.classList.remove("oview-down");
                icon.classList.add("oview-up");
            } else {
                icon.classList.add("oview-down");
                icon.classList.remove("oview-up");
            }
            this.setUserOpt("reverse", val);
		    this.main.display.setReverse(val);
        }
		
	}

	p.regxClick = function(evt){
		this.setRegx( ! this.userOpts.regx );
	}

	p.setRegx = function(val){
		var icon = this.ui.regx;
		if(val){
			icon.classList.add("oview-on");
		} else {
			icon.classList.remove("oview-on");
		}
		
		this.setUserOpt("regx", val);
		this.main.display.setRegx(val);
	}

	// clear output
	p.clearOuput = function(){
		this.main.display.clearOuput();
	}
	
	// ---------------
	// misc
	// ---------------

	p.filterChange = function(){
		this.setFilter(this.ui.filter.value);
	}
	p.setFilter = function(val){
		this.main.display.setFilter(val);
		this.setUserOpt("filter", val);
	}
	p.filterHistoryChange = function(info){
		this.setFilter(info.text);
		this.setRegx(info.regx == "1");
	}
	
    window.oview.Toolbar = Toolbar;

	// return {
	// 	init : init,
	// 	closeSaveDialog : closeSaveDialog
	// }

}())
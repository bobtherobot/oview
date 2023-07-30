window.oview = window.oview || {};
(function(){

	"use strict";

    var idleTimeOut = 60000 * 60 * 1; // 1 hour
    var optDefaults = {
		font : "default",
		fontSize : 10,
		lineHeight : 1,
		display : "light"
    }

    var RE_regExpOperators = /[|\\{}()[\]^$+*?.]/g;
	function escapeStringRegExp(str) {
		return str.replace(RE_regExpOperators, '\\$&');
	}

    function Display(params){
        this.init(params);
    }

    var p = Display.prototype;

	p.ui = null;
	p.entryList = null;
	p.filteredList = null;
	p.filter = null;
	p.reverseOutput = null;
	p.mark = null;
	p.asMin = null;
	p.useSearchMask = null;
	p.regx = null;
	p.RE_filter = null;

	p.TO_search = null;
	p.TO_mark = null;
	p.markOpts = null;

	p.TO_limiter = null;
    p.mouseDown_bound = null;
    p.mouseMove_bound = null;
    p.mouseUp_bound = null;

	p.clickedItem = null;
	p.mouseDidMove = null;

	p.init = function(main){
      
        this.main = main;

        this.entryList = [];
        this.filteredList = [];
        this.filter = "";
        this.reverseOutput = false;
     
        this.asMin = false;
        this.useSearchMask = 0;
        this.regx = false;
        this.markOpts = {
            debug : true,
            log : true
        }

        this.mouseDown_bound = this.mouseDown.bind(this);
        this.mouseMove_bound = this.mouseMove.bind(this);
        this.mouseUp_bound = this.mouseUp.bind(this);
        this.remark_bound = this.remark.bind(this);
        this.update_bound = this.update.bind(this);

		this.ui = this.main.ui;
		this.mark = new Mark(this.ui.output);
		this.ui.output.addEventListener("mousedown", this.mouseDown_bound);
        this.setOptions(main.userOpts)

        this.update();
        
	}

	p.mouseDown = function(evt){
		var elem = evt.target;
		this.clickedItem = elem.closest(".oview-data-line");
		if(this.clickedItem){
			document.addEventListener("mouseup", this.mouseUp_bound);
			document.addEventListener("mousemove", this.mouseMove_bound);
			document.addEventListener("mouseout", this.mouseUp_bound);
			document.addEventListener("mouseleave", this.mouseUp_bound);
		}
		
	}

	p.mouseMove = function(evt){
		this.mouseDidMove = true;
		//mouseUp(evt)
	}

	p.mouseUp = function(evt){
		document.removeEventListener("mousemove", this.mouseMove_bound);
		document.removeEventListener("mouseup", this.mouseUp_bound);
		document.removeEventListener("mouseleave", this.mouseUp_bound);
		if( ! this.mouseDidMove ){
			if(this.clickedItem){
				this.clickedItem.classList.toggle("oview-reveal");
				//clickedLine.classList.add("oview-reveal");
				//clickedLine.classList.remove("oview-reveal");
				//clickedLine.classList.add("oview-reveal");
			}
		}

		this.mouseDidMove = false;
		this.clickedItem = null;
		
	}


	p.update = function(entry){

		// prevent dormant tabs from consuming memory
		clearTimeout(this.TO_limiter);
		this.TO_limiter = setTimeout(() => {
			if(this.entryList.length > 50){
				this.clearOuput();
			}
		}, idleTimeOut)


		if(entry){
			this.entryList.push(entry);
		}


		this.filteredList = [];
		for(var i=0; i<this.entryList.length; i++){
			var item = this.entryList[i];

			if( ! item.elem ){
				if( ! item.builder ){
					//con sole.log("item.builder", item)
				}
				item.builder.build(item);
			}

			
			this.applyAsMin(item)
		
			
			var skip = false;
			
			

			if(this.RE_filter){
			
				// we don't match anything at all, then there's nothing to show,
				// because searchMask will only display the lines that have a match.
				if( this.useSearchMask == 1 && ! this.RE_filter.test(item.searchable) ){
					skip = true;
				} else {

					// when searchMask is active
					// ... there's at least one match in here, so we have to show the item
					// but we're going to filter individual lines and hide lines that 
					// don't match
					if(this.useSearchMask){
						item.filterOn(this.RE_filter, this.useSearchMask == 2);
					} else {
						// we're here because we're showing everything, and just need to restore
						// the entire line, and just highlighting search results.
						item.unFilter();
					}
				}
				
			} else {
				item.unFilter();
			}


			if( ! skip ){
				this.filteredList.push(item)
			}
			
		}
		
		if(this.reverseOutput){
			this.filteredList.reverse();
		}

		var outElem = this.ui.output;
		outElem.innerHTML = "";
		for(var i=0; i<this.filteredList.length; i++){
			outElem.appendChild(this.filteredList[i].elem);
		}

		clearTimeout(this.TO_mark);
		this.TO_mark = setTimeout(() => {
			this.mark.unmark({
				done : this.remark_bound
			});
		}, 100)
		
	}

	p.remark = function(){
		if(this.RE_filter){
			this.mark = this.mark.markRegExp(this.RE_filter, this.markOpts);
		}
	}


	p.clearElemRefs = function(){
		for(var i=0; i<this.entryList.length; i++){
			this.entryList[i].elem = null;
		}
	}
	
	p.setFilter = function(val){
		this.filter = val;
		if(val){
			if(this.regx){
				this.RE_filter = new RegExp(val, "i");
			} else {
				this.RE_filter = new RegExp(escapeStringRegExp(val), "i");
			}

		} else {
			this.RE_filter = null;
		}

		clearTimeout(this.TO_search);
		this.TO_search = setTimeout(this.update_bound, 100);

	}


	p.setReverse = function(val){
		this.reverseOutput = val;
		this.update();
	}

	p.setRegx = function(val){
		this.regx = val;
		this.setFilter(this.filter);
	}

	p.clearOuput = function(){
		while(this.entryList.length) {
			var item = this.entryList.shift();
			if(item){
				item.destroy();
			}
		}

		this.main.callNum = 1;
		this.update();
		
	}

	p.getFilteredList = function(){
		return this.filteredList;
	}
	
	p.getEntryList = function(){
		return this.entryList;
	}

	p.setAsMin = function(val){
		this.asMin = val;
		for(var i=0; i<this.entryList.length; i++){
			this.applyAsMin(this.entryList[i]);
		}

		this.update();
	}

	p.applyAsMin = function(entry){
		var elem = entry.elem;
		if(elem){
			var input = elem.querySelector(".oview-folder input");
			if(input){
				if(this.asMin){
					input.removeAttribute("checked");
				} else {
					input.setAttribute("checked", "1");
				}
			}
		}
		
	}

	p.setSearchMask = function(val){
		this.useSearchMask = val;
		this.update();
	}

    // =======================================
    // user configurable
    // =======================================

    // line spacing
	p.setLineHeight = function(val){
        val = val || optDefaults.lineHeight;
		val = oview.utils.cleanNumberInput(val, optDefaults.lineHeight)
		this.ui.output.style.lineHeight = val + "em";
		this.update();
	}

	// font size
	p.setFontSize = function(val){
        console.log("setFontSize", val)
        val = val || optDefaults.fontSize;
		val = oview.utils.cleanNumberInput(val, optDefaults.fontSize)
		this.ui.output.style.fontSize = val + "px";
		this.update();
	}

	// font
	p.setFont = function(val){
        val = val || optDefaults.font;
		this.ui.output.style.fontFamily = val;
		this.update();
	}

	// display
	p.setDisplay = function(val){
        val = val || optDefaults.display;
		//var darkKlass;
		if(val == "dark"){
			//darkKlass = " dark";
			this.ui.filterHistoryWrapper.classList.add("oview-dark");
			this.ui.output.classList.add("oview-dark");
			this.ui.tools.classList.add("oview-dark");
			this.ui.saveDialog.classList.add("oview-dark");
		} else {
			//darkKlass = "";
			this.ui.filterHistoryWrapper.classList.remove("oview-dark");
			this.ui.output.classList.remove("oview-dark");
			this.ui.tools.classList.remove("oview-dark");
			this.ui.saveDialog.classList.remove("oview-dark");
		}

		this.clearElemRefs();
		this.update();
	}

    p.setOptions = function(params){

        // this will set the defaults
        if( ! params ){
            this.setLineHeight();
            this.setFontSize();
            this.setFont();
            this.setDisplay();
        } else {
            if(typeof params == "object"){
                // only set the things they provided.
                if( typeof params.lineHeight != "undefined"){
                    this.setLineHeight(params.lineHeight);
                }
                if( typeof params.fontSize != "undefined"){
                    this.setFontSize(params.fontSize);
                }
                if( typeof params.font != "undefined"){
                    this.setFont(params.font);
                }
                if( typeof params.display != "undefined"){
                    this.setDisplay(params.display);
                }
            }
        }
    }

    p.destroy = function(){
        this.ui = null;
        this.entryList = null;
        this.filteredList = null;
        this.filter = null;
        this.reverseOutput = null;
        this.mark = null;
        this.asMin = null;
        this.useSearchMask = null;
        this.regx = null;
        this.RE_filter = null;
    
        this.TO_search = null;
        this.TO_mark = null;
        this.markOpts = null;
    
        this.TO_limiter = null;
        this.mouseDown_bound = null;
        this.mouseMove_bound = null;
        this.mouseUp_bound = null;
        this.remark_bound = null;
        this.update_bound = null;

    }

    window.oview.Display = Display;
	// return {
	// 	init : init,
	// 	update : update,
	// 	setFilter : setFilter,
	// 	setReverse : setReverse,
	// 	clearOuput : clearOuput,
	// 	getFilteredList : getFilteredList,
	// 	getEntryList : getEntryList,
	// 	setAsMin : setAsMin,
	// 	setSearchMask : setSearchMask,
	// 	setRegx : setRegx,
    //     setOptions : setOptions
	// 	//setExclude : setExclude
	// 	//setWrap : setWrap
	// }
})();
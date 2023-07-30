this.app = this.app || {};
(function(){

	var MAKEL;
	var uuid = 1;

	function InputHistory(params){
		this.init(params);
	}

	var p = InputHistory.prototype;

	p.showing = null;
	p.block = null;
	p.history = null;
	p.choose_bound = null;
	p.blockClick_bound = null;
	p.store_bound = null;
	p.change_bound = null;
	p.userOpts = null;
	p.itemList = null;

	p.init = function(params){
	
		MAKEL = MAKEL || oview.utils.makeElem;
		this.history = [];
		this.itemList = [];

        var json = localStorage.getItem('filterHistory');
        var obj = oview.utils.JSONparse(json);
        if(obj){
            this.history = obj;
        }

		this.showing = false;
		this.choose_bound = this.choose.bind(this);
		this.blockClick_bound = this.blockClick.bind(this);
		this.store_bound = this.store.bind(this);
		this.change_bound = this.change.bind(this);
		this.hide_bound = this.hide.bind(this);
		//this.inputDone_bound = this.inputDone.bind(this);

		this.userOpts = params.userOpts;
	
		this.clickMask = params.clickMask;
		this.clickMask.addEventListener("click", this.hide_bound);

		this.input = params.elem;
		this.block = params.block;
		this.onchange = params.onchange;

		this.input.addEventListener("click", this.blockClick_bound);
		this.input.addEventListener("input", this.change_bound);
		//this.input.addEventListener("change", this.change_bound);
		this.input.addEventListener("keyup", evt => {

			// 9	tab
			// 13	enter (return)
			// 37	left arrow
			// 38	up arrow
			// 39	right arrow 		
			// 40	down arrow 	

			var code = evt.keyCode;
			if (code === 9 || code === 13){
				this.hide();
			} else if (code == 40){ // down
				this.selectDown();
			} else if (code == 38){ // up
				this.selectUp();
			}
		});
		//this.input.addEventListener("blur", this.inputDone_bound);


	}

	p.selectedIndex = null;
	p.selectDown = function(evt){
		this.selectedIndex = this.selectedIndex || 0;
		if(this.selectedIndex > this.history.length - 1){
			this.selectedIndex = 0;
		}
		this.hightlightSelected();
		this.selectedIndex++;
	}

	p.selectUp = function(evt){
		this.selectedIndex--;
		this.selectedIndex = this.selectedIndex || 0;
		if(this.selectedIndex < 0){
			this.selectedIndex = this.history.length - 1;
		}
		this.hightlightSelected();
	}

	p.lastSelected = null;
	p.hightlightSelected = function(){
		var item = this.history[this.selectedIndex];
		if(item){
			if(this.lastSelected){
				if(this.lastSelected.elem){
					this.lastSelected.elem.classList.remove("oview-selected");
				}
			}
			if(item.elem){
				item.elem.classList.add("oview-selected");
				//item.elem.scrollIntoView({behavior: "smooth"}); // too jumpy
				item.elem.scrollIntoView();
				this.onchange({
					text : item.text,
					//exclude : elem.dataset.exclude == "1",
					regx : item.elem.dataset.regx == "1"
				});
				this.input.value = item.text;
			}
			this.lastSelected = item;
		}
		
	}
	
	//p.inputDone = function(){
	//	this.hide();
	//}
	
	p.blockClick = function(evt){
		if(this.showing){
			this.hide()
		} else {
			this.show();
		}
	}



	p.hide = function(){
		this.showing = false;
		this.block.style.display = "none";
		this.clickMask.style.display = "none";
		this.store();
	}

	p.change = function(evt){
		this.show(true);
		//clearTimeout(this._TO_filterChange)
		//this._TO_filterChange = setTimeout(this.inputDone_bound, 5000)
	}

	p.show = function(match){
		var val = (this.input.value || "").toLowerCase();
		//if(val){
			this.showing = true;
			this.block.style.display = "block";
			this.clickMask.style.display = "block";
			var elemList = [];
			for(var i=0; i<this.history.length; i++){
				var item = this.history[i];
				if(item){
					if( ! item.id ){
						item.id = uuid++;
					}
					if( ! item.elem ){
						// makeElem(type, klass, content, append, atts)
						var elem = MAKEL("div", "oview-item", item.text, this.block);
						elem.dataset.text = item.text;
						elem.dataset.regx = item.regx ? "1" : "0";
						//elem.dataset.exclude = item.exclude ? "1" : "0";
						elem.dataset.id = item.id;
						elem.addEventListener("click", this.choose_bound);
						item.elem = elem;
						if(item.regx){
							elem.classList.add("oview-regx");
						}
						// if(item.exclude){
						// 	elem.classList.add("oview-exclude");
						// }
					}

					if(item.elem){
						item.elem.style.display = "block";
						if(val && match){
						
							var lower = item.text.toLowerCase()
							if(item.text && (lower.indexOf(val) > -1 || val.indexOf(lower) > -1) ){
								elemList.push(item.elem);
							} else {
								item.elem.style.display = "none"
							}
							
						} else {
							elemList.push(item.elem);
						}
					}
					
					
					
				}
				
			}

			for (var i = 0; i < elemList.length; i++) {
				this.block.appendChild(elemList[i]);
			}
		//}
		
	}

	
	p.store = function(){
		var val = this.input.value;
		if(val){
			var storeit = true;
			for(var i=0; i<this.history.length; i++){
				var item = this.history[i];
				if(item){
					if(item.text === val && item.regx === this.userOpts.regx){
						storeit = false;
						break;
					}
				}
				
			}
			if(storeit){
				this.history.unshift({
					//exclude : this.userOpts.exclude,
					regx : this.userOpts.regx,
					text : val,
					id : uuid++
				});

				var saveList = [];
				for(var i=0; i<this.history.length; i++){
					var item = this.history[i];
					
					if(item && item.elem){
						item.elem.classList.remove("oview-selected");
						// just a convienent place to do some garbage collection
						if(i > 50){
							if(item.elem){
				
								item.elem.removeEventListener("click", this.choose_bound);
								this.block.removeChild(item.elem);
								item.elem = null; // garbage collect
							}
							this.history[i] = null; // garbage collect

						} else {
							saveList.push({
								//exclude : item.exclude,
								regx : item.regx,
								text : item.text
							});
						}
						
					}
				}
                localStorage.setItem("filterHistory", JSON.stringify(saveList));
				
			}

		}

	}

	p.choose = function(evt){
		var elem = evt.target;
		var text = elem.dataset.text;
		this.input.value = text;
		this.hide();
		this.onchange({
			text : text,
			//exclude : elem.dataset.exclude == "1",
			regx : elem.dataset.regx == "1"
		});
	}

	oview.InputHistory = InputHistory;
}());
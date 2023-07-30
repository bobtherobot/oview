window.oview = window.oview || {};
(function(){

	function Entry(params){
		this.init(params);
	}

	var p = Entry.prototype;
	p.id = null;
	p.date = null;
	p.raw = null;
	p.data = null;
	p.searchable = null;
	p.saveable = null;
	p.elem = null;
	p.builder = null;
	p.reqUrl = null;

	p.init = function(params){
        this.main = params.main;
		this.id = params.id;
		this.date = Number(new Date().getTime());
		this.raw = params.raw;
		this.data = params.data;
		this.type = params.type;
		this.reqUrl = params.reqUrl;
		this.header = params.header;
        var title = "#" + (this.main.callNum - 1);
        var hdr = params.header;
        if(hdr) {
            title += " - " + hdr;
        }
        this.header = title;

		this.saveable = [];
		this.searchable = {};
	
		this.builder = window.oview.process;
	}

	p.filterOn = function(re, inverse){
		var lines = this.elem.querySelectorAll(".oview-data-line");
		var len = lines.length;
		
        var stayOpen = [];

		for(var i=0; i<len; i++){
			var elem = lines[i];
			var text = elem.innerText;
			if(inverse){
				
				// if you DON'T have it, show it
				elem.style.display = ! re.test(text) ? "block" : "none";

			} else {
				// if you have it, show it
                var hasIt = re.test(text);
				elem.style.display = hasIt ? "block" : "none";
                if(hasIt){
                    findParents(elem, stayOpen);
                }
			}
			
		}

        // i don't know, this is wonky
        if(!inverse){
            var folders = this.main.root.querySelectorAll(".oview-folder");
            for(var i=0; i<folders.length; i++){
                var item = folders[i];
                if(stayOpen.indexOf(item) < 0){
                    item.style.display = "none";
                } else {
                    item.style.display = "block";
                }
            }
        }
        
		
	}

    function findParents(elem, arr){
        var par = elem.closest(".oview-folder");
        while(par){
            if(arr.indexOf(par) < 0){
                arr.push(par);
            }
            par = par.parentNode.closest(".oview-folder")
        }
    }

	p.unFilter = function(re){
		var lines = this.elem.querySelectorAll(".oview-data-line, .oview-folder");
		for(var i=0; i<lines.length; i++){
			lines[i].style.display = "block";
		}
	}

	p.destroy = function(){
		this.id = null;
		this.date = null;
		this.raw = null;
		this.data = null;
		this.searchable = null;
		this.saveable = null;
		this.elem = null;
		this.builder = null;
		this.reqUrl = null;
		this.header = null;
	}

	window.oview.Entry = Entry;

}())
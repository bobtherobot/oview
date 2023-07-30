window.oview = window.oview || {};
(function(){

	"use strict";

    function Save(main){
        this.init(main);
    }

    function saveFile (content, filename, contentType) {
		var a = document.createElement('a');
		var file = new Blob([content], {type: contentType});
		
		a.href= URL.createObjectURL(file);
		a.download = filename;
		a.click();
	  	URL.revokeObjectURL(a.href);
	};

    function getCssText() { 
		var sheets = document.styleSheets;
		var data = [];
		for (let i = 0; i < sheets.length; i++) {
			var item = sheets[i].cssRules;
			for (let k = 0; k < item.length; k++) {
				data.push(item[k].cssText);
			}
		}
		return data.join("\n");
	}

    function cleanForCsv(str){
		return (str + "").replace(/["\r\n\t]/g, " ");
	}

    var p = Save.prototype;

	p.main = null;
	p.ui = null;

    p.json_bound = null;
    p.csv_bound = null;
    p.text_bound = null;
    p.html_bound = null;

	p.init = function(main){
        this.main = main
		this.ui = main.ui;

        this.json_bound = this.json.bind(this);
        this.csv_bound = this.csv.bind(this);
        this.text_bound = this.text.bind(this);
        this.html_bound = this.html.bind(this);

        this.getCsv_bound = this.getCsv.bind(this);
        this.getHtml_bound = this.getHtml.bind(this);
        this.getJson_bound = this.getJson.bind(this);
        this.getText_bound = this.getText.bind(this);

		this.ui.saveJson.addEventListener("click", this.json_bound);
		this.ui.saveCsv.addEventListener("click", this.csv_bound);
		this.ui.saveText.addEventListener("click", this.text_bound);
		this.ui.saveHtml.addEventListener("click", this.html_bound);

        // globals
        main.getCsv = this.getCsv_bound;
        main.getHtml = this.getHtml_bound;
        main.getJson = this.getJson_bound;
        main.getText = this.getText_bound;
	}





	p.getList = function(){
		// return oview.display.getEntryList()
		return this.main.display.getFilteredList();
	}

    p.getJson = function(){
        //var list = getList();
        var list = this.main.display.getEntryList();
        var out = [];
        for(var i=0; i<list.length; i++){
            //out.push(list[i].saveable);
            var item = list[i];
            out.push({
                title : item.header,
                data : item.data
            });
        }
        return JSON.stringify(out, null, "\t")
    }

	p.json = function(evt){
		
		saveFile(this.getJson(), "data.json", "text/json");
		this.closeSaveDialog();
	}

    p.getText = function(){
        var list = this.getList();
		var out = [];
		for(var i=0; i<list.length; i++){
			var item = list[i];
            var able = item.saveable;
            out.push("--------- " + (item.header) + " ---------");
            for(var prop in able){
                // gotta force numbers to string
                out.push(prop + "\t" + ( (able[prop] || "") + "" ).replace(/\r\n|\n|\r|\t/gm, ""));
            }
		}
		return out.join("\n");
    }

	p.text = function(evt){
		saveFile(this.getText(), "data.txt", "text/plain");
		this.closeSaveDialog();
	}



	

    p.getHtml = function(){
        var styles = "<style>\n" + getCssText() + "\n</style>\n";
		return styles + this.ui.output.outerHTML;
    }

	p.html = function(evt){
		saveFile(this.getHtml(), "data.html", "text/html");
		this.closeSaveDialog();
	}

    p.getCsv = function(){
        var list = this.getList();

		var rows = [];
        var Arows = [];

		// headers
		var header = [];
		for(var i=0; i<list.length; i++){
			var item = list[i];
            if(item.saveable){
                var able = item.saveable;
                for(var prop in able){
                    if(header.indexOf(prop) < 0){
                        header.push(prop);
                    }
                }
            }
		}

		oview.utils.naturalSort(header);

		var copyHeader = header.slice();
		for(var i=0; i<copyHeader.length; i++){
			copyHeader[i] = '"' + cleanForCsv(copyHeader[i]).replace(/^events.0.xdm./, "") + '"';
		}
		rows.push(copyHeader.join(","));
        Arows.push(copyHeader);

		for(var i=0; i<list.length; i++){
			var item = list[i];
            if(item.saveable){
                var line = [];
                var able = item.saveable;
                for(var k=0; k<header.length; k++){
                    line.push('"' + cleanForCsv(able[header[k]] || " ") + '"');
                }
                rows.push(line.join(","));
                Arows.push(line);
            }
		}
        var filedata;
        //var rotate = document.getElementById("rotateCVS");
        // data-oview-id="rotateCVS"
        var rotate = this.ui.rotateCVS;
 
        if(rotate && rotate.checked){
            var width = Arows.length;
            var height = Arows[0].length;

            var prows = new Array(height);
            for(var i=0; i<height; i++){
                prows[i] = new Array(width);
            }

            for(var i=0; i<width; i++){
                var item = Arows[i];
                for(var h=0; h<height; h++){
                    prows[h][i] = item[h];
                }
            }

            var Aprows = [];
            for(var i=0; i<height; i++){
                Aprows.push(prows[i].join(","));
            }

            filedata = Aprows.join("\n");

        } else {
            filedata = rows.join("\n");
        }

        return filedata;
	
    }

	p.csv = function(evt){
		
		saveFile(this.getCsv(), "data.csv", "text/csv");
		this.closeSaveDialog();
	}

	

	p.closeSaveDialog = function(){
		this.main.toolbar.closeSaveDialog();
	}

    p.destroy = function(){

        this.main = null;
        this.ui = null;

        this.json_bound = null;
        this.csv_bound = null;
        this.text_bound = null;
        this.html_bound = null;

        this.getCsv_bound = null;
        this.getHtml_bound = null;
        this.getJson_bound = null;
        this.getText_bound = null;
    }

    window.oview.Save = Save;

	// return {
	// 	init : init,
	// 	csv : csv,
	// 	html : html,
	// 	json : json,
	// 	text : text,
    //     getCsv : getCsv,
    //     getHtml : getHtml,
    //     getJson : getJson,
    //     getText : getText
	// }

}())
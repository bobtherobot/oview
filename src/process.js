window.oview = window.oview || {};

window.oview.process = (function(){
	
	"use strict";

	var searchableDelimiter = "_%|%_";

	function make(srcObj, header, main, klass){

		if(srcObj && typeof srcObj == "object") {
			var raw = JSON.stringify(srcObj);

			var entry = new oview.Entry({
				raw : raw.replace(/\\/g, ""),
				data : srcObj,
				id : main.callNum++,
                header : header,
                main : main,
                klass : klass
			});

			var flat = oview.utils.flatten(srcObj)
			entry.saveable = oview.utils.flatten(srcObj);

			var str = "";
			for(var prop in flat){
				str += prop + searchableDelimiter + flat[prop];
			}
			entry.searchable = str;

			build(entry);

			main.display.update(entry);

			return true;
		} else {
			return false;
		}
		

	}


	function build(entry){

		var data = entry.data;
		var srcDL = oview.utils.sortObjKeys(data);
 
		var type = entry.type || "page";

		// -----------
		// title
		// -----------

		var drawObject = oview.utils.drawObject;

		var block = oview.utils.makeElem("div", "oview-data-block" + (type ? " oview-" + type : "") + (entry.klass ? " " + entry.klass : "") );
		// var blockFolder = oview.utils.makeFolder({
		// 	title : entry.header || "entry #" + (entryNum++), 
		// 	type : type, 
		// 	appendTo : block
		// });

       
		drawObject({
			entry : entry,
			obj : srcDL,
			name : entry.header,
			target : block, //blockFolder,
			headerKlass : "oview-folder-title",
			closed : false
		});

		entry.elem = block;

	}


	return {
		make : make,
		build : build
	}

}());
window.oview = window.oview || {};
window.oview.utils = (function(){

	"use strict";
	
	var uuid = 0;

	function strToObj(str){
		var ret = {};
		var Aqs = str.replace(/^\?/, "").split("&");
		Aqs.forEach(item => {
			var Aitem = item.split("=");
			ret[decodeURIComponent(Aitem[0])] = decodeURIComponent(Aitem[1]);
		});
		return ret;
	}

    /**
     * @method forceNumber - converts whatever is thrown at it into a ration number. (result may be float or integer, depending on provided value.)
     * @param {anything} val
     * @returns {number}
     */
    function forceNumber(val) {
        // crap example: "250.0, 0.0" <--regexp still keeps 2 dots
        return Number(("" + val).replace(/[^0-9.-]+/g, "") || "0") || parseInt(val, 10) || 0;
    }

	function cleanNumberInput(val, min){
        val = forceNumber(val)
		if(!val || val < min){
			val = min
		}
		return val;
	}

	function sortOn(arr, prop, reverse, numeric) {

	    // Ensure there's a property
	    if (!prop || !arr) {
	        return arr
	    }


	    if (arr.length < 1) {
	    	return arr;
	    }

	    if(typeof numeric == 'undefined'){
	    	var first = arr[0][prop];
		    if(typeof first == 'number'){
		    	numeric = true;
		    }
	    }

	    var sort_by = function (field, rev, num) {

			var primer = num ? function(val){
				return parseFloat(String(val).replace(/[^0-9.\-]+/g, ''));
			} : function(val){
				return String(val).toLowerCase();
			}

			var r = rev ? -1 : 1;

	        // Return the required a,b function
	        return function (a, b) {

	            // Reset a, b to the field
	            a = primer(a[field]), b = primer(b[field]);

	            // Do actual sorting, reverse as needed
	            //return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
				//var result = ((a > b) - (b > a)) * ();


				if(num){

					return (a-b) * r;
				} else {
					//return a.localeCompare(b) * r;
					return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * r;
				}

	        };

	    }

	    // Distinguish between numeric and string to prevent 100's from coming before smaller
	    // e.g.
	    // 1
	    // 20
	    // 3
	    // 4000
	    // 50

	    arr.sort( sort_by(prop, reverse, numeric) );


	}

	function naturalSort(arr){
		var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
		arr.sort(collator.compare);
        return arr // not needed, but some folks like it to be returned.
	}


	function getNumber(val){
		return val.replace(/[^0-9]/, "");
	}

	// ------------------
	// example
	// ------------------
	// var elem = makeFolder({
	// 	title : "Meta", 
	// 	type : type, 
	// 	appendTo : blockFolder,
	// 	closed : true,
	// 	className : "for-top-level-title"
	// });
	function makeFolder(params){
		
		/*
		title, type, appendTo

		<div class="data-block link">
			<div class="folder">
				<input type="checkbox" id="folder1" checked />
				<label for="folder1" class="header product">#10 - CUSTOM LINK : sku updated offer details</label>
				<div class="folder-content">	

		*/

		var folder = makeElem({
			kind : "div", 
			className : "oview-folder", 
			appendTo : params.appendTo
		});

		var folderUID = "oviewfolderid" + uuid++;

		var inputObj = {
			kind 		: "input", 
			type 		: "checkbox",
			id 			: folderUID,
			appendTo 	: folder
		}
		if( ! params.closed ){
			inputObj.checked = 1;
		}
		makeElem(inputObj);

		var type = params.type;
		var label = makeElem({
			kind 		: "label", 
			className 	: "oview-folder-header" + (type ? " " + type : "") + ( params.headerKlass ? " " + params.headerKlass : ""),
			content 	: params.title,
			//title 		: params.title,
			"for" 		: folderUID,
			appendTo : folder
		});

		if(params.value){
			makeElem("pre", "tab-char", "\t", label);
			makeElem({
				kind 		: "span", 
				className 	: "oview-folder-header-value", //  + (type ? " " + type : "")
				content 	: params.value,
				//title 		: params.value,
				appendTo : label
			});
		}
		

		var content = makeElem({
			className 	: "oview-folder-content",
			appendTo : folder
		});


		return content
	}

	function drawLineItem(item, target, searchable, saveable, numeric){

		//var makeElem = oview.utils.makeElem;
		var klass = item.klass ? " " + item.klass : "";
		var line = makeElem("div", "oview-data-line" + klass, null, target);
		//var wrapData = makeElem("div", "data-wrap", null, line);
		makeElem("span", "oview-name", item.name, line);
		//makeElem("text", null, "&#9;", line);
		makeElem("pre", "oview-tab-char", "\t", line);

		makeElem({
			kind : "span", 
			className : "oview-value" + (numeric ? " oview-numeric" : ""), 
			content : item.value, 
			appendTo : line,
			//title : item.value
		});
		if(searchable){
			searchable.push(item.name + "=" + item.value);
		}
		if(saveable){
			var prefix = item.prefix ? item.prefix : "";
			saveable[prefix + item.name] = item.value;
		}
	}

	/**
	 * @method makeElem - creates a DOM element
	 * @param {any} type - object
	 * @param {*} klass 
	 * @param {*} content 
	 * @param {*} append 
	 * @param {*} atts 
	 * @returns DOM element
	 * 
	 * @example
	 * 
	 * 		makeElem({
	 * 			content : "text inside",
	 * 			appendTo : someElem,
	 * 			className : "bob",
	 * 			title : "hover title"
	 * 			anyOtherAttribute : "hover title"
	 * 		})
	 */
	function makeElem(type, klass, content, append, atts){
		if(typeof type == 'object'){
			var elem = document.createElement(type.kind || "div");
			for(var prop in type){
				if(prop != "kind"){
					var val = type[prop];
					if(prop == "content"){
						elem.innerHTML = val;
					} else if(prop == "appendTo"){
						val.appendChild(elem);
					} else if(prop == "className"){
						elem.setAttribute("class", val);
					} else {
						elem.setAttribute(prop, val);
					}
					
				}
			}
		} else {
			type = type || "div";
			var elem = type == "text" ? document.createTextNode(content) : document.createElement(type);
			if(klass && type != "text"){
				elem.className = klass
			}
			if(content && type != "text"){
				elem.innerHTML = content;
			}
			if(append){
				append.appendChild(elem);
			}
			if(atts){
				for(var prop in atts){
					elem.setAttribute(prop, atts[prop]);
				}
			}
		}
		
		return elem;
	}

	function objValList(obj, list){
		if(!obj){
			return "";
		}
		var Alist = list.split(",");
		var ret = [];
		for(var i=0; i<Alist.length; i++){
			var val = obj[ Alist[i].trim() ];
			if(val){
				ret.push(val);
			}
		}

		return ret.join(", ");
	}

	function drawObject(params){
		var obj = params.obj;
		var name = params.name;
		var target = params.target;
		var closed = params.closed;

		var entry = params.entry;
		var type = entry.type;
		var searchable = null; // entry.searchable;
		var saveable = null; // entry.saveable;

		var folder = makeFolder({
			title : name, 
			value : params.value, 
			type : type, 
			appendTo : target,
			headerKlass : params.headerKlass,
			closed : closed
		});

		if(Array.isArray(obj)){
			for(var i=0; i<obj.length; i++){
				var item = obj[i];
				var type = typeof item;
				if(type == 'object'){
					drawObject({
						entry : entry,
						obj : item,
						name : i,
						target : folder,
						headerKlass : params.headerKlass,
						closed : closed
					});
				} else {
					drawLineItem({
						name : i,
						value : item,
					}, folder, searchable, saveable, type == 'number');
				}
			}
		} else if(typeof obj == 'object' && obj != null){

			for(var prop in obj){
				var item = obj[prop];
				var type = typeof item;
				if(type == 'object'){
					drawObject({
						entry : entry,
						obj : item,
						name : prop,
						target : folder,
						headerKlass : params.headerKlass,
						closed : closed
					});
				} else {
					drawLineItem({
						name : prop,
						value : item,
					}, folder, searchable, saveable, type == 'number');
				}
			}
		}

		return folder
	}

	function flatten(thing, delimiter, par, out) {
		delimiter = delimiter || ".";
		par = par || "";
		out = out || {};
	
		if(typeof thing == 'object' && thing !== null){
			if (Array.isArray(thing)) {
			  
				for (var i = 0; i < thing.length; i++) {
					var val = thing[i];
					var path = par ? par + delimiter + i : i;
					if(typeof thing == 'object' && val !== null){
						flatten(val, delimiter, path, out)
					} else {
						out[path] = val;
					}
					
				}
			} else {
				for (var prop in thing) {
					var val = thing[prop];
					var path = par ? par + delimiter + prop : prop;
					if(typeof val == 'object' && val !== null){
						flatten(val, delimiter, path, out);
					} else {
						out[path] = val;
					}
				}
				
			}
		}
		return out;
	}

	var GetSet = {
		get:function(t,r,e){if("string"==typeof t&&(t=window[t]),e=e||".",!r)return null;var n,i=r.split(e),o=i.pop(),f=t,p=i.length;if(f&&p)for(var u=0;u<p;u++){var l=f[i[u]];if(!l){f=null;break}f=l}return f&&void 0!==f[o]&&(n=f[o]),n},set:function(t,r,e,n){if("string"==typeof t&&(t=window[t]),!t)return e;n=n||".","string"!=typeof(r=r||"undefined")&&(r="unsupported_key_type");var i=r.split(n),o=i.pop(),f=t,p=i.length;if(p)for(var u=0;u<p;u++){var l=i[u],a=f[l];a&&"object"==typeof a||(a=f[l]={}),f=a}return f[o]=e}
	};

	function setCssRule(selector, data){
		var rule = DynaCss.getRule(selector);
		if( ! rule ){
			rule = DynaCss.addRule(selector, data, true);
		} else {
			for(var prop in data){
				rule[prop] = data[prop];
			}
		}
	}

    // function naturalSort(as, bs){
	// 	var a, b, a1, b1, i= 0, n, L,
	// 	rx=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
	// 	if(as=== bs) return 0;
	// 	a= as.toLowerCase().match(rx);
	// 	b= bs.toLowerCase().match(rx);
	// 	L= a.length;
	// 	while(i<L){
	// 		if(!b[i]) return 1;
	// 		a1= a[i],
	// 		b1= b[i++];
	// 		if(a1!== b1){
	// 			n= a1-b1;
	// 			if(!isNaN(n)) return n;
	// 			return a1>b1? 1:-1;
	// 		}
	// 	}
	// 	return b[i]? -1:0;
	// }

	function sortObjKeys(obj){
		var list = naturalSort(Object.keys(obj));
		var ret = {};
		for(var i=0; i<list.length; i++){
			var key = list[i];
			ret[key] = sortObjKeysChooser(obj[key]);
		}
		return ret;
	}

    function sortObjKeysChooser(val){
        if(Array.isArray(val)){
            naturalSort(val);
            for(var ii=0; ii<val.length; ii++){
                val[ii] = sortObjKeysChooser(val[ii]);
            }
        } else if(val && typeof val == 'object') {
            val = sortObjKeys(val);
        }
        return val;
    }

    function JSONparse(str) {
        var obj = null;
        try {
            obj = JSON.parse(str);
        } catch (e) {
            // ignore
        }
    
        if (!obj) {
            try {
                // loose JSON parse, when str looks like a normal JS object:
                //   {a:"foo"} -> converts to -> {"a":"foo"}
                // alternative is to evil eval
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
                obj = Function('"use strict";return (' + str + ')')();

              } catch (e) {
                // ignore
            }
        }
    
        return obj;
    }
	

	return {
		strToObj : strToObj,
		sortOn : sortOn,
		naturalSort : naturalSort,
        sortObjKeys : sortObjKeys,
		getNumber : getNumber,
		makeElem : makeElem,
		makeFolder : makeFolder,
		drawLineItem : drawLineItem,
		cleanNumberInput : cleanNumberInput,
		flatten : flatten,
		drawObject : drawObject,
		GetSet : GetSet,
		objValList : objValList,
		setCssRule : setCssRule,
        JSONparse : JSONparse

	}
}())

